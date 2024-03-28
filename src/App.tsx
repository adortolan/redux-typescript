import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { NavBar } from "./app/NavBar";
import { Posts } from "./features/posts/posts";
import { AddPostForm } from "./features/posts/AddPostForm";
import { SinglePostPage } from "./features/posts/SinglePostPage";
import { EditPostForm } from "./features/posts/EditPostForm";
import { UserList } from "./features/user/UserList";
import { UserPage } from "./features/user/UserPage";

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
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:userId" element={<UserPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
