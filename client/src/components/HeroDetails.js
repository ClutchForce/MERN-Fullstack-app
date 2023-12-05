



export const HeroDetails = ({ details }) => {
    return (
      <div className="hero-details">
        <h3>Hero Details: {details.name}</h3>
        <p>Gender: {details.Gender}</p>
        <p>Eye Color: {details["Eye color"]}</p>
        <p>Race: {details.Race}</p>
        <p>Hair Color: {details["Hair color"]}</p>
        <p>Height: {details.Height} cm</p>
        <p>Publisher: {details.Publisher}</p>
        <p>Skin Color: {details["Skin color"] !== '-' ? details["Skin color"] : 'Not specified'}</p>
        <p>Alignment: {details.Alignment}</p>
        <p>Weight: {details.Weight} kg</p>
        <p>Powers:</p>
        <ul>
          {details.Powers.map((power, index) => (
            <li key={index}>{power}</li>
          ))}
        </ul>
      </div>
    );
  };