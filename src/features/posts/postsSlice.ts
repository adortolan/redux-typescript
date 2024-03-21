import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

type Post = {
  id: string;
  date: string;
  title: string;
  content: string;
  user: string;
};

const initialState: Post[] = [
  {
    id: "1",
    date: new Date().toISOString(),
    title: "First Post",
    content: "Hello!",
    user: "01",
  },
  {
    id: "2",
    date: new Date().toISOString(),
    title: "Second Post",
    content: "content posted!",
    user: "02",
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
  },
});

export const { postAdd, postUpdate } = postSlice.actions;

export const selectPosts = (state: RootState) => state.posts;

export default postSlice.reducer;
