import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { client } from "../../api/client";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await client.get("fakeapi/posts");
  return response.data;
});

export const addNewPost = createAsyncThunk(
  "post/addNewPost",
  async ({
    title,
    content,
    user,
  }: {
    title: string;
    content: string;
    user: string;
  }) => {
    const response = await client.post("fakeapi/posts", {
      title,
      content,
      user,
    });
    return response.data;
  }
);

export interface reactionEmoji {
  thumbsUp: number;
  hooray: number;
  heart: number;
  rocket: number;
  eyes: number;
}

export interface Post {
  id: string;
  date: string;
  title: string;
  content: string;
  user: string;
  reactions: reactionEmoji;
}

interface InitialState {
  posts: Post[];
  status: "idle" | "loading" | "succeeded" | "fail";
  error: string | undefined;
}

const initialState = {
  posts: [],
  status: "idle",
  error: "",
} as InitialState;

export const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdd: {
      reducer(state, action: PayloadAction<Post>) {
        state.posts.push(action.payload);
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(),
            title,
            content,
            user: userId,
            reactions: {
              thumbsUp: 0,
              hooray: 0,
              heart: 0,
              rocket: 0,
              eyes: 0,
            },
          },
        };
      },
    },

    postUpdate(state, action) {
      const { id, title, content } = action.payload;
      const existPost = state.posts.find((post) => post.id === id);

      if (existPost) {
        existPost.title = title;
        existPost.content = content;
      }
    },

    reactionAdd(state, action) {
      const {
        postId,
        reaction,
      }: { postId: string; reaction: string | number } = action.payload;
      const existPost = state.posts.find((post) => post.id === postId);
      if (existPost) {
        existPost.reactions[reaction as keyof reactionEmoji]++;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = [];
        state.posts = state.posts.concat(action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      });
  },
});

export const { postAdd, postUpdate, reactionAdd } = postSlice.actions;

export const selectAllPosts = (state: RootState) => state.posts.posts;
export const selectPostById = (state: RootState, postID: string | undefined) =>
  state.posts.posts.filter((post) => post.id === postID);

export default postSlice.reducer;
