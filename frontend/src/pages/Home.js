import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import ResultsList from '../components/ResultsList';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import { searchDocuments } from '../services/api';

const Home = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [query, setQuery] = useState('');
  
  // Basic mock suggestions (could be fetched from API in full app)
  const suggestionsList = ['React', 'JavaScript', 'Machine Learning', 'Database', 'Python', 'Web Development'];

  const handleSearch = async (searchQuery) => {
    if (!searchQuery) return;
    
    setLoading(true);
    setError(null);
    setSearchPerformed(true);
    setQuery(searchQuery);

    try {
      const data = await searchDocuments(searchQuery);
      setResults(data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch results. Ensure backend is running.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight cursor-pointer" onClick={() => window.location.reload()}>
              SearchEngine
            </h1>
            <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
               API Connected
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center pt-12 pb-20 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        {!searchPerformed && (
           <div className="text-center mb-10 mt-20">
             <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
                Find what you need.
             </h2>
             <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                Discover documents, code snippets, and resources with our lightning-fast search API.
             </p>
           </div>
        )}

        <div className={`w-full transition-all duration-500 ease-in-out ${searchPerformed ? 'mb-8' : 'mb-24 scale-105'}`}>
          <SearchBar onSearch={handleSearch} suggestionsList={suggestionsList} />
        </div>

        {loading && <Loader message="Searching documents..." />}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md w-full max-w-4xl mx-auto mt-6 shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Search Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && searchPerformed && (
          <div className="w-full max-w-4xl w-full mx-auto animate-fade-in-up mt-4">
             <div className="text-sm text-gray-500 mb-4 px-2">
                Showing results for <span className="font-semibold text-gray-900">"{query}"</span>
             </div>
             <ResultsList results={results} />
             {/* Pagination is simplified here since backend does not support it natively yet */}
             {results.length > 0 && <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Search Engine Application. React + Tailwind CSS.
        </div>
      </footer>
    </div>
  );
};

export default Home;
