import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { setLogin, setUserId } from "../../redux/reducers/Auth/Auth";

const Login = () => {
  const isLoggedIn = useSelector((state) => {
    return state.auth.isLoggedIn;
  });
  console.log(isLoggedIn);

  const history = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(false);

  const dispatch = useDispatch();

  const auth = useSelector((store) => {
    return {
      auth: store.auth,
    };
  });

  const login = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("http://localhost:5000/users/login", {
        email,
        password,
      });
      if (result.data) {
        console.log(result.data);
        const token = result.data.token;
        setMessage("");
        dispatch(setLogin(result.data.token));
        dispatch(setUserId(result.data.userId));
        const decodedToken = jwtDecode(token);
        const roleId = decodedToken.role;
        console.log(roleId);
        if (roleId === 1) {
          history("/user-dashboard");
        } else if (roleId === 2) {
          history("/driver-dashboard");
        }
      } else throw Error;
    } catch (error) {
      if (error.response && error.response.data) {
        return setMessage(error.response.data.message);
      }
      setMessage("Error happened while Login, please try again");
    }
  };
  //   useEffect(() => {
  //     if (isLoggedIn) {
  //       history("/dashboard");
  //     }
  //   });

  return (
    <>
      <div className="Form">
        <p className="Title">Login:</p>
        <form onSubmit={login}>
          <br />

          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button
            onClick={(e) => {
              login(e);
            }}
          >
            Login
          </button>
        </form>

        {status
          ? message && <div className="SuccessMessage">{message}</div>
          : message && <div className="ErrorMessage">{message}</div>}
      </div>
    </>
  );
};

export default Login;
