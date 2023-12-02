import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserInfo";
import { useCookies } from "react-cookie";
import axios from "axios";

export const SavedHeroLists = () => {
  const [savedHeroLists, setSavedHeroLists] = useState([]);
  const userID = useGetUserID();
  const [cookies] = useCookies(["access_token"]); // Retrieve the token

  useEffect(() => {
    const fetchSavedHeroLists = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/secure/herolists/savedHeroLists/${userID}`,
          {
            headers: {
              Authorization: `${cookies.access_token}` // Send the token in the request headers
            }
          }
        );
        setSavedHeroLists(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (cookies.access_token) {
      console.log("Fetching saved herolists");
      fetchSavedHeroLists(); // Only fetch lists if user is authenticated
    }
  }, [userID, cookies.access_token]); // Depend on userID and access_token
  return (
    <div>
      <h1>My HeroLists</h1>
      <ul>
        {savedHeroLists.map((herolist) => (
          <li key={herolist._id}>
            <div>
              <h2>{herolist.name}</h2>
            </div>
            <p>{herolist.description}</p>
            <p>{herolist.comments}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};


// export const SavedHeroLists = () => {
//   const [savedHeroLists, setSavedHeroLists] = useState([]);
//   const userID = useGetUserID();

//   useEffect(() => {
//     const fetchSavedHeroLists = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3001/api/open/herolists/savedHeroLists/${userID}`
//         );
//         setSavedHeroLists(response.data.savedHeroLists);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchSavedHeroLists();
//   }, []);
//   return (
//     <div>
//       <h1>My HeroLists</h1>
//       <ul>
//         {savedHeroLists.map((herolist) => (
//           <li key={herolist._id}>
//             <div>
//               <h2>{herolist.name}</h2>
//             </div>
//             <p>{herolist.description}</p>
//             {/* Refactor */}
//             {/* <img src={herolist.imageUrl} alt={herolist.name} /> */}
//             {/* Refactor */}
//             {/* <p>Cooking Time: {herolist.cookingTime} minutes</p> */}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };