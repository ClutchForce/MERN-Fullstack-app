// import React, { useState, useContext } from 'react';
// import { PublicListsContext } from '../context/PublicListsContext'; // Context to be created

// export const HeroListDisplay = ({ herolist }) => {
//     const { listResults } = useContext(PublicListsContext);
//     const [isExpanded, setIsExpanded] = useState(false);
  
//     return (
//       <div className="herolist-item">
//         <h2>{herolist.name}</h2>
//         <button onClick={() => setIsExpanded(!isExpanded)}>
//           {isExpanded ? "Hide Details" : "Show Details"}
//         </button>
  
//         {isExpanded && (
//           <div className="herolist-details">
//             <p>Description: {herolist.description}</p>
//             {/* Display hero names, comments, ratings etc. */}
//           </div>
//         )}
//       </div>
//     );
//   };
import React, { useState, useContext } from 'react';
import { PublicListsContext } from '../context/PublicListsContext'; // Context to be created

export const HeroListDisplay = () => {
  const { publicListResults } = useContext(PublicListsContext);
  const [isExpanded, setIsExpanded] = useState(false);
  //Throws error herolist not defined
  //console.log(publicListResults.map((herolist, index)));


  return (
    <div>
      {publicListResults.map((herolist, index) => (
        <div key={index} className="herolist-item">
          <h2>{herolist.name}</h2>
          <div>
            <span>Nickname: {herolist.nickname}</span>
            <span>Number of Heroes: {herolist.heronamelist.length}</span>
            <span>Average Rating: {herolist.averageRating}</span>
          </div>
          {/* Additional logic for expanding and showing details */}
        </div>
      ))}
    </div>
  );
};