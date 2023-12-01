import React, { useState, useContext } from 'react';
import { SuperheroContext } from '../context/SuperheroContext'; // Context to be created

export const SearchForm = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [race, setRace] = useState('');
  const [publisher, setPublisher] = useState('');
  const [powers, setPowers] = useState('');
  const { searchSuperheroes } = useContext(SuperheroContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    searchSuperheroes({ name, gender, race, publisher, powers});
  };
//TODO search should work for multiple values, if the user searches only by name, then it would display results for name, if the user searches by name and gender then it would display results matching the name and the specified gender.
  return (
    <form id="search-form" onSubmit={handleSubmit}>
      <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Gender" onChange={(e) => setGender(e.target.value)} />
      <input type="text" placeholder="Race" onChange={(e) => setRace(e.target.value)} />
      <input type="text" placeholder="Publisher" onChange={(e) => setPublisher(e.target.value)} />
      <input type="text" placeholder="Powers" onChange={(e) => setPowers(e.target.value)} />
      <button type="submit">Search</button>
    </form>
  );
};
