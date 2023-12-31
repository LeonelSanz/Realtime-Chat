const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messagesRoute");
const socket = require("socket.io");
require("dotenv").config();

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://realtime-chat-olive.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());
app.use(cors({ origin: 'https://realtime-chat-olive.vercel.app' }));

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

console.log('MONGO_URL:', process.env.MONGO_URL);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successfully");
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err);
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`Server Started on Port ${process.env.PORT}`);
});

const io = socket(server, {
  cors:{
    origin:"https://realtime-chat-olive.vercel.app",
    credentials: true
  }
});

global.onlineUsers = new Map();

io.on("connection", (socket)=> {
  global.chatSocket = socket;
  socket.on("add-user", (userId)=> {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data)=> {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    };
  });
});