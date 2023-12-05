import React, { useState, useContext } from 'react';
import { SuperheroContext } from '../context/SuperheroContext';
import axios from 'axios';
import { HeroDetails } from './HeroDetails';

export const SearchResults = () => {
  const { searchResults } = useContext(SuperheroContext);
  const [expandedHeroId, setExpandedHeroId] = useState(null); // State to track expanded hero
  const [heroDetails, setHeroDetails] = useState({}); // State to store hero details

  const handleToggleExpandHero = async (heroName) => {
    if (expandedHeroId === heroName) {
      setExpandedHeroId(null); // Collapse if already expanded
    } else {
      setExpandedHeroId(heroName); // Expand this hero
      if (!heroDetails[heroName]) {
        // Fetch hero details if not already fetched
        try {
          const response = await axios.get(` /api/open/superheroes/getHeroDetails/${heroName}`);
          setHeroDetails(prevState => ({
            ...prevState,
            [heroName]: response.data
          }));
        } catch (error) {
          console.error('Error fetching hero details:', error);
        }
      }
    }
  };

  const handleDuckDuckGoSearch = (heroName, publisher) => {
    const query = encodeURIComponent(`${heroName} ${publisher}`);
    const url = `https://duckduckgo.com/?q=${query}`;
    window.open(url, '_blank');
  };


  return (
    <ul id="results-container">
      {searchResults.map((hero, index) => (
        <li key={index}>
          <p>{hero.name}</p>
          <p>Publisher: {hero.Publisher}</p>
          <button onClick={() => handleToggleExpandHero(hero.name)}>
            {expandedHeroId === hero.name ? "Hide Details" : "Show Details"}
          </button>
          {expandedHeroId === hero.name && heroDetails[hero.name] && (
            <div>
              {/* Display hero details */}
              <HeroDetails details={heroDetails[hero.name]} />
              {/* Duckduckgo functionality */}
              <button onClick={() => handleDuckDuckGoSearch(hero.name, hero.Publisher)}>
                Search on DuckDuckGo
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};
