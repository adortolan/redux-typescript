import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { NavBar } from "./app/NavBar";
import { Posts } from "./features/posts/posts";
import { AddPostForm } from "./features/posts/AddPostForm";
import { SinglePostPage } from "./features/posts/SinglePostPage";
import { EditPostForm } from "./features/posts/EditPostForm";

function App() {
  return (
    <>
      <NavBar />
      <div>
        <Routes>
          <Route path="/" element={<Posts />} />
          <Route path="/addpost" element={<AddPostForm />} />
          <Route path="/post/:postId" element={<SinglePostPage />} />
          <Route path="/editpost/:postId" element={<EditPostForm />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
