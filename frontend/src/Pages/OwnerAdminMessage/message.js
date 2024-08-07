import React, { useEffect, useState } from "react";
import "./Message.css";

const Message = ({ socket, shop_id, to, senderName }) => {
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  useEffect(() => {
    setAllMessages([]);
  
    const handleMessage = (data) => {
      if (data.to === to || data.from === to) {
        setAllMessages((prevMessages) => [...prevMessages, data]);
        console.log("Received message:", data);
        if (Notification.permission === "granted") {
          new Notification("New Message", {
            body: `${data.name}: ${data.message}`,
            icon: "/icons/envelope.svg"
          });
        } else {
          console.log("Notification permission not granted");
        }
      }
    };
  
    socket?.on("message", handleMessage);
  
    return () => {
      socket?.off("message", handleMessage);
    };
  }, [socket, shop_id, to]);
  
  // For testing
  useEffect(() => {
    if (Notification.permission === "granted") {
      new Notification("Test Notification", {
        body: "This is a test notification",
        icon: "/icons/envelope.svg"
      });
    }
  }, []);
  

  const sendMessage = () => {
    socket.emit("message", { to, from: shop_id, message, name: senderName });
    setMessage("");
  };

  return (
    <div className="message-section">
      <div className="message-history">
        {allMessages.map((msg, index) => (
          <p key={index} className={msg.from === shop_id ? "message-self" : "message-other"}>
            <small>{msg.from === shop_id ? "You" : `${msg.name}`}: </small>
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
