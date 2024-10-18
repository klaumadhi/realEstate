import express from "express";
import cors from "cors";
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/users", userRoute);
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// Create HTTP server and attach Socket.io
const server = http.createServer(app);

// Initialize Socket.io and attach it to the HTTP server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// Socket.io logic
let onlineUsers = [];

const addUser = (userId, socketId) => {
  const userExists = onlineUsers.find((user) => user.userId === userId);
  if (!userExists) {
    onlineUsers.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    console.log(onlineUser);
  });
  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    io.to(receiver?.socketId).emit("getMessage", data);
  });
  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("User disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
