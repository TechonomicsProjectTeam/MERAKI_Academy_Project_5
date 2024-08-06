import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className='AdminDashboard'>
      <Outlet /> 
    </div>
  );
};

export default AdminDashboard;
