import React, { useEffect, useState } from "react";
import { Outlet } from 'react-router-dom';
import socketInit from "../../socket.server";
import { useDispatch, useSelector } from "react-redux";
import Message from "../OwnerAdminMessage/message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import { Line, Bar, Doughnut, Pie, PolarArea, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';
import axios from "axios";
import { getShops } from "../../redux/reducers/Shops/Shops";
import {jwtDecode} from "jwt-decode";
import "./AdminDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

const AdminDashboard = () => {
  const [shop_id, setShop_id] = useState(20); 
  const [socket, setSocket] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const [isConnected, setIsConnected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const dispatch = useDispatch();
  const shops = useSelector((state) => state.shops.shops);
  const [clicked, setClicked] = useState(true);

  const decodedToken = jwtDecode(token);
  const userName = decodedToken.username; 
  console.log(decodedToken);

  const getAllShops = () => {
    axios
      .get("https://quickserv.onrender.com/shop/", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          dispatch(getShops(response.data.shops));
        }
      })
      .catch((error) => {
        console.error("Error fetching shops:", error);
      });
  };

  useEffect(() => {
    getAllShops();
  }, [dispatch, token]);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then(permission => {
        console.log("Notification permission:", permission);
      });
    } else {
      console.log("Notification permission already granted");
    }
  }, []);
  
  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        setIsConnected(true);
      });
  
      socket.on("connect_error", (error) => {
        setIsConnected(false);
      });
  
      socket.on("message", (data) => {
        console.log("Received message:", data);
        if (Notification.permission === "granted") {
          new Notification("New Message", {
            body: `${data.name}: ${data.message}`,
            icon: "/icons/envelope.svg"
          });
        } else {
          console.log("Notification permission not granted");
        }
      });
  
      return () => {
        socket.close();
        socket.removeAllListeners();
        setIsConnected(false);
      };
    }
  }, [socket]);
  
  // For testing
  useEffect(() => {
    if (Notification.permission === "granted") {
      new Notification("Test Notification", {
        body: "This is a test notification",
        icon: "/icons/envelope.svg"
      });
    }
  }, []);
  

  const toggleModal = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSocket(socketInit(shop_id, token));
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  };

  const handleShopClick = (shop_id) => {
    setSelectedShopId(shop_id);
    setClicked(!clicked);
  };

  const lineData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Profile Views",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: "#007bff",
        borderColor: "#007bff",
      },
    ],
  };

  const barData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Sales",
        data: [35, 49, 60, 71, 46, 55],
        backgroundColor: "#17a2b8",
        borderColor: "#17a2b8",
      },
    ],
  };

  const doughnutData = {
    labels: ["Direct", "Referral", "Social Media", "Organic Search", "Email"],
    datasets: [
      {
        label: "Traffic Sources",
        data: [300, 50, 100, 80, 60],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]
      }
    ]
  };

  const pieData = {
    labels: ["Male", "Female", "Other"],
    datasets: [
      {
        label: "User Demographics",
        data: [150, 120, 30],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
      }
    ]
  };

  const polarData = {
    labels: ["Electronics", "Fashion", "Home & Garden", "Automotive", "Others"],
    datasets: [
      {
        label: "Product Categories",
        data: [11, 16, 7, 3, 14],
        backgroundColor: ["#FF6384", "#4BC0C0", "#FFCE56", "#36A2EB", "#9966FF"],
        hoverBackgroundColor: ["#FF6384", "#4BC0C0", "#FFCE56", "#36A2EB", "#9966FF"]
      }
    ]
  };

  const radarData = {
    labels: ["Likes", "Comments", "Shares", "Saves", "Clicks"],
    datasets: [
      {
        label: "User Engagement",
        data: [65, 59, 90, 81, 56],
        backgroundColor: "rgba(179,181,198,0.2)",
        borderColor: "rgba(179,181,198,1)",
        pointBackgroundColor: "rgba(179,181,198,1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(179,181,198,1)"
      },
      {
        label: "User B",
        data: [28, 48, 40, 19, 96],
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        pointBackgroundColor: "rgba(255,99,132,1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255,99,132,1)"
      }
    ]
  };

  const horizontalBarData = {
    labels: ["North America", "Europe", "Asia", "Australia", "Africa"],
    datasets: [
      {
        label: "Revenue by Region",
        data: [65, 59, 80, 81, 56],
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1
      }
    ]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const horizontalBarOptions = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="AdminDashboard">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="icon bg-primary">
                  <i className="fas fa-eye"></i>
                </div>
                <div>
                  <h5 className="card-title">Profile Views</h5>
                  <h3>112,000</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="icon bg-info">
                  <i className="fas fa-users"></i>
                </div>
                <div>
                  <h5 className="card-title">Followers</h5>
                  <h3>183,000</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="icon bg-success">
                  <i className="fas fa-user-friends"></i>
                </div>
                <div>
                  <h5 className="card-title">Following</h5>
                  <h3>80,000</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="icon bg-danger">
                  <i className="fas fa-bookmark"></i>
                </div>
                <div>
                  <h5 className="card-title">Saved Posts</h5>
                  <h3>112</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row mt-4">
          <div className="col-lg-8 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Profile Visit</h5>
                <div className="chart-container">
                  <Line data={lineData} options={options} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Recent Messages</h5>
                <div className="shop-list">
                  {shops.map((shop) => (
                    <div
                      key={shop.shop_id}
                      onClick={() => handleShopClick(shop.shop_id)}
                      className={`shop-item ${selectedShopId === shop.shop_id ? 'selected' : ''}`}
                    >
                      {shop.name}
                    </div>
                  ))}
                </div>
                <button
                  onClick={toggleModal}
                  disabled={clicked}
                  className={`${ !clicked ? 'clicked':'notClicked'}`}
                >
                  Start Conversation
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-lg-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">User Engagement</h5>
                <div className="chart-container">
                  <Radar data={radarData} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Revenue by Region</h5>
                <div className="chart-container">
                  <Bar data={horizontalBarData} options={horizontalBarOptions} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Sales Data</h5>
                <div className="chart-container">
                  <Bar data={barData} options={options} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Traffic Sources</h5>
                <div className="chart-container">
                  <Doughnut data={doughnutData} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">User Demographics</h5>
                <div className="chart-container">
                  <Pie data={pieData} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Product Categories</h5>
                <div className="chart-container">
                  <PolarArea data={polarData} />
                </div>
              </div>
            </div>
          </div>
        </div>

     
      </div>
      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
        contentLabel="Contact Modal"
        ariaHideApp={false}
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="modal-content">
          <div className="message-container">
            {selectedShopId && (
              <Message socket={socket} shop_id={shop_id} to={selectedShopId} senderName={userName} />
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
