import React, { useState, useRef, useEffect } from 'react';
import Suggestions from './Suggestions';

const SearchBar = ({ onSearch, suggestionsList = [], onInputChange, mode = 'images', onModeChange, onVoice, onCamera }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  const placeholderMap = {
    web: 'Search the web for articles, docs, and URLs...',
    images: 'Search for relevant links and resources...',
    voice: 'Click voice button and speak to search...',
  };


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

  const handleChange = (value) => {
    setQuery(value);
    if (onInputChange) onInputChange(value);
    setShowSuggestions(true);
  };

  // Filter basic suggestions based on input
  const filteredSuggestions = query
    ? suggestionsList.filter((s) => s.toLowerCase().includes(query.toLowerCase())).slice(0, 10)
    : [];

  return (
    <div ref={wrapperRef} className="w-full max-w-3xl mx-auto relative mt-8">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="w-full p-4 pl-12 text-lg text-gray-900 bg-white border border-gray-300 outline-none rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder={placeholderMap[mode] || placeholderMap.web}
            required
          />
        </div>

        <div className="flex items-center gap-1">
          {['images', 'voice'].map((type) => {
            const emoji = type === 'images' ? '📷' : '🎙';
            return (
              <button
                key={type}
                type="button"
                title={type === 'images' ? 'Search for relevant links' : 'Voice search'}
                onClick={() => {
                  if (type === 'voice') {
                    onModeChange?.('voice');
                    onVoice?.();
                  } else {
                    onModeChange?.('images');
                    onCamera?.();
                  }
                }}
                className={`w-10 h-10 flex items-center justify-center rounded-full border text-lg transition duration-200 ${
                  mode === type
                    ? 'bg-blue-600 text-white border-blue-700'
                    : 'bg-white text-gray-600 border-gray-300 hover:ring-2 hover:ring-blue-300'
                }`}
              >
                {emoji}
              </button>
            );
          })}
        </div>

        <button
          type="submit"
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-6 py-2.5 transition-colors shadow-md"
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
