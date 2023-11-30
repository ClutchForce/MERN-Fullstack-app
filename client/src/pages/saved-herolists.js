import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";

export const SavedHeroLists = () => {
  const [savedHeroLists, setSavedHeroLists] = useState([]);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchSavedHeroLists = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/herolists/savedHeroLists/${userID}`
        );
        setSavedHeroLists(response.data.savedHeroLists);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSavedHeroLists();
  }, []);
  return (
    <div>
      <h1>Saved HeroLists</h1>
      <ul>
        {savedHeroLists.map((herolist) => (
          <li key={herolist._id}>
            <div>
              <h2>{herolist.name}</h2>
            </div>
            <p>{herolist.description}</p>
            <img src={herolist.imageUrl} alt={herolist.name} />
            <p>Cooking Time: {herolist.cookingTime} minutes</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
