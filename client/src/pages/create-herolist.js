import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserInfo";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const CreateHeroList = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const [existingHeroLists, setExistingHeroLists] = useState([]);
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

  useEffect(() => {
    const fetchUserHeroLists = async () => {
      try {
        const response = await axios.get(
          `/api/secure/herolists/savedHeroLists/${userID}`,
          { headers: { Authorization: cookies.access_token } }
        );
        setExistingHeroLists(response.data);
      } catch (error) {
        console.error('Error fetching hero lists:', error);
      }
    };
    fetchUserHeroLists();
  }, [userID, cookies.access_token]);

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

    // Check for missing required attributes
    if (!herolist.name.trim() || herolist.heronamelist.length === 0) {
      alert("Name and at least one hero are required.");
      return;
    }

    // Check for duplicate list name
    if (existingHeroLists.some(list => list.name === herolist.name)) {
      alert("A list with this name already exists.");
      return;
    }

    // Check for list limit
    if (existingHeroLists.length >= 20) {
      alert("You cannot have more than 20 lists.");
      return;
    }

    try {
      await axios.post(
        "/api/open/herolists",
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
