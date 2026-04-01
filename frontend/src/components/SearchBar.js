import React, { useState, useRef, useEffect } from 'react';
import Suggestions from './Suggestions';

const SearchBar = ({ onSearch, suggestionsList = [] }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
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
    <div ref={wrapperRef} className="w-full max-w-3xl mx-auto relative mt-8">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
          onFocus={() => setShowSuggestions(true)}
          className="block w-full p-4 pl-12 text-lg text-gray-900 bg-white border border-gray-300 outline-none rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Search documents, articles, etc..."
          required
        />
        <button
          type="submit"
          className="text-white absolute right-2.5 bottom-2.5 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-6 py-2.5 transition-colors shadow-md"
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
