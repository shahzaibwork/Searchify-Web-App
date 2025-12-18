import { Server } from "socket.io";
import { preFetchNextPage } from "./controllers/promptControllers/prefetch.controller.js";
let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Change this to match your frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    
    socket.on('prefetchStart', async (page, query) => {
      console.log("Prefetch started: ", page)
  
      const nextPageData = await preFetchNextPage(page, query)


      socket.emit("PrefetchFinished", nextPageData, page, query)
    })





    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getSocketIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized!");
  }
  return io;
};

