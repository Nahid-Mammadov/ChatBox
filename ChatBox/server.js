const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const Message = require("./src/models/MessageModel"); // 🔥 DÜZGÜN AD BU DUR !!!

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ONLINE USERS LIST
const onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ================= USER CONNECTED =================
  socket.on("user_connected", (data) => {
    socket.userId = data.userId;

    onlineUsers[data.userId] = {
      id: data.userId,
      name: data.userName,
    };

    io.emit("online_users", onlineUsers);
  });

  // ================= SEND MESSAGE =================
  socket.on("send_message", async (msg) => {
    console.log("RECEIVED:", msg);

    const newMsg = await Message.create({
      senderId: msg.senderId,
      senderName: msg.senderName,
      receiverId: msg.receiverId,
      message: msg.message,
      createdAt: new Date(),
    });

    io.emit("receive_message", newMsg);
  });

  // ================= DISCONNECT =================
  socket.on("disconnect", () => {
    delete onlineUsers[socket.userId];
    io.emit("online_users", onlineUsers);
    console.log("User disconnected:", socket.id);
  });
});

// START SERVER
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`🔥 Server + Socket.io running on port ${PORT}`);
});
