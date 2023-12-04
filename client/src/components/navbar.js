import React, {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
// import jwtDecode from 'jwt-decode';


export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const isAuthenticated = !!cookies.access_token; // Convert to boolean
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      checkAdminStatus(cookies.access_token).then(isAdmin => {
        setIsAdmin(isAdmin);
        //if admin, set isAdmin to true create an alert saying an admin is logged in
        // if (isAdmin) {
        //   alert("Admin is logged in");
        // }
      });
    }
  }, [isAuthenticated, cookies.access_token]);

  const navigate = useNavigate();

  const checkAdminStatus = async (token) => {
    try {
      const response = await axios.get('/api/secure/users/checkAdmin', {
        headers: { Authorization: token }
      });
      return response.data.isAdmin;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.clear();
    navigate("/auth");
  };
  return (
    <div className="navbar">
      <h1>The Superhero App</h1>
      <Link to="/">About</Link>
      <Link to="/home">Home</Link>
      {isAuthenticated && !isAdmin && (
        <>
          <Link to="/create-herolist">Create HeroList</Link>
          <Link to="/saved-herolists">My HeroLists</Link>
        </>
      )}
      {isAdmin && (
        <Link to="/admin-dashboard">Admin Dashboard</Link>
      )}
      {!isAuthenticated ? (
        <Link to="/auth">Login/Register</Link>
      ) : (
        <button onClick={logout}> Logout </button>
      )}
    </div>
  );
};
