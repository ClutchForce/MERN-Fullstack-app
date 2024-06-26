import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';

export const PublicListsContext = createContext();

export const PublicListsProvider = ({ children }) => {
  const [publicListResults, setPublicListsResults] = useState([]);


  const searchPublicLists = useCallback(async () => {
    try {
      const response = await axios.get(`/api/open/herolists/public`);
      setPublicListsResults(response.data);
    } catch (error) {
      console.error('Error fetching herolists:', error);
    }
  }, []); // Empty dependency array ensures this is created once

  const updatePublicLists = () => {
    searchPublicLists(); // Re-fetch the public lists
  };

  return (
    <PublicListsContext.Provider value={{ publicListResults, searchPublicLists, updatePublicLists }}>
      {children}
    </PublicListsContext.Provider>
  );
};
