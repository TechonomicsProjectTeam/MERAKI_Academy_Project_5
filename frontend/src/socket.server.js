import io from "socket.io-client";

const socketInit = (shop_id, token) => {
  return io("http://localhost:8080", {
    extraHeaders: {
      shop_id,
      token,
    },
  });
};

export default socketInit;
