import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { NavBar } from "./app/NavBar";
import { Posts } from "./features/posts/posts";

export const Home = () => {
  return <div>Pagina Inicial</div>;
};

function App() {
  return (
    <>
      <NavBar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<Posts />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
