import React, { useState } from 'react';

const ResultItem = ({ result }) => {
  const [isHovered, setIsHovered] = useState(false);

  const truncateUrl = (url, maxLength = 60) => {
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
  };

  return (
    <div
      className="bg-white/70 backdrop-blur-sm rounded-xl shadow-md border border-white/50 hover:shadow-xl hover:border-blue-200 transition-all duration-300 p-6 mb-4 cursor-pointer transform hover:-translate-y-0.5 group overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative">
          <h3 className={`text-xl font-bold transition-colors duration-300 mb-2 ${
            isHovered ? 'text-blue-700' : 'text-blue-600'
          }`}>
            {result.title}
          </h3>
          {isHovered && (
            <div className="absolute top-0 right-0 flex items-center space-x-1 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-4-6l6 6m0 0l-6 6m6-6H3" />
              </svg>
            </div>
          )}
        </div>
        <p className={`text-sm font-medium truncate mb-3 transition-colors duration-300 ${
          isHovered ? 'text-green-700' : 'text-green-600'
        }`}>
          {truncateUrl(result.url)}
        </p>
        {result.snippet && (
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {result.snippet}
          </p>
        )}
      </a>
      {isHovered && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Click to open</span>
        </div>
      )}
    </div>
  );
};

export default ResultItem;
