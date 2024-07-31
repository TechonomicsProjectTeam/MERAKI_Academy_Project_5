const express = require("express");
require("dotenv").config();
const cors = require("cors");
const http = require("http");
require("./models/db");
const { initializeWebSocket } = require("./webSocket");

// Routers
const rolesRouter = require("./routes/Role");
const usersRouter = require("./routes/Users");
const categoryRouter = require("./routes/Category");
const shopRouter = require("./routes/Shop");
const productRouter = require("./routes/Product");
const cartRouter = require("./routes/Cart");
const reviewRouter = require("./routes/Review");
const orderRouter = require("./routes/orders");

const app = express();

// Built-in middleware
app.use(express.json());
app.use(cors());

// Router middleware
app.use("/roles", rolesRouter);
app.use("/users", usersRouter);
app.use("/categories", categoryRouter);
app.use("/shop", shopRouter);
app.use("/product", productRouter);
app.use("/carts", cartRouter);
app.use("/review", reviewRouter);
app.use("/orders", orderRouter);

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize WebSocket server
initializeWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
