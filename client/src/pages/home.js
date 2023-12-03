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