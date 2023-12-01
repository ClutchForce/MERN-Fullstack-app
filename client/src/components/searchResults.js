import React, { useContext } from 'react';
import { SuperheroContext } from '../context/SuperheroContext'; // Context to be created

export const SearchResults = () => {
  const { searchResults } = useContext(SuperheroContext);

  return (
    <div id="results-container">
      {searchResults.map((hero, index) => (
        <div key={index}>
          <p>{hero.name}</p>
          <p>{hero.Publisher}</p>

          {/* Include other hero details you want to display */}
        </div>
      ))}
    </div>
  );
};
