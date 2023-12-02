import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const isAuthenticated = !!cookies.access_token; // Convert to boolean
  const navigate = useNavigate();

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.clear();
    navigate("/auth");
  };
  return (
    <div className="navbar">
      <Link to="/">Home</Link>
      {isAuthenticated && (
        <>
          <Link to="/create-herolist">Create HeroList</Link>
          <Link to="/saved-herolists">Saved HeroLists</Link>
        </>
      )}
      {!isAuthenticated ? (
        <Link to="/auth">Login/Register</Link>
      ) : (
        <button onClick={logout}> Logout </button>
      )}
    </div>
  );
};
