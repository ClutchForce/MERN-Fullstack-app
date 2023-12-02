import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserInfo";
import axios from "axios";

export const SavedHeroLists = () => {
  const [savedHeroLists, setSavedHeroLists] = useState([]);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchSavedHeroLists = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/open/herolists/savedHeroLists/${userID}`
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
            {/* Refactor */}
            {/* <img src={herolist.imageUrl} alt={herolist.name} /> */}
            {/* Refactor */}
            {/* <p>Cooking Time: {herolist.cookingTime} minutes</p> */}
          </li>
        ))}
      </ul>
    </div>
  );
};
