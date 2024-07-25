import React from 'react';
import { useSelector } from 'react-redux';

const NavBar = () => {
  const username = useSelector((state) => state.auth.username);
  const imageUrl = useSelector((state) => state.auth.images);
console.log(username);
  return (
    <div className="NavBar">
      <div className="user-info">
        {imageUrl && <img src={imageUrl} alt="User" className="user-image" />}
        {username && <span className="user-name">{username}</span>}
      </div>
      NavBar Component
    </div>
  );
};

export default NavBar;
