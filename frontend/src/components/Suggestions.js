import React, { useState, useEffect, useRef } from 'react';

const Suggestions = ({ suggestions, onSelect, visible }) => {
  if (!visible || !suggestions || suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50">
      <ul className="py-2">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            onClick={() => onSelect(suggestion)}
            className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-gray-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span className="font-medium">{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Suggestions;
