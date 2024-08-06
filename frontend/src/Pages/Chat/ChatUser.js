import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import createSocket from '../Socket/CreateSocket';
import Message from '../MessageUser/MessageUser';
import { addMessage, setUsers } from '../../redux/reducers/ChatMessage/ChatMessage';
import axios from 'axios';
import './Style.css'; 
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const { token, userId: loggedInUserId } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);
  const [to, setTo] = useState('');
  const { driverId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && loggedInUserId) {
      const newSocket = createSocket({ user_id: loggedInUserId, token });
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Connected to WebSocket server");
      });

      newSocket.on("message", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        dispatch(addMessage(message));
      });

      newSocket.on("error", (error) => {
        console.error("WebSocket error:", error);
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
      });

      newSocket.on("usersList", (usersList) => {
        dispatch(setUsers(usersList));
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [token, loggedInUserId, dispatch]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users/user_driver/drivers');
        setDrivers(response.data.drivers);
        console.log(response);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    fetchDrivers();
  }, []);

  useEffect(() => {
    if (driverId) {
      const driver = drivers.find(d => d.user_id === driverId);
      setSelectedDriver(driver);
    }
  }, [driverId, drivers]);

  const sendMessage = () => {
    if (socket && selectedDriver) {
      const message = {
        from: loggedInUserId,
        to: selectedDriver.user_id,
        content: input,
      };
      socket.emit("message", { to: selectedDriver.user_id, from: loggedInUserId, message });
      dispatch(addMessage(message));
      console.log(message);
      setInput('');
    } else {
      console.error("Socket is not initialized or no driver selected");
    }
  };

  const handleDriverClick = (driver) => {
    setSelectedDriver(driver);
    setMessages([])
    setTo(driver.user_id);
  };

  useEffect(() => {
    if (selectedDriver) {
      setMessages([]);
    }
  }, [selectedDriver]);

  return (
    <div className="container app-container">
      <div className="row">
        <div className="col-md-4 drivers-list">
          <h5>Select Driver</h5>
          <div className="drivers">
            {drivers.map((driver) => (
              <div 
                key={driver.user_id} 
                className={`driver-card ${to === driver.user_id ? 'selected' : ''}`} 
                onClick={() => handleDriverClick(driver)}
              >
                <img src={driver.images} alt={driver.name} className="driver-image"/>
                <div>
                  <h6>{driver.first_name}</h6>
                  {/* <p>{driver.email}</p> */}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-8 chat-section">
          {selectedDriver && (
            <div className="chat-header">
              <img src={selectedDriver.images} alt={selectedDriver.name} className="chat-user-image"/>
              <h5>{selectedDriver.first_name}</h5>
            </div>
          )}
          <div className="message-list">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.from === loggedInUserId ? 'sent' : 'received'}`}>
                <Message message={msg} />
              </div>
            ))}
          </div>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder="Type a message"
            />
            <button className="btn" onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;