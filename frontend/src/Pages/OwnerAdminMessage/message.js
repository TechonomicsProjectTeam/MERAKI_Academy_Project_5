import React, { useEffect, useState } from "react";

const Message = ({ socket, shop_id, to }) => {
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  useEffect(() => {
    setAllMessages([]);

    const handleMessage = (data) => {

      if (data.to === to || data.from === to) {
        setAllMessages((prevMessages) => [...prevMessages, data]);
        console.log("data from message : ", data);
      }
    };

    socket?.on("message", handleMessage);

    return () => {
      socket?.off("message", handleMessage);
    };
  }, [socket, shop_id, to]);

  const sendMessage = () => {
    socket.emit("message", { to, from: shop_id, message });
    setMessage("");
  };

  return (
    <div className="message-section">
      <div className="message-history">
        {allMessages.map((msg, index) => (
          <p
            key={index}
            className={msg.from === shop_id ? "message-self" : "message-other"}
          >
            <small>
              {msg.from === shop_id ? "You" : `User ${msg.from}`}: 
            </small>
            <small className="message">{msg.message}</small>
          </p>
        ))}
      </div>
      <div className="message-inputs">
        <input
          type="text"
          placeholder="Message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Message;
