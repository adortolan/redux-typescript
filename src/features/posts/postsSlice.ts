import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

type Post = {
  id: string;
  title: string;
  content: string;
};

const initialState: Post[] = [
  { id: "1", title: "First Post", content: "Hello!" },
  { id: "2", title: "Second Post", content: "content posted!" },
];

export const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdd(state, action) {
      state.push(action.payload);
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
