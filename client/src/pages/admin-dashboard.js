import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserInfo";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const AdminDashboard = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      
    </div>
  );
};
