const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  global.io = io;

  io.on("connection", (socket) => {
    // Client joins restaurant-specific room
    socket.on("join-restaurant", (restaurantId) => {
      if (restaurantId) {
        socket.join(`restaurant_${restaurantId}`);
      }
    });

    // Realtime broadcast for order creations/updates
    socket.on("order-event", (data) => {
      if (data && data.restaurantId) {
        io.to(`restaurant_${data.restaurantId}`).emit("order-changed", data);
      } else {
        io.emit("order-changed", data);
      }
    });
  });

  httpServer.listen(port, () => {
    console.log(`> QuickBite Realtime Server ready on http://${hostname}:${port} with Socket.IO 🚀`);
  });
});
