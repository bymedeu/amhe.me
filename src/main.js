import { createApp } from "./app.js";

const root = document.querySelector("#app");

if (!root) {
  throw new Error("Application root not found");
}

createApp(root).start();
