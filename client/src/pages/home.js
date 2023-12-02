import React, { useEffect, useState, useContext } from "react";
import { useGetUserID } from "../hooks/useGetUserInfo";
import axios from "axios";
import { SortControl } from '../components/SortControl';
import { SearchForm } from '../components/SearchForm';
import { SearchResults } from '../components/SearchResults';
import { SuperheroProvider } from '../context/SuperheroContext';
// import { PublicListsContext } from "../context/PublicListsContext";
import { HeroListDisplay } from '../components/HeroListDisplay';
import { PublicListsProvider, PublicListsContext } from '../context/PublicListsContext';

const PublicListContent = () => {
  const { publicListResults, searchPublicLists } = useContext(PublicListsContext);

  useEffect(() => {
    searchPublicLists();
  }, [searchPublicLists]);

  // ... rest of your component logic

  return (
    <div>
      {/* Your Home component content here */}
      <HeroListDisplay />
    </div>
  );
};

export const Home = () => {
  return (
    <div>
      <SuperheroProvider> {/* Wrap new components in the provider */}
        <h1>Superheroes Search</h1>
        <SortControl />
        <SearchForm />
        <SearchResults />
      </SuperheroProvider>
      <PublicListsProvider>
        <h1>Public HeroLists</h1>
        <PublicListContent />
      </PublicListsProvider>
    </div>
  );
};


// export const Home = () => {
//   // const [herolists, setPublicHeroLists] = useState([]);
//   // const [savedHeroLists, setSavedHeroLists] = useState([]);

//   const { searchPublicLists } = useContext(PublicListsContext);
//   //const { searchPublicLists } = useContext(PublicListsContext);

//   const userID = useGetUserID();

//   useEffect(() => {
//     searchPublicLists();
//   }, [searchPublicLists]);


//   // useEffect(() => {
//   //   const fetchHeroLists = async () => {
//   //     try {
//   //       const response = await axios.get("http://localhost:3001/api/open/herolists");
//   //       setPublicHeroLists(response.data);
//   //     } catch (err) {
//   //       console.log(err);
//   //     }
//   //   };

//   //   const fetchSavedHeroLists = async () => {
//   //     try {
//   //       const response = await axios.get(
//   //         `http://localhost:3001/herolists/api/open/savedHeroLists/ids/${userID}`
//   //       );
//   //       setSavedHeroLists(response.data.savedHeroLists);
//   //     } catch (err) {
//   //       console.log(err);
//   //     }
//   //   };

//   //   fetchHeroLists();
//   //   fetchSavedHeroLists();
//   // }, []);

//   // const saveHeroList = async (herolistID) => {
//   //   try {
//   //     const response = await axios.put("http://localhost:3001/api/open/herolists", {
//   //       herolistID,
//   //       userID,
//   //     });
//   //     setSavedHeroLists(response.data.savedHeroLists);
//   //   } catch (err) {
//   //     console.log(err);
//   //   }
//   // };

//   // const isHeroListSaved = (id) => savedHeroLists.includes(id);

//   return (
//     <div>
//       <SuperheroProvider> {/* Wrap new components in the provider */}
//         <h1>Superheroes Search</h1>
//         <SortControl />
//         <SearchForm />
//         <SearchResults />
//       </SuperheroProvider>
//       <PublicListsProvider>
//         <h1>Public HeroLists</h1>
//         {/* <ul>
//           {herolists.map((herolist) => (
//             <li key={herolist._id}>
//               <div>
//                 <h2>{herolist.name}</h2>
//                 <button
//                   onClick={() => saveHeroList(herolist._id)}
//                   disabled={isHeroListSaved(herolist._id)}
//                 >
//                   {isHeroListSaved(herolist._id) ? "Saved" : "Save"}
//                 </button>
//               </div>
//               <div className="instructions">
//                 <p>{herolist.instructions}</p>
//               </div>
//               <img src={herolist.imageUrl} alt={herolist.name} />
//               <p>Cooking Time: {herolist.cookingTime} minutes</p>
//             </li>
//           ))}
//         </ul> */}
//         <HeroListDisplay />
//       </PublicListsProvider>
//     </div>
//   );
// };
