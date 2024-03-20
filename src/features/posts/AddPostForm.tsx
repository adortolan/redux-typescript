import { useState } from "react";
import { postAdd } from "./postsSlice";
import { useAppDispatch } from "../../app/hooks";
import { nanoid } from "@reduxjs/toolkit";

export const AddPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const dispatch = useAppDispatch();

  const handleSavePost = () => {
    if (title && content) {
      dispatch(postAdd({ id: nanoid(), title, content }));
    }

    setTitle("");
    setContent("");
  };

  return (
    <section>
      <h2>Add New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="postContent">Post Content</label>
        <input
          type="text"
          id="postContent"
          name="postContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="button" onClick={handleSavePost}>
          Save Post
        </button>
      </form>
    </section>
  );
};
