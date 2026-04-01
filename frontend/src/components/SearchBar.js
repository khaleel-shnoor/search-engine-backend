import React, { useState, useRef, useEffect } from 'react';
import Suggestions from './Suggestions';

const SearchBar = ({ onSearch, suggestionsList = [] }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  // Filter basic suggestions based on input
  const filteredSuggestions = query
    ? suggestionsList.filter((s) => s.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : [];

  return (
    <div ref={wrapperRef} className="w-full max-w-3xl mx-auto relative">
      <form onSubmit={handleSubmit} className={`relative flex items-center transition-all duration-300 ${
        isFocused ? 'scale-105' : 'scale-100'
      }`}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg className={`w-5 h-5 transition-colors duration-300 ${
            isFocused ? 'text-blue-500' : 'text-gray-400'
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => setIsFocused(false)}
          className="block w-full p-4 pl-12 pr-24 text-lg text-gray-900 bg-white/80 backdrop-blur-sm border-2 border-white/50 outline-none rounded-full shadow-lg focus:ring-0 focus:border-blue-400 focus:shadow-2xl focus:bg-white/90 transition-all duration-300"
          placeholder="Search documents, articles, code..."
          autoComplete="off"
          required
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 transform -translate-y-1/2 btn-primary text-sm px-6 py-2 focus:ring-offset-0"
        >
          Search
        </button>
      </form>

      <Suggestions 
        suggestions={filteredSuggestions.length > 0 ? filteredSuggestions : []} 
        onSelect={handleSuggestionSelect} 
        visible={showSuggestions && query.length > 0} 
      />
    </div>
  );
};

export default SearchBar;
