import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setUsers, deleteUserById, banUserById, unBanUserById } from '../../../redux/reducers/Users/Users';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faEdit, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from 'react-bootstrap';
import "./UsersAdmin.css";

const UsersAdmin = () => {
  const { user_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.user.users);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [modalAction, setModalAction] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://quickserv.onrender.com/users/role/1');
        const data = await response.json();
        if (data.success) {
          dispatch(setUsers(data.users));
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [dispatch]);

  const handleBan = async (user_id) => {
    try {
      const response = await fetch(`https://quickserv.onrender.com/users/ban/${user_id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        dispatch(banUserById({ user_id }));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };

  const handleUnBan = async (user_id) => {
    try {
      const response = await fetch(`https://quickserv.onrender.com/users/unBan/${user_id}`, {
        method: 'PATCH',
      });
      const data = await response.json();
      if (data.success) {
        dispatch(unBanUserById({ user_id }));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error unbanning user:', error);
    }
  };

  const handleDelete = async (user_id) => {
    try {
      const response = await fetch(`https://quickserv.onrender.com/users/${user_id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        dispatch(deleteUserById({ user_id }));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleShowModal = (user_id, action) => {
    setSelectedUserId(user_id);
    setModalAction(action);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUserId(null);
    setModalAction("");
  };

  const confirmAction = () => {
    if (modalAction === "delete") {
      handleDelete(selectedUserId);
    } else if (modalAction === "ban") {
      handleBan(selectedUserId);
    } else if (modalAction === "unban") {
      handleUnBan(selectedUserId);
    }
    handleCloseModal();
  };

  const handleEdit = (user_id) => {
    navigate(`/admin-dashboard/update-users-admin/${user_id}`);
  };

  return (
    <div className="usersAdmin">
      <h1>Users Admin</h1>
      <table className="usersTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th className='email-admin'>Email</th>
            <th className='actions-admin'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id} className={user.is_deleted ? "line-through" : ""}>
              <td>{user.user_id}</td>
              <td>{user.first_name} {user.last_name}</td>
              <td>{user.email}</td>
              <td>
                <FontAwesomeIcon
                  icon={faEdit}
                  className="editButton"
                  onClick={() => handleEdit(user.user_id)}
                />
                <FontAwesomeIcon
                  icon={faBan}
                  className={`banButton ${user.is_deleted ? "disabled" : ""}`}
                  onClick={() => !user.is_deleted && handleShowModal(user.user_id, "ban")}
                />
                <FontAwesomeIcon
                  icon={faUndo}
                  className={`unbanButton ${!user.is_deleted ? "disabled" : ""}`}
                  onClick={() => user.is_deleted && handleShowModal(user.user_id, "unban")}
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  className="deleteButton"
                  onClick={() => handleShowModal(user.user_id, "delete")}
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
          {modalAction === "delete" && "Are you sure you want to delete this user?"}
          {modalAction === "ban" && "Are you sure you want to ban this user?"}
          {modalAction === "unban" && "Are you sure you want to unban this user?"}
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

export default UsersAdmin;
