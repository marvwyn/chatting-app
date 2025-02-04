const { Server } = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000"],
		methods: ["GET", "POST"],
	},
});

const userSocketMap = {};

io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	const userId = socket.handshake.query.userId;
	console.log("userId: ", userId);

  if ( userId != "undefined" ) {
    userSocketMap[userId] = socket.id;
  }

	// io.emit("sendMessage", Object.keys(userSocketMap));

  socket.on('typing', ({ from, to }) => {
    const toSocketId = userSocketMap[to];
    console.log("entered in typing",toSocketId);

    if (from && to && toSocketId)
      io.to(toSocketId).emit('typing', { from, to });
  });

  socket.on('stopTyping', ({ from, to }) => {
    const toSocketId = userSocketMap[to];
    console.log("entered in stop typing",toSocketId);
    if (from && to)
      io.to(toSocketId).emit('stopTyping', { from, to });
  });
	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
	});
});

module.exports = { app, server, io };
console.log("\n Socket configuration is ready \n");