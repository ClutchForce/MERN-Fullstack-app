import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";

export const Auth = () => {
  const { token } = useParams();

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (token) => {
    try {
      const response = await axios.get(`/auth/verify-email/${token}`);
      alert(response.data.message);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Error verifying email.");
      }
    }
  };
  return (
    <div className="auth">
      <Login />
      <Register />
    </div>
  );
};

const Login = () => {
  const [_, setCookies] = useCookies(["access_token"]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();



const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const result = await axios.post("/auth/login", {
      username,
      password,
    });

    setCookies("access_token", result.data.token);
    window.localStorage.setItem("userID", result.data.userID);
    navigate("/");
  } catch (error) {
    // Check if the error response has data and a message
    if (error.response && error.response.data && error.response.data.message) {
      alert(error.response.data.message); // Display the error message from the API
    } else {
      alert("An error occurred during login."); // General error message if specific message is not available
    }
    console.error(error); // Keep the console error for debugging
  }
};


  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="login-username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="login-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [emailToken, setEmailToken] = useState('');


  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await axios.post("/auth/register", { username, nickname, password });
      setEmailToken(result.data.emailToken);
      alert("Registration Completed! Now login.");
    } catch (error) {
    // Check if the error response has data and a message
    if (error.response && error.response.data && error.response.data.message) {
      alert(error.response.data.message); // Display the error message from the API
    } else {
      alert("An error occurred during login."); // General error message if specific message is not available
    }
    console.error(error); // Keep the console error for debugging
    }

  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="register-username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="nickname">Nickname:</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="register-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {emailToken && <div className="navbar">Click <div><a href={`/auth/verify-email/${emailToken}`}>here</a></div> to verify your email</div>}
    </div>
  );
};
