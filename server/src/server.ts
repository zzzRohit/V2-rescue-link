import { createServer } from "node:http";
import {Server} from "socket.io";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./prisma/client.js";
import jwt from "jsonwebtoken";
import { AuthenticatedUser } from "./types/auth.js";
import { setIO } from "./Socket.js";
const server = createServer(app);
const io = new Server(server);
setIO(io);
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication token missing"));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    )as AuthenticatedUser;

    socket.data.user = decoded;

    next();
  } catch {
    next(new Error("Invalid authentication token"));
  }
});



io.on("connection", (socket) => {
  const { userId, role } = socket.data.user;

  console.log(`Socket connected: ${socket.id}`);
  console.log("Authenticated user:", socket.data.user);

  if (role === "RESCUER") {
    socket.join(`user:${userId}`);

    console.log(`Rescuer ${userId} joined room: user:${userId}`);
  }

  socket.emit("welcome", {
    message: "Welcome to the server!",
  });
});






server.listen(env.PORT, () => {
  console.log(`Server listening on port ${String(env.PORT)}`);
});

function shutdown(signal: string): void {
  console.log(`${signal} received. Shutting down.`);

  server.close((error) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }

    void prisma.$disconnect().then(() => {
      process.exit(0);
    });
  });
}

process.on("SIGINT", () => {
  shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});
