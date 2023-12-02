import React, { useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserInfo";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const CreateHeroList = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const [herolist, setHeroList] = useState({
    name: "",
    description: "",
    heronamelist: [],
    isPublic: false,
    //lastModified date
    lastModified: new Date(),
    averageRating: 0,
    comments: [],
    ratings: [],
    nickname: "",
    userOwner: userID,
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setHeroList({
      ...herolist,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleHeroNameChange = (event, index) => {
    const { value } = event.target;
    const heronamelist = [...herolist.heronamelist];
    heronamelist[index] = value;
    setHeroList({ ...herolist, heronamelist });
  };

  const handleAddHeroName = () => {
    const heronamelist = [...herolist.heronamelist, ""];
    setHeroList({ ...herolist, heronamelist });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(
        "http://localhost:3001/api/open/herolists",
        { ...herolist },
        {
          headers: { authorization: cookies.access_token },
        }
      );

      alert("HeroList Created");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="create-herolist">
      <h2>Create HeroList</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={herolist.name}
          onChange={handleChange}
        />
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={herolist.description}
          onChange={handleChange}
        ></textarea>
        <label htmlFor="isPublic">Public List</label>
        <input
          type="checkbox"
          id="isPublic"
          name="isPublic"
          checked={herolist.isPublic}
          onChange={handleChange}
        />
        <label htmlFor="heronamelist">Hero Name List</label>
        {herolist.heronamelist.map((hero, index) => (
          <input
            key={index}
            type="text"
            name="heronamelist"
            value={hero}
            onChange={(event) => handleHeroNameChange(event, index)}
          />
        ))}
        <button type="button" onClick={handleAddHeroName}>
          Add Hero
        </button>
        <button type="submit">Create HeroList</button>
      </form>
    </div>
  );
};
