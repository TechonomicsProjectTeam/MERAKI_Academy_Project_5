import React, { useEffect, useState } from "react";
import { Outlet } from 'react-router-dom';
import socketInit from "../../socket.server";
import { useDispatch, useSelector } from "react-redux";
import Message from "../OwnerAdminMessage/message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import "./AdminDashboard.css";
import axios from "axios";
import { getShops } from "../../redux/reducers/Shops/Shops";
const AdminDashboard = () => {
  const [shop_id, setShop_id] = useState(20); // 20 is the admin id
  const [socket, setSocket] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const [isConnected, setIsConnected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const dispatch = useDispatch();
  const shops = useSelector((state) => state.shops.shops);

  const getAllShops = () => {
    axios
      .get("http://localhost:5000/shop/", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
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
    if (socket) {
      socket.on("connect", () => {
        setIsConnected(true);
      });

      socket.on("connect_error", (error) => {
        console.log(error);
        setIsConnected(false);
      });

      return () => {
        socket.close();
        socket.removeAllListeners();
        setIsConnected(false);
      };
    }
  }, [socket]);

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
  };
  return (
    <div className='AdminDashboard'>
      <Outlet /> 
      <FontAwesomeIcon
        icon={faMessage}
        size="2x"
        onClick={toggleModal}
        className="contact-icon"
      />
      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
        contentLabel="Contact Modal"
        ariaHideApp={false}
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="modal-content">
          <div className="shop-list">
            <h3 className="contact">Contact Shops</h3>
            {shops.map((shop) => (
              <div
                key={shop.shop_id}
                onClick={() => handleShopClick(shop.shop_id)}
                className={`shop-item ${
                  selectedShopId === shop.shop_id ? "selected" : ""
                }`}
              >
                {shop.name}
              </div>
            ))}
          </div>
          <div className="message-container">
            {selectedShopId && isConnected && (
              <Message socket={socket} shop_id={shop_id} to={selectedShopId} />
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
