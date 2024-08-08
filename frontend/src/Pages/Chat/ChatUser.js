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
    <>
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

    <footer class="footer">
  <div class="footer-top">
    <div class="footer-column">
      <h3>Restaurants</h3>
      <ul>
        <li>Cozy Pizza</li>
        <li>Sizzle Grill</li>
        <li>MindHub</li>
        <li>WOK U LIKE</li>
        <li>McDonald's</li>
        <li>More Restaurants...</li>
      </ul>
    </div>
    {/* <div class="footer-column">
      <h3>Popular Cuisines</h3>
      <ul>
        <li>American</li>
        <li>Arabic</li>
        <li>Asian</li>
        <li>Beverages</li>
        <li>Breakfast</li>
        <li>More Cuisines...</li>
      </ul>
    </div> */}
    <div class="footer-column">
      <h3>Popular Areas</h3>
      <ul>
        <li>Al Mala'ab</li>
        <li>Al Huson</li>
        <li>Al Sareeh</li>
        <li>Al Mohammadiyeh Amman</li>
        <li>Bait Ras</li>
        <li>More Areas...</li>
      </ul>
    </div>
    <div class="footer-column">
      <h3>Cities</h3>
      <ul>
        <li>Ajloun</li>
        <li>Amman</li>
        <li>Aqaba</li>
        <li>Irbid</li>
        <li>Jerash</li>
        <li>More Cities...</li>
      </ul>
    </div>
    <div class="footer-column">
      <h3>Follow us on</h3>
      <ul class="social-media">
        <li><a href="#"><i class="fab fa-facebook-f"></i></a></li>
        <li><a href="#"><i class="fab fa-twitter"></i></a></li>
        <li><a href="#"><i class="fab fa-instagram"></i></a></li>
        <li><a href="#"><i class="fab fa-linkedin-in"></i></a></li>
        <li><a href="#"><i class="fab fa-youtube"></i></a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <ul>
      <li><a href="#">Careers</a></li>
      <li><a href="#">Terms and Conditions</a></li>
      <li><a href="#">FAQ</a></li>
      <li><a href="#">Privacy Policy</a></li>
      <li><a href="#">Contact Us</a></li>
      <li><a href="#">Sitemap</a></li>
    </ul>
    <p>©2024 QuickServ.com</p>
    <p>For any support or help you can contact us via our Live Chat</p>
  </div>
</footer>
    </>
  );
};

export default Chat;