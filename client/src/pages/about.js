import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const About = () => {
    return (
      <div className="about-container">
        <h2>Application Description</h2>
        <p>This app allows you to search for superheroes and save them to lists</p>
        <p>It also allows you to create your own lists of superheroes</p>
        <p>It also allows you to view other users' public lists</p>
        <p>It also allows you to comment other users' public lists if you are logged in</p>
        <p>If you account was disabled please contact the system admin at the following email:</p>
        <p>pgherghe@uwo.ca</p>
        <p> </p>
        <p>This app was created by Paul</p>
      </div>
    );
  };
  