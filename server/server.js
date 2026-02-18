const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const adminRoutes = require("./routes/admin");
const eventRoutes = require("./routes/events");
const bookingRoutes = require("./routes/bookings");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

io.on("connection", (socket) => {
  socket.on("joinEvent", (eventId) => {
    socket.join(`event_${eventId}`);
  });
});

app.set("io", io);

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
