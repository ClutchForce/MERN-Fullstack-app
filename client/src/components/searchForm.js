import React, { useState, useContext } from 'react';
import { SuperheroContext } from '../context/SuperheroContext'; // Context to be created

export const SearchForm = () => {
  const [searchField, setSearchField] = useState('');
  const [searchPattern, setSearchPattern] = useState('');
  const { searchSuperheroes } = useContext(SuperheroContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    searchSuperheroes(searchField, searchPattern);
  };

  return (
    <form id="search-form" onSubmit={handleSubmit}>
      <label htmlFor="search-field">Search Field:</label>
      <input type="text" id="search-field" name="search-field" required onChange={(e) => setSearchField(e.target.value)} />
      <label htmlFor="search-pattern">Search Pattern:</label>
      <input type="text" id="search-pattern" name="search-pattern" required onChange={(e) => setSearchPattern(e.target.value)} />
      <button type="submit">Search</button>
    </form>
  );
};
