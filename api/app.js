import express from "express";
import cors from "cors";
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/users", userRoute);
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.listen(process.env.PORT || 9000, () => {
  console.log("Server is running on port 9000");
});
import { Server } from "socket.io";
const io = new Server({
  cors: {
    origin: process.env.CLIENT_URL,
  },
});
let onlineUser = [];
const addUser = (userId, socketId) => {
  const userExist = onlineUser.find((user) => user.userId === userId);
  if (!userExist) {
    onlineUser.push({ userId, socketId });
  }
};
const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};
const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};
io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    console.log(onlineUser);
  });
  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    io.to(receiver.socketId).emit("getMessage", data);
  });
  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("User disconnected");
  });
});
io.listen("4000");
