import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();
const io = new Server({
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

//Socket Connection
let Users = [];
io.on("connection", (socket) => {
  // console.log("A user connected", socket.id);
  console.log("Initial Users-> ", Users);
  socket.on("addUser", (data) => {
    const userExist = Users.find((user) => user.userId === data.userId);
    if (data.userId != null) {
      if (!userExist) {
        const newuser = {
          userId: data.userId,
          username: data.username,
          socketId: socket.id,
        };
        Users.push(newuser);
        socket.Users = Users;
      } else if (userExist.socketId !== socket.id) {
        Users.forEach((user) => {
          if (user.userId === data.userId) {
            user.socketId = socket.id;
          }
        });
      }
    }
    socket.emit("setActiveUsers", Users);
    console.log("====================================");
    console.log(Users);
    console.log("====================================");
  });

  socket.on("sendMessage", (data) => {
    const receiver = Users.find((user) => user.userId === data.receiverId);
    const sender = Users.find((user) => user.userId === data.senderId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    }
  });

  socket.on("typing", ({ sender, receiver }) => {
    const receiver2 = Users.find((user) => user.userId === receiver);
    if (receiver2) {
      const data = `${receiver2.username} is Typing`;
      io.to(receiver2.socketId).emit("isTyping", data);
    }
  });

  socket.on("disconnect", (reason) => {
    // Users = Users.filter((user) => user.socketId !== socket.id);
    // io.emit("setActiveUsers", Users);
  });
});

const port = process.env.SOCKET_PORT;
io.listen(port, () => {
  console.log("Socket runnnig at port:", port);
});
