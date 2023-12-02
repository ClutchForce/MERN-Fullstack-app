import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';

export const PublicListsContext = createContext();

export const PublicListsProvider = ({ children }) => {
  const [publicListResults, setPublicListsResults] = useState([]);


  const searchPublicLists = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/open/herolists/public`);
      setPublicListsResults(response.data);
    } catch (error) {
      console.error('Error fetching herolists:', error);
    }
  }, []); // Empty dependency array ensures this is created once

//   searchPublicLists();
//   console.log('publicListResults:', publicListResults);

  return (
    <PublicListsContext.Provider value={{ publicListResults, searchPublicLists }}>
      {children}
    </PublicListsContext.Provider>
  );
};
