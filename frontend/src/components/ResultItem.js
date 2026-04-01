import React from 'react';

const ResultItem = ({ result }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6 mb-4 transform hover:-translate-y-1 duration-200">
      <a
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <h3 className="text-xl font-semibold text-blue-600 group-hover:text-blue-800 group-hover:underline mb-1">
          {result.title}
        </h3>
        <p className="text-sm text-green-700 font-medium truncate mb-2">
          {result.url}
        </p>
      </a>

      <div className="text-xs text-gray-500 mb-2">
        <span className="mr-2">Category: <strong>{result.category || 'General'}</strong></span>
        <span className="mr-2">Domain: <strong>{result.domain || 'N/A'}</strong></span>
        <span>Length: <strong>{result.content_length || result.content?.length || 0}</strong></span>
      </div>

      <p className="text-sm text-gray-700 mb-2">{result.snippet}</p>
      <p className="text-xs text-gray-400 italic">{result.summary}</p>
    </div>
  );
};

export default ResultItem;
