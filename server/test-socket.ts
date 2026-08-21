import { io } from "socket.io-client";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlMDFhMGQyYS05ODY0LTRkZWMtOTRjNC0xYmRlMmE1NWRiNDYiLCJyb2xlIjoiUkVTQ1VFUiIsImlhdCI6MTc4NzMwOTI1OSwiZXhwIjoxNzg3OTE0MDU5fQ.pC6QJDf4aIMUYi17OvNIlAVuqVzU3PUgVw_R7pNxr6s";

const socket = io("http://localhost:4000", {
  auth: {
    token,
  },
});

socket.on("connect", () => {
  console.log("Connected to server!");
  console.log("Socket ID:", socket.id);

  socket.emit("hello", {
    message: "hello from the client!",
  });
});

socket.on("welcome", (data) => {
  console.log("Welcome message:", data.message);
});
socket.on("new-report", (data) => {
  console.log("🚨 NEW REPORT:", data.message);
});
socket.on("connect_error", (error) => {
  console.error("Socket connection failed:", error.message);
});