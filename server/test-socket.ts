import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

socket.on("connect", () => {
  console.log("Connected to server!");
  console.log("Socket ID:", socket.id);
  socket.emit("hello", { message: "Hello from the client!" });
});

socket.on("welcome", (data) => {
  console.log("Welcome message:", data.message);
});