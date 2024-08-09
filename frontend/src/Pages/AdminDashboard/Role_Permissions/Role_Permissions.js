import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getRolePermissions } from '../../../redux/reducers/Roles/Roles';
import "./Role_Permissions.css"

const Role_Permissions = () => {
  const dispatch = useDispatch();
  const rolePermissions = useSelector((state) => state.roles.rolePermissions);

  useEffect(() => {
    axios
      .get('https://quickserv.onrender.com/roles/role-permissions')
      .then((response) => {
        dispatch(getRolePermissions(response.data.result));
      })
      .catch((error) => {
        console.error('Error fetching role permissions:', error);
      });
  }, [dispatch]);

  return (
    <div className='Role_Permissions'>
      <h2>Role Permissions</h2>
      <table>
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Permission Name</th>
          </tr>
        </thead>
        <tbody>
          {rolePermissions.map((rolePermission) => (
            <tr key={rolePermission.id}>
              <td>{rolePermission.role_name}</td>
              <td>{rolePermission.permission_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Role_Permissions;
