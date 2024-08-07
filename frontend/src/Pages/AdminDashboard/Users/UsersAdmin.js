import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate,useParams } from 'react-router-dom';
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/users/role/1');
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
      const response = await fetch(`http://localhost:5000/users/ban/${user_id}`, {
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
      const response = await fetch(`http://localhost:5000/users/unBan/${user_id}`, {
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
      const response = await fetch(`http://localhost:5000/users/${user_id}`, {
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

  const handleUpdate = (user_id) => {
    navigate(`/admin-dashboard/update-users-admin/${user_id}`);
  };

  const handleShowModal = (user_id) => {
    setSelectedUserId(user_id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUserId(null);
  };

  const confirmDelete = () => {
    handleDelete(selectedUserId);
    handleCloseModal();
  };

  return (
    <div className='UsersAdmin'>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id} style={{ textDecoration: user.is_deleted ? 'line-through' : 'none' }}>
              <td>{user.user_id}</td>
              <td>{user.first_name} {user.last_name}</td>
              <td>{user.email}</td>
              <td>
                <FontAwesomeIcon icon={faEdit} onClick={() => handleUpdate(user.user_id)} />
                <FontAwesomeIcon icon={faBan} onClick={() => handleBan(user.user_id)} />
                <FontAwesomeIcon icon={faUndo} onClick={() => handleUnBan(user.user_id)} />
                <FontAwesomeIcon icon={faTrash} onClick={() => handleShowModal(user.user_id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UsersAdmin;
