import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

type Post = {
  id: string;
  title: string;
  content: string;
};

type PostState = {
  posts: Post[];
};

const initialState = {
  posts: [
    { id: "1", title: "First Post", content: "Hello!" },
    { id: "2", title: "Second Post", content: "content posted!" },
  ],
} as PostState;

export const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
});

export const selectPosts = (state: RootState) => state.posts;

export default postSlice.reducer;
