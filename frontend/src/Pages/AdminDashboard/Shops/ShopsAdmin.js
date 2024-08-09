import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getShops, banShopById, unBanShopById, deleteShopById } from "../../../redux/reducers/Shops/Shops";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faTrash, faUndo, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button } from 'react-bootstrap';
import "./ShopsAdmin.css";

const ShopsAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const shops = useSelector((state) => state.shops.shops);
  const [showModal, setShowModal] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [modalAction, setModalAction] = useState("");

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get("https://quickserv.onrender.com/shop/");
        dispatch(getShops(response.data.shops));
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    };

    fetchShops();
  }, [dispatch]);

  const handleBan = async (shop_id) => {
    try {
      const response = await axios.put(`https://quickserv.onrender.com/shop/ban/${shop_id}`);
      if (response.data.success) {
        dispatch(banShopById({ shop_id }));
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error banning shop:", error);
    }
  };

  const handleUnBan = async (shop_id) => {
    try {
      const response = await axios.put(`https://quickserv.onrender.com/shop/unBan/${shop_id}`);
      if (response.data.success) {
        dispatch(unBanShopById({ shop_id }));
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error unbanning shop:", error);
    }
  };

  const handleDelete = async (shop_id) => {
    try {
      const response = await axios.delete(`https://quickserv.onrender.com/shop/hard-delete/${shop_id}`);
      if (response.data.success) {
        dispatch(deleteShopById({ shop_id }));
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting shop:", error);
    }
  };

  const handleShowModal = (shop_id, action) => {
    setSelectedShopId(shop_id);
    setModalAction(action);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedShopId(null);
    setModalAction("");
  };

  const confirmAction = () => {
    if (modalAction === "delete") {
      handleDelete(selectedShopId);
    } else if (modalAction === "ban") {
      handleBan(selectedShopId);
    } else if (modalAction === "unban") {
      handleUnBan(selectedShopId);
    }
    handleCloseModal();
  };

  const handleEdit = (shop_id) => {
    navigate(`/admin-dashboard/update-shop/${shop_id}`);
  };

  return (
    <div className="shopsAdmin">
      <h1>Shops Admin</h1>
      <table className="shopsTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>City</th>
            <th>Category ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shops.map((shop) => (
            <tr key={shop.shop_id} className={shop.is_deleted ? "line-through" : ""}>
              <td>{shop.shop_id}</td>
              <td>{shop.name}</td>
              <td>{shop.email}</td>
              <td>{shop.phone_number}</td>
              <td>{shop.city}</td>
              <td>{shop.category_id}</td>
              <td>
                <FontAwesomeIcon
                  icon={faEdit}
                  className="editButton"
                  onClick={() => handleEdit(shop.shop_id)}
                />
                <FontAwesomeIcon
                  icon={faBan}
                  className={`banButton ${shop.is_deleted ? "disabled" : ""}`}
                  onClick={() => !shop.is_deleted && handleShowModal(shop.shop_id, "ban")}
                />
                <FontAwesomeIcon
                  icon={faUndo}
                  className={`unbanButton ${!shop.is_deleted ? "disabled" : ""}`}
                  onClick={() => shop.is_deleted && handleShowModal(shop.shop_id, "unban")}
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  className="deleteButton"
                  onClick={() => handleShowModal(shop.shop_id, "delete")}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalAction === "delete" && "Are you sure you want to delete this shop?"}
          {modalAction === "ban" && "Are you sure you want to ban this shop?"}
          {modalAction === "unban" && "Are you sure you want to unban this shop?"}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmAction}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ShopsAdmin;
