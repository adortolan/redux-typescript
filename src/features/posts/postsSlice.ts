import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
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

const initialState: Post[] = [
  {
    id: "1",
    date: new Date().toISOString(),
    title: "First Post",
    content: "Hello!",
    user: "01",
    reactions: {
      thumbsUp: 0,
      hooray: 0,
      heart: 0,
      rocket: 0,
      eyes: 0,
    },
  },
  {
    id: "2",
    date: new Date().toISOString(),
    title: "Second Post",
    content: "content posted!",
    user: "02",
    reactions: {
      thumbsUp: 0,
      hooray: 0,
      heart: 0,
      rocket: 0,
      eyes: 0,
    },
  },
];

export const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdd: {
      reducer(state, action: PayloadAction<Post>) {
        state.push(action.payload);
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
      const existPost = state.find((post) => post.id === id);

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
      const existPost = state.find((post) => post.id === postId);
      console.log("cliccou");
      if (existPost) {
        existPost.reactions[reaction as keyof reactionEmoji]++;
      }
    },
  },
});

export const { postAdd, postUpdate, reactionAdd } = postSlice.actions;

export const selectPosts = (state: RootState) => state.posts;

export default postSlice.reducer;
