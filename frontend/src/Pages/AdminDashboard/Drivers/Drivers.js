import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers, deleteUserById, banUserById, unBanUserById } from '../../../redux/reducers/Users/Users';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faEdit, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';

const Drivers = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch('http://localhost:5000/users/role/2');
        const data = await response.json();
        if (data.success) {
          dispatch(setUsers(data.users));
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };

    fetchDrivers();
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
      console.error('Error banning driver:', error);
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
      console.error('Error unbanning driver:', error);
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
      console.error('Error deleting driver:', error);
    }
  };

  const handleUpdate = (user) => {
    // Handle update logic here
    console.log('Update user:', user);
  };

  return (
    <div className='Drivers'>
      <h2>Drivers</h2>
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
          {users.map((driver) => (
            <tr key={driver.user_id} style={{ textDecoration: driver.is_deleted ? 'line-through' : 'none' }}>
              <td>{driver.user_id}</td>
              <td>{driver.first_name} {driver.last_name}</td>
              <td>{driver.email}</td>
              <td>
                <FontAwesomeIcon icon={faEdit} onClick={() => handleUpdate(driver)} />
                <FontAwesomeIcon icon={faBan} onClick={() => handleBan(driver.user_id)} />
                <FontAwesomeIcon icon={faUndo} onClick={() => handleUnBan(driver.user_id)} />
                <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(driver.user_id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Drivers;
