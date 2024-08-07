import React from 'react';
import "./Style.css"
const Message = ({ message }) => {
    console.log(message);
  return (
    <div className='message'>
      {/* <strong>{message.from}: </strong> */}
      <span>{message.message.content}</span>
    </div>
  );
};

export default Message;
