import React from 'react';
import ResultItem from './ResultItem';

const ResultsList = ({ results }) => {
  if (!results || results.length === 0) {
    return (
        <div className="text-center py-10 opacity-70">
            <p className="text-lg text-gray-500">No results found for your search.</p>
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
