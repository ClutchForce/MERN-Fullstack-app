import React, { useState, useContext } from 'react';
import { SuperheroContext } from '../context/SuperheroContext'; // Context to be created

export const SortControl = () => {
  const { setSortField, toggleSortOrder } = useContext(SuperheroContext); // Assuming you use context for state management

  return (
    <div id="sorting-controls">
      <label htmlFor="sort-field">Sort By:</label>
      <select id="sort-field" name="sort-field" onChange={(e) => setSortField(e.target.value)}>
        <option value="name">Name</option>
        <option value="Race">Race</option>
        <option value="Publisher">Publisher</option>
        <option value="powers">Number of Powers</option>
      </select>
      <button id="toggle-sort-order" type="button" onClick={toggleSortOrder}>Toggle Ascending/Descending</button>
    </div>
  );
};
