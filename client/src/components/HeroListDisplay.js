import React, { useState, useContext } from 'react';
import { PublicListsContext } from '../context/PublicListsContext'; // Context to be created
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useGetUserID } from "../hooks/useGetUserInfo";
import { HeroDetails } from './HeroDetails';



export const HeroListDisplay = () => {
  const { publicListResults } = useContext(PublicListsContext);
  // const [isExpanded, setIsExpanded] = useState(false);
  const [selectedHeroList, setSelectedHeroList] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [cookies] = useCookies(['access_token']);
  const { updatePublicLists } = useContext(PublicListsContext);
  const userID = useGetUserID();

  const [expandedListId, setExpandedListId] = useState(null); // Track the ID of the expanded list
  const [expandedListHeroId, setExpandedListHeroId] = useState(null); // Track the ID of the expanded list
  const [heroDetails, setHeroDetails] = useState({}); // New state for hero details


  const handleToggleExpand = (listId) => {
    if (expandedListId === listId) {
      setExpandedListId(null); // If the list is already expanded, collapse it
    } else {
      setExpandedListId(listId); // Otherwise, expand this list
    }
  };

  const fetchHeroDetails = async (heroName) => {
    try {
      const response = await axios.get(`/api/open/superheroes/getHeroDetails/${heroName}`);
      setHeroDetails(prevState => ({
        ...prevState,
        [heroName]: response.data
      }));
    } catch (error) {
      console.error('Error fetching hero details:', error);
    }
  };

  const handleToggleExpandHero = (heroName) => {
    if (expandedListHeroId === heroName) {
      setExpandedListHeroId(null);
    } else {
      setExpandedListHeroId(heroName);
      if (!heroDetails[heroName]) { // Only fetch details if they haven't been fetched before
        fetchHeroDetails(heroName);
      }
    }
  };

  //Throws error herolist not defined
  //console.log(publicListResults.map((herolist, index)));
  const isAuthenticated = !!cookies.access_token; // Determine if user is logged in

  const handleSelectHeroList = (herolist) => {
    setSelectedHeroList(herolist);
    //print out the herolist comments array
    // Additional logic for opening review form can be added here
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (rating === 0) {
      alert('Rating is required');
      return;
    }
  
    // Confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to submit this review?');
    if (!isConfirmed) {
      // If user cancels, hide the review form and return early
      setSelectedHeroList(null);
      return;
    }
  
    try {
      const ratingNumber = Number(rating);
      // const userid = window.localStorage.getItem("userID");
      const userid = userID;
  
      await axios.post('/api/secure/herolists/review', {
        userID: userid,
        herolistId: selectedHeroList._id,
        comment,
        ratingNumber
      }, {
        headers: { Authorization: `${cookies.access_token}` }
      });
  
      console.log('Review submitted');
      updatePublicLists(); // Update the public lists
      setSelectedHeroList(null); // Hide the review form
  
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleDuckDuckGoSearch = (heroName, publisher) => {
    const query = encodeURIComponent(`${heroName} ${publisher}`);
    const url = `https://duckduckgo.com/?q=${query}`;
    window.open(url, '_blank');
  };

  

  return (
    <div>
      {/* On selecting a list, set the selectedHeroList and show the review form */}
      {selectedHeroList && (
        <div>
          <h2>Reviewing {selectedHeroList.name}</h2>
          <form onSubmit={handleSubmit}>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
            {/* rating is mantatory input (make sure that user can not submit without entering a rating) select option one through five */}
            <label htmlFor="rating">Rating:</label>
            {/* include an empty placeholder option */}
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="0">Select a rating</option>
              <option value="1">1 star</option>
              <option value="2">2 stars</option>
              <option value="3">3 stars</option>
              <option value="4">4 stars</option>
              <option value="5">5 stars</option>
            </select>
            <button type="submit">Submit Review</button>
          </form>
        </div>
      )}
      <ul>
      {publicListResults.map((herolist, index) => (
        // Each list shows the name of the list, creator’s nickname, number of heroes in each list  and the average rating.
        <li key={index} className="herolist-item">
          <h2>{herolist.name}</h2>
          <p>Created by: {herolist.nickname}</p>
          <p>Number of heroes: {herolist.heronamelist.length}</p>
          {/* format the average rating to one decimal place */}
          <p>Average rating: {herolist.averageRating.toFixed(1)}</p>
          {/* Add a button to show the details of the list */}
          <button onClick={() => handleToggleExpand(herolist._id)}>
              {expandedListId === herolist._id ? "Hide Details" : "Show Details"}
            </button>

            {/* Show details if this list is the expanded one */}
            {expandedListId === herolist._id && (
              <div>
                {/* description of hero list if any  */}
                <p>Description: {herolist.description}</p>
                {/* Display a ul of all the hero names in heronamelist and an show more information toggle under the hero name which will add the hero detail to the il until the button is toggled again. */}
                <p>Heros in List: </p>
                <ul>
                  {herolist.heronamelist.map((heroName) => (
                      <li key={heroName}>
                        Hero name: {heroName}
                        <button onClick={() => handleToggleExpandHero(heroName)}>
                          {expandedListHeroId === heroName ? "Hide Details" : "Show Details"}
                        </button>
                        {expandedListHeroId === heroName && heroDetails[heroName] && (
                          <div>
                            {/* Display hero details */}
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
                {/* functionality to display comments */}
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
          {/* Additional logic for expanding and showing details */}
          {/* logic for adding comments if user is loggend in */}
          {isAuthenticated && (
              <button onClick={() => handleSelectHeroList(herolist)}>
                Add Review
              </button>
            )}
        </li>
      ))}
      </ul>
    </div>
  );
};