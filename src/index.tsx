import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import "./index.css";
import { worker } from "./api/server";
import { BrowserRouter } from "react-router-dom";
import { fetchUsers } from "./features/user/userSlice";

async function start() {
  await worker.start({ onUnhandledRequest: "bypass" });
  const container = document.getElementById("root")!;
  const root = createRoot(container);
  store.dispatch(fetchUsers());

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
}

start();
