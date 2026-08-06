import { createServer } from "node:http";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./prisma/client.js";

const server = createServer(app);

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
