import React, { useEffect, useState, useCallback } from "react";
import { useGetUserID } from "../hooks/useGetUserInfo";
import { useCookies } from "react-cookie";
import axios from "axios";
import { HeroDetails } from "../components/HeroDetails";


export const SavedHeroLists = () => {
  const [savedHeroLists, setSavedHeroLists] = useState([]);
  const [expandedListId, setExpandedListId] = useState(null);
  const [expandedHeroId, setExpandedHeroId] = useState(null);
  const [editListId, setEditListId] = useState(null); // Track the ID of the list being edited
  const [editListDetails, setEditListDetails] = useState({}); // Store the edited list details
  const [heroDetails, setHeroDetails] = useState({});
  const userID = useGetUserID();
  const [cookies] = useCookies(["access_token"]);

  const fetchSavedHeroLists = useCallback(async () => {
    try {
      const response = await axios.get(
        `/api/secure/herolists/savedHeroLists/${userID}`,
        { headers: { Authorization: `${cookies.access_token}` } }
      );
      setSavedHeroLists(response.data);
    } catch (err) {
      console.log(err);
    }
  }, [userID, cookies.access_token]); // Add dependencies here

  const handleToggleListExpand = (listId) => {
    setExpandedListId(expandedListId === listId ? null : listId);
  };

  useEffect(() => {
    fetchSavedHeroLists();
  }, [fetchSavedHeroLists]); // Dependency array now includes memoized function

  const handleToggleHeroExpand = async (heroName) => {
    if (expandedHeroId === heroName) {
      setExpandedHeroId(null);
    } else {
      setExpandedHeroId(heroName);
      if (!heroDetails[heroName]) {
        try {
          const response = await axios.get(`/api/open/superheroes/getHeroDetails/${heroName}`);
          setHeroDetails({ ...heroDetails, [heroName]: response.data });
        } catch (error) {
          console.error('Error fetching hero details:', error);
        }
      }
    }
  };

  const handleEditListToggle = (listId) => {
    if (editListId === listId) {
      setEditListId(null);
    } else {
      setEditListId(listId);
      const listToEdit = savedHeroLists.find(list => list._id === listId);
      setEditListDetails(listToEdit);
    }
  };

  const handleEditListDetailsChange = (event) => {
    const { name, value } = event.target;
    setEditListDetails(prev => ({ ...prev, [name]: value }));
  };

  // Function to handle changes in hero names within the list
  const handleHeroNameChange = (event, index) => {
    const newHeroNameList = [...editListDetails.heronamelist];
    const newName = event.target.value.trim();
    if (newName === '') {
      newHeroNameList.splice(index, 1); // Remove the hero if the name is empty
    } else {
      newHeroNameList[index] = newName;
    }
    setEditListDetails({ ...editListDetails, heronamelist: newHeroNameList });
  };

  // Function to add a new hero name field
  const handleAddHeroName = () => {
    setEditListDetails({ ...editListDetails, heronamelist: [...editListDetails.heronamelist, ''] });
  };

  // Function to toggle the public/private status of the list
  const handlePublicToggle = () => {
    setEditListDetails({ ...editListDetails, isPublic: !editListDetails.isPublic });
  };
  

  const validateAndSubmitEdits = async () => {
    if (!editListDetails.name.trim()) {
      alert('Name cannot be empty.');
      return;
    }
  
    // Check for unique name among user's lists
    const isNameUnique = savedHeroLists.every(list => list._id === editListId || list.name !== editListDetails.name);
    if (!isNameUnique) {
      alert('List name must be unique.');
      return;
    }
  
    // Filter out empty hero names and validate heroes
    const filteredHeroNames = editListDetails.heronamelist.filter(heroName => heroName.trim());
    if (filteredHeroNames.length === 0) {
      alert('At least one hero is required.');
      return;
    }
  
    for (const heroName of filteredHeroNames) {
      try {
        await axios.get(`/api/open/superheroes/getHeroDetails/${heroName}`);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          alert(`Hero ${heroName} does not exist.`);
          return;
        }
      }
    }
  
    const isConfirmed = window.confirm('Are you sure you want to save these changes?');
    if (!isConfirmed) {
      return;
    }
  
    // Proceed with update API call
    const updatedListDetails = { ...editListDetails, heronamelist: filteredHeroNames };
    try {
      await axios.put(`/api/secure/herolists/updateList/${editListId}`, updatedListDetails, {
        headers: { Authorization: `${cookies.access_token}` }
      });
      fetchSavedHeroLists(); // Refresh the lists
      setEditListId(null); // Exit edit mode
    } catch (error) {
      console.error('Error updating list:', error);
    }
  };
  
  const handleCancelEdit = () => {
    setEditListId(null); // Exit edit mode
  };

  const handleDeleteList = async (herolistId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this list?");
    if (isConfirmed) {
      try {
        await axios.delete(`/api/secure/herolists/deleteSavedList/${herolistId}`, {
          headers: { Authorization: `${cookies.access_token}` }
        });
        fetchSavedHeroLists(); // Refetch the lists to update UI
      } catch (error) {
        console.error('Error deleting list:', error);
      }
    }
  };

  const handleDuckDuckGoSearch = (heroName, publisher) => {
    const query = encodeURIComponent(`${heroName} ${publisher}`);
    const url = `https://duckduckgo.com/?q=${query}`;
    window.open(url, '_blank');
  };




  return (
    <div>
      <h1>My HeroLists</h1>
      <ul>
        {savedHeroLists.map((herolist) => (
          <li key={herolist._id}>
            {/* Edit Mode */}
            {editListId === herolist._id ? (
              <div>
                <h2>{herolist.name} Edit</h2>
                <input
                  type="text"
                  name="name"
                  value={editListDetails.name}
                  onChange={handleEditListDetailsChange}
                  placeholder="List Name"
                />
                <textarea
                  name="description"
                  value={editListDetails.description}
                  onChange={handleEditListDetailsChange}
                  placeholder="Description"
                />
                {/* Iterate over hero names for editing */}
                <p>Hero Name List (leave input empty and save to delete hero)</p>
                {editListDetails.heronamelist.map((heroName, index) => (
                  <input
                    key={index}
                    type="text"
                    value={heroName}
                    onChange={(e) => handleHeroNameChange(e, index)}
                    placeholder="Hero Name"
                  />
                ))}
                <button type="button" onClick={handleAddHeroName}>
                  Add Hero
                </button>
                <label>
                  Public:
                  <input
                    type="checkbox"
                    checked={editListDetails.isPublic}
                    onChange={handlePublicToggle}
                  />
                </label>
                <button onClick={validateAndSubmitEdits}>Save Changes</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            ) : (
              <div>
                {/* Display Mode */}
                <h2>{herolist.name}</h2>
                <button onClick={() => handleEditListToggle(herolist._id)}>Edit List</button>
                <p>Number of heroes: {herolist.heronamelist.length}</p>
                <p>Average rating: {herolist.averageRating.toFixed(1)}</p>
                <button onClick={() => handleToggleListExpand(herolist._id)}>
                  {expandedListId === herolist._id ? "Hide Details" : "Show Details"}
                </button>
                {expandedListId === herolist._id && (
                  <div>
                    <p>Description: {herolist.description}</p>
                    <p>Heros in List: </p>
                    <ul>
                      {herolist.heronamelist.map((heroName) => (
                        <li key={heroName}>
                          Hero name: {heroName}
                          <button onClick={() => handleToggleHeroExpand(heroName)}>
                            {expandedHeroId === heroName ? "Hide Details" : "Show Details"}
                          </button>
                          {expandedHeroId === heroName && heroDetails[heroName] && (
                            <div>
                              <HeroDetails details={heroDetails[heroName]} />
                              {/* Duckduckgo functionality */}
                              <button onClick={() => handleDuckDuckGoSearch(heroName, heroDetails[heroName].Publisher)}>
                                Search on DuckDuckGo
                              </button>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                    <p>Reviews: </p>
                    {/* functionality to display comments if they are visable*/}
                    {/* TODO*/}

                    <ul>
                      {herolist.reviews.map((review) => (
                        <li key={review._id}>
                          <p>Commenter: {review.nickname}</p>
                          <p>Comment: {review.comment}</p>
                          <p>Rating: {review.rating}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <button onClick={() => handleDeleteList(herolist._id)} style={{ marginLeft: '10px' }}>
                  Delete List
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};


