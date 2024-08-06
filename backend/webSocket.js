const WebSocket = require("ws");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const messagesHandelar = require("./controllers/Messages");
const authh = require("./middlewares/authh");
const example = require("./middlewares/example");

let wss;
let io;
const clients = {}; 

const initializeWebSocket = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("New WebSocket client connected");

    ws.on("message", (message) => {
      console.log("Received WebSocket message:", message);
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });
  });

  io = new Server(8081, {
    cors: {
      origin: '*'
    }
  });

  //  const user = io.of("/users")
  //  const driver = io.of("/driver")

  //  user.on("connection",(socket)=>{
  //   console.log('from user');
  //  })

  //  driver.on("connection",(socket)=>{
  //   console.log('from driver');
  //  })

   io.use(authh)
  
   io.on("connection",(socket)=>{
    console.log("connection");
    socket.use(example)

    const user_id = socket.handshake.headers.user_id;
    clients[user_id] = {socket_id:socket.id , user_id}
    console.log(clients);
  
    messagesHandelar(socket , io)

    socket.on("error",(error)=>{
      socket.emit("error",{error:error.message})
    })


    socket.on("disconnect",()=>{
      console.log(socket.id);
      for(const key in clients){
        if(clients[key].socket_id === socket.id){
          delete clients[key]
        }
      }
      console.log(clients);
    })
   })

  return { wss, io };
};

const getWebSocketServer = () => {
  if (!wss) {
    throw new Error("WebSocket server is not initialized. Call initializeWebSocket first.");
  }
  return wss;
};


module.exports = { initializeWebSocket, getWebSocketServer };
