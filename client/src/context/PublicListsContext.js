
import React, { createContext, useState } from 'react';
import axios from 'axios';

export const PublicListsContext = createContext();

export const PublicListsProvider = ({ children }) => {
  const [publicListResults, setPublicListsResults] = useState([]);


  const searchPublicLists = async () => {
    try {
      // Update API call to include sorting and filtering logic
      const response = await axios.get(`http://localhost:3001/api/open/herolists/public`, {});
      console.log('response.data:', response.data);
      setPublicListsResults(response.data);
    } catch (error) {
      console.error('Error fetching herolists:', error);
    }
  };

//   searchPublicLists();
//   console.log('publicListResults:', publicListResults);

  return (
    <PublicListsContext.Provider value={{ publicListResults, searchPublicLists }}>
      {children}
    </PublicListsContext.Provider>
  );
};
