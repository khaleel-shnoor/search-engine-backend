import React from 'react';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in-up">
      <div className="relative w-16 h-16 mb-6">
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin"></div>
        {/* Inner ring */}
        <div className="absolute inset-2 border-4 border-transparent border-b-blue-300 rounded-full animate-spin" style={{
          animationDirection: 'reverse',
          animationDuration: '1.5s'
        }}></div>
        {/* Center dot */}
        <div className="absolute inset-6 bg-blue-500 rounded-full animate-pulse"></div>
      </div>
      <p className="text-gray-600 font-medium text-lg text-center max-w-xs">{message}</p>
      <div className="mt-4 flex space-x-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

export default Loader;
