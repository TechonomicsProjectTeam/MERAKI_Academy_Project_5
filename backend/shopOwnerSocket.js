const { Server } = require("socket.io");
const auth = require("./middlewares/authSocket");
const messageHandler = require("./controllers/message");
const socketAuth = require("./middlewares/socketEmitsMiddleware");

const initializeSocket = (server) => {
  const io = new Server(8080, {
    cors: {
      origin: "*",
    },
  });

  const clients = {};

  io.use(auth); // connect error
  io.on("connection", (socket) => {
    socket.use(socketAuth);
    console.log("connected");
    const shop_id = socket.handshake.headers.shop_id;
    clients[shop_id] = { socket_id: socket.id, shop_id };
    console.log(clients);

    messageHandler(socket, io);

    socket.on("error", (error) => {
      socket.emit("error", { error: error.message });
    });

    socket.on("disconnect", () => {
      for (const key in clients) {
        if (clients[key].socket_id === socket.id) {
          delete clients[key];
        }
      }
      console.log(clients);
    });
  });
};

module.exports = initializeSocket;
