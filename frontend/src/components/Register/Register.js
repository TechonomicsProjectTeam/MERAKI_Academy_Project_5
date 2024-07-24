import React, { useContext, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUsers } from "../redux/reducers/Users/Users";
const Register = () => {
    
  const dispatch=useDispatch()
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("")
  const [image, setImage] = useState("")
  const [message, setMessage] = useState("");
  
  const createNewUser=()=>{
try {
    const result= axios.post("http://localhost:5000/users/register",{
        firstName,
        lastName,
        email,
        userName,
        password,
        phoneNumber,
        image
    })
} catch (error) {
    
}
  }
  return <div className="Register"></div>;
};

export default Register;
