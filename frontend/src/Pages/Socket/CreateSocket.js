import io from 'socket.io-client';

const createSocket = ({ user_id, token }) => {
  return io('http://localhost:8081', {
    extraHeaders: {
        user_id,
      token,
    },
  });
};

export default createSocket;