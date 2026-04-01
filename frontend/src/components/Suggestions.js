import React, { useState, useEffect, useRef } from 'react';

const Suggestions = ({ suggestions, onSelect, visible }) => {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  if (!visible || !suggestions || suggestions.length === 0) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      onSelect(suggestions[highlightedIndex]);
    }
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl border border-white/50 rounded-xl shadow-2xl overflow-hidden z-50 animate-slide-down">
      <ul className="py-2 max-h-64 overflow-y-auto">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            onClick={() => onSelect(suggestion)}
            onMouseEnter={() => setHighlightedIndex(index)}
            className={`px-4 py-3 cursor-pointer transition-all duration-150 flex items-center space-x-3 ${
              highlightedIndex === index
                ? 'bg-blue-50 border-l-4 border-blue-500 pl-3'
                : 'hover:bg-gray-50'
            }`}
          >
            <svg className={`w-4 h-4 transition-colors duration-200 ${
              highlightedIndex === index ? 'text-blue-500' : 'text-gray-400'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span className={`font-medium transition-colors duration-200 ${
              highlightedIndex === index ? 'text-blue-700' : 'text-gray-700'
            }`}>{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Suggestions;
