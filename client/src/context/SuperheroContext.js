import React, { createContext, useState } from 'react';
import axios from 'axios';

export const SuperheroContext = createContext();

export const SuperheroProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [sortField, setSortField] = useState('name');
  const [isAscending, setIsAscending] = useState(true);

  const searchSuperheroes = async (searchParams) => {
    try {
      const response = await axios.get(`/api/open/superheroes/search`, {
        params: searchParams
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching superheroes:', error);
    }
  };

  const toggleSortOrder = () => {
    setIsAscending(!isAscending);
    // You may want to re-fetch or re-sort the search results here
  };

  return (
    <SuperheroContext.Provider value={{ searchResults, searchSuperheroes }}>
      {children}
    </SuperheroContext.Provider>
  );
};


