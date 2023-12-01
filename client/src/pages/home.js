import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { SortControl } from '../components/SortControl';
import { SearchForm } from '../components/SearchForm';
import { SearchResults } from '../components/SearchResults';
import { SuperheroProvider } from '../context/SuperheroContext';

export const Home = () => {
  const [herolists, setHeroLists] = useState([]);
  const [savedHeroLists, setSavedHeroLists] = useState([]);

  const userID = useGetUserID();

  useEffect(() => {
    const fetchHeroLists = async () => {
      try {
        const response = await axios.get("http://localhost:3001/herolists");
        setHeroLists(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedHeroLists = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/herolists/savedHeroLists/ids/${userID}`
        );
        setSavedHeroLists(response.data.savedHeroLists);
      } catch (err) {
        console.log(err);
      }
    };

    fetchHeroLists();
    fetchSavedHeroLists();
  }, []);

  const saveHeroList = async (herolistID) => {
    try {
      const response = await axios.put("http://localhost:3001/herolists", {
        herolistID,
        userID,
      });
      setSavedHeroLists(response.data.savedHeroLists);
    } catch (err) {
      console.log(err);
    }
  };

  const isHeroListSaved = (id) => savedHeroLists.includes(id);

  return (
    <div>
      <SuperheroProvider> {/* Wrap new components in the provider */}
        <h1>Superheroes</h1>
        <SortControl />
        <SearchForm />
        <SearchResults />
      </SuperheroProvider>
      <h1>HeroLists</h1>
      <ul>
        {herolists.map((herolist) => (
          <li key={herolist._id}>
            <div>
              <h2>{herolist.name}</h2>
              <button
                onClick={() => saveHeroList(herolist._id)}
                disabled={isHeroListSaved(herolist._id)}
              >
                {isHeroListSaved(herolist._id) ? "Saved" : "Save"}
              </button>
            </div>
            <div className="instructions">
              <p>{herolist.instructions}</p>
            </div>
            <img src={herolist.imageUrl} alt={herolist.name} />
            <p>Cooking Time: {herolist.cookingTime} minutes</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
