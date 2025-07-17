require("dotenv").config();
const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const ACTIONS = require("./Actions");

connectToMongo();
const app = express();
const port = process.env.PORT_BACKEND || 5000;
const server = http.createServer(app);

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:3000", // Allow only frontend port
    credentials: true, // If handling cookies or tokens
  })
);

// Middleware to parse JSON
app.use(express.json());

// Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/compiler", require("./routes/compiler"));
app.use("/api/", require("./routes/forget-password"));
app.use("/api/", require("./routes/reset-password"));
app.use("/api/", require("./routes/user-role"));
app.use("/api/", require("./routes/analyzer"));

// WebSocket Server Setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};
const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
};

io.on("connection", (socket) => {
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});


// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).send({ error: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong!" });
});

// Start the server
server.listen(port, () => {
  console.log(`Code Note backend listening at http://localhost:${port}`);
});
