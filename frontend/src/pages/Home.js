import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import ResultsList from '../components/ResultsList';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import AISummary from '../components/AISummary';
import { searchDocuments, checkHealth } from '../services/api';

const Home = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [query, setQuery] = useState('');
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking' | 'connected' | 'disconnected'
  
  // Basic mock suggestions (could be fetched from API in full app)
  const suggestionsList = ['React', 'JavaScript', 'Machine Learning', 'Database', 'Python', 'Web Development'];

  useEffect(() => {
    const checkApi = async () => {
      try {
        await checkHealth();
        setApiStatus('connected');
      } catch {
        setApiStatus('disconnected');
      }
    };

    checkApi();
    const interval = setInterval(checkApi, 5000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen flex flex-col font-sans relative z-10">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl shadow-lg border-b border-white/30 sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.location.reload()}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300">
                SearchEngine
              </h1>
            </div>
            <div className={`flex items-center space-x-2 text-sm font-medium px-4 py-2 rounded-full border shadow-sm ${
              apiStatus === 'connected'
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                : apiStatus === 'disconnected'
                ? 'text-red-600 bg-red-50 border-red-200'
                : 'text-gray-600 bg-gray-100 border-gray-200'
            }`}>
              <div
                className={`w-2 h-2 rounded-full ${
                  apiStatus === 'connected'
                    ? 'bg-emerald-500 animate-pulse'
                    : apiStatus === 'disconnected'
                    ? 'bg-red-500'
                    : 'bg-gray-500 animate-pulse'
                }`}
              ></div>
              <span>
                {apiStatus === 'connected'
                  ? 'API Connected'
                  : apiStatus === 'disconnected'
                  ? 'API Disconnected'
                  : 'Checking API...'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        {!searchPerformed && (
          <div className="text-center mb-10 mt-20 animate-fade-in-up">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight mb-6 leading-tight">
              Find what you <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600">need.</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover documents, code snippets, and resources instantly with our lightning-fast search engine.
            </p>
          </div>
        )}

        {/* Search Bar */}
        <div className={`w-full transition-all duration-500 ease-in-out ${searchPerformed ? 'mb-8' : 'mb-24'}`}>
          <SearchBar onSearch={handleSearch} suggestionsList={suggestionsList} />
        </div>

        {/* Loading State */}
        {loading && <Loader message="Searching through documents..." />}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 w-full max-w-4xl mx-auto mt-6 shadow-md animate-fade-in-up">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-red-800">Search Error</h3>
                <p className="text-sm text-red-700 mt-2">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {!loading && !error && searchPerformed && (
          <div className="w-full max-w-4xl mx-auto animate-fade-in-up mt-4">
            <div className="mb-6 px-2">
              <p className="text-sm text-gray-600">
                Found <span className="font-bold text-gray-900 text-base">{results.length}</span> result{results.length !== 1 ? 's' : ''} for
                <span className="font-bold text-gray-900 ml-1 text-base">\"<span className="text-blue-600">{query}</span>\"</span>
              </p>
            </div>
            
            {/* AI Summary Section */}
            {results.length > 0 && <AISummary query={query} results={results} />}
            
            {/* Search Results */}
            <ResultsList results={results} />
            {/* Pagination is simplified here since backend does not support it natively yet */}
            {results.length > 0 && <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/40 backdrop-blur-md border-t border-white/30 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm font-medium">
            &copy; {new Date().getFullYear()} <span className="text-blue-600 font-semibold">SearchEngine</span>
          </p>
          <p className="text-gray-500 text-xs mt-2">Built with React, Tailwind CSS & ❤️</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
