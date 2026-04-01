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
    </div>
  );
};

export default ResultItem;
