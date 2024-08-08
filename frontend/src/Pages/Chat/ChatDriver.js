import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import createSocket from '../Socket/CreateSocket';
import Message from '../MessageUser/MessageUser';
import { addMessage, setUsers } from '../../redux/reducers/ChatMessage/ChatMessage';
import axios from 'axios';
import './Stylee.css'; 
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap'
const Apps = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const { token, userId: loggedInUserId } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [to, setTo] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);

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

      return () => {
        newSocket.disconnect();
      };
    }
  }, [token, loggedInUserId, dispatch]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users/user_user/user');
        setUsers(response.data.drivers);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    console.log('messages after clearing',messages);
    setTo(user.user_id);
    
  };

  useEffect(() => {
    if (selectedUser) {
      setMessages([]);
    }
  }, [selectedUser]);

  const sendMessage = () => {
    if (socket && selectedUser) {
      const message = {
        from: loggedInUserId,
        to: selectedUser.user_id,
        content: input,
      };
      socket.emit("message", { to: selectedUser.user_id, from: loggedInUserId, message });
      dispatch(addMessage(message));
      console.log(message);
      setInput('');
    } else {
      console.error("Socket is not initialized or no user selected");
    }
  };

  return (
    <>
    <div className="container app-container">
      <div className="row">
        <div className="col-md-4 users-list">
          <h5>Select User</h5>
          <div className="users">
            {users.map((user) => (
              <div 
                key={user.user_id} 
                className={`user-card ${to === user.user_id ? 'selected' : ''}`} 
                // className="user-card" 
                onClick={() => handleUserClick(user)}
              >
                <img src={user.images} alt={user.name} className="user-image"/>
                <div>
                  <h6>{user.first_name}</h6>
                  {/* <p>{user.email}</p> */}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-8 chat-section">
          {selectedUser && (
            <div className="chat-header">
              <img src={selectedUser.images} alt={selectedUser.name} className="chat-user-image"/>
              <h5>{selectedUser.first_name}</h5>
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
              className="form"
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

export default Apps;