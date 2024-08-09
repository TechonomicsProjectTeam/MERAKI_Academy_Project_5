import React, { useRef } from 'react';
import emailjs from 'emailjs-com';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBInput,
  MDBBtn,
} from 'mdb-react-ui-kit';
import "./ContactUs.css"

const ContactUs = ({ onClose }) => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    // Define multiple recipients
    const recipients = 'ahmad.azmi.zed@gmail.com,natali.m.tawalbeh@gmail.com,loai.m.albadawi@gmail.com';

    // Set the value of the hidden to_email input field
    form.current.to_email.value = recipients;

    emailjs
      .sendForm('service_g6h4fbb', 'template_ei7t17h', form.current, 'T-VrkE9RGYjYsaho0')
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.error('FAILED...', error);
        }
      );
  };

  return (
    <div className="contact-us-modal show">
    <div className="contact-us-card">
      <button className="btn-close" onClick={onClose}></button>
      <h3 className='contactt'>Contact Us</h3>
      <form className="contact-us-form">
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="from_name" required />
        
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email_id" required />
        
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required></textarea>
        
        <input type="hidden" name="to_email" />
        
        <button type="submit">Send</button>
      </form>
    </div>
  </div>
  );
};

export default ContactUs;
