import { http, HttpResponse } from "msw"
import { setupWorker } from "msw/browser"
import { factory, oneOf, manyOf, primaryKey } from "@mswjs/data"
import { nanoid } from "@reduxjs/toolkit"
import { faker } from "@faker-js/faker"
import { Server as MockSocketServer } from "mock-socket"

import { parseISO } from "date-fns"

const NUM_USERS = 3
const POSTS_PER_USER = 3
const RECENT_NOTIFICATIONS_DAYS = 7

const ARTIFICIAL_DELAY_MS = 2000

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

let useSeededRNG = true

if (useSeededRNG) {
  let randomSeedString = localStorage.getItem("randomTimestampSeed")
  let seedDate

  if (randomSeedString) {
    seedDate = new Date(randomSeedString)
  } else {
    seedDate = new Date()
    randomSeedString = seedDate.toString()
    localStorage.setItem("randomTimestampSeed", randomSeedString)
  }

  faker.seed(seedDate.getTime())
}

function getRandomInt(min, max) {
  return faker.number.int({ min, max })
}

const randomFromArray = array => {
  const index = getRandomInt(0, array.length - 1)

  return array[index]
}

export const db = factory({
  user: {
    id: primaryKey(nanoid),
    firstName: String,
    lastName: String,
    name: String,
    username: String,
    posts: manyOf("post"),
  },
  post: {
    id: primaryKey(nanoid),
    title: String,
    date: String,
    content: String,
    reactions: oneOf("reaction"),
    comments: manyOf("comment"),
    user: oneOf("user"),
  },
  comment: {
    id: primaryKey(String),
    date: String,
    text: String,
    post: oneOf("post"),
  },
  reaction: {
    id: primaryKey(nanoid),
    thumbsUp: Number,
    hooray: Number,
    heart: Number,
    rocket: Number,
    eyes: Number,
    post: oneOf("post"),
  },
})

const createUserData = () => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  return {
    firstName,
    lastName,
    name: `${firstName} ${lastName}`,
    userName: faker.internet.userName(),
  }
}

const createPostData = user => {
  return {
    title: faker.lorem.words(),
    date: faker.date.recent({ days: RECENT_NOTIFICATIONS_DAYS }).toISOString(),
    user,
    content: faker.lorem.paragraphs(),
    reactions: db.reaction.create(),
  }
}

for (let i = 0; i < NUM_USERS; i++) {
  const author = db.user.create(createUserData)

  for (let j = 0; j < POSTS_PER_USER; j++) {
    const newPost = createPostData(author)
    db.post.create(newPost)
  }
}

const serializePost = post => ({ ...post, user: post.user.id })

export const handlers = [
  http.get("fakeapi/posts", async function () {
    const posts = db.post.getAll().map(serializePost)
    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json(posts)
  }),

  http.post("/fakeapi/posts", async function ({ request }) {
    const data = request.json()

    if (data.content === "error") {
      await delay(ARTIFICIAL_DELAY_MS)

      return new HttpResponse(
        new JSON.stringify("Aconteceu um erro salvando este post"),
        { status: 500 },
      )
    }

    data.date = new Date().toISOString()
    const user = db.user.findFirst({ where: { id: { equals: data.user } } })
    data.user = user
    data.reactions = db.reaction.create()

    const post = db.post.create(data)
    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json(serializePost(post))
  }),

  http.get("/fakeapi/posts/:postId", async function ({ params }) {
    const post = db.post.findFirst({ where: { id: { equals: params.postId } } })
    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json(serializePost(post))
  }),

  http.patch("/fakeapi/posts/:postId", async function ({ request, params }) {
    const { id, ...data } = await request.json()

    const updatePost = db.post.update(
      { where: { id: { equals: params.postId } } },
      data,
    )

    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json(serializePost(updatePost))
  }),

  http.get("/fakeapi/posts/:postId/comments", async function ({ params }) {
    const post = db.post.findFirst({
      where: { id: { equals: params.postIds } },
    })

    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json({ comments: post.comments })
  }),

  http.post(
    "/fakeapi/posts/:postId/reactions",
    async function ({ request, params }) {
      const postId = params.postId
      const { reaction } = request.json()

      const post = db.post.findFirst({ where: { id: { equals: postId } } })

      const updatePost = db.post.update({
        where: { id: { equals: postId } },
        data: {
          reactions: {
            ...post.reactions,
            [reaction]: (post.reactions[reaction] += 1),
          },
        },
      })

      await delay(ARTIFICIAL_DELAY_MS)
      return HttpResponse.json(serializePost(updatePost))
    },
  ),

  http.get("/fakeApi/notifications", async () => {
    const numNotifications = getRandomInt(1, 5)

    let notifications = generateRandomNotifications(
      undefined,
      numNotifications,
      db,
    )

    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json(notifications)
  }),

  http.get("/fakeApi/users", async () => {
    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json(db.user.getAll())
  }),
]

export const worker = setupWorker(...handlers)

const socketServer = new MockSocketServer("ws://localhost")

let currentSocket

const sendMessage = (socket, obj) => {
  socket.send(JSON.stringify(obj))
}

const sendRandomNotifications = (socket, since) => {
  const numNotifications = getRandomInt(1, 5)

  const notifications = generateRandomNotifications(since, numNotifications, db)

  sendMessage(socket, { type: "notifications", payload: notifications })
}

export const forceGenerateNotifications = since => {
  sendRandomNotifications(currentSocket, since)
}

socketServer.on("connection", socket => {
  currentSocket = socket

  socket.on("message", data => {
    const message = JSON.parse(data)

    switch (message.type) {
      case "notifications": {
        const since = message.payload
        sendRandomNotifications(socket, since)
        break
      }
      default:
        break
    }
  })
})

const notificationTemplates = [
  "poked you",
  "says hi!",
  `is glad we're friends`,
  "sent you a gift",
]

function generateRandomNotifications(since, numNotifications, db) {
  const now = new Date()
  let pastDate

  if (since) {
    pastDate = parseISO(since)
  } else {
    pastDate = new Date(now.valueOf())
    pastDate.setMinutes(pastDate.getMinutes() - 15)
  }

  // Create N random notifications. We won't bother saving these
  // in the DB - just generate a new batch and return them.
  const notifications = [...Array(numNotifications)].map(() => {
    const user = randomFromArray(db.user.getAll())
    const template = randomFromArray(notificationTemplates)
    return {
      id: nanoid(),
      date: faker.date.between({ from: pastDate, to: now }).toISOString(),
      message: template,
      user: user.id,
    }
  })

  return notifications
}
