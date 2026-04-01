import React from 'react';
import ResultItem from './ResultItem';

const ResultsList = ({ results }) => {
  if (!results || results.length === 0) {
    return (
        <div className="text-center py-16 opacity-70 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-lg text-gray-600 font-medium">No results found for your search.</p>
            <p className="text-sm text-gray-500 mt-2">Try using different keywords or adjust your search terms.</p>
        </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      {results.map((result, index) => (
        <ResultItem key={result.url || index} result={result} />
      ))}
    </div>
  );
};

export default ResultsList;
