import React from 'react';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 opacity-80">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 font-medium">{message}</p>
    </div>
  );
};

export default Loader;
