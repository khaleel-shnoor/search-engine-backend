import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center space-x-3 mt-10 py-8 px-4 animate-fade-in-up bg-white/40 backdrop-blur-sm rounded-xl border border-white/30">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
            : 'btn-secondary hover:border-blue-400'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Previous</span>
      </button>

      <div className="flex items-center space-x-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-all duration-200 ${
              currentPage === page
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 shadow-sm'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
            : 'btn-secondary hover:border-blue-400'
        }`}
      >
        <span>Next</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
