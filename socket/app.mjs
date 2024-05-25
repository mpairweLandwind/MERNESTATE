 
 import { Server } from "socket.io";

 const io = new Server({
   cors: {
     origin: "http://localhost:5173",
   },
 });
 
 let onlineUser = [];
 
 const addUser = (userId, socketId) => {
   const userExits = onlineUser.find((user) => user.userId === userId);
   if (!userExits) {
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
  console.log(`User connected: ${socket.id}`);

  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    console.log(`User added: ${userId}`);
  });
 
  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
      console.log(`Message sent to ${receiverId}: ${data}`);
    } else {
      socket.emit("error", "Receiver not found");
      console.log(`Message failed, receiver not found: ${receiverId}`);
    }
  });

 
  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log(`User disconnected: ${socket.id}`);
  });
});

io.listen(4000);
console.log("Socket.IO server running at http://localhost:4000/");