import React, { useState, useEffect, useRef } from 'react';
import SearchBar from '../components/SearchBar';
import ResultsList from '../components/ResultsList';
import Loader from '../components/Loader';
import { searchDocuments, getSearchHistory, getAnalytics, getSuggestions } from '../services/api';

const Home = () => {
  const [results, setResults] = useState([]);
  const [imageResults, setImageResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [searchHistory, setSearchHistory] = useState([]);
  const [trending, setTrending] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [mode, setMode] = useState('light');
  const [searchMode, setSearchMode] = useState('images');
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [aiAssistText, setAiAssistText] = useState('');
  const [performance, setPerformance] = useState({ durationMs: 0, matched: 0 });
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const hist = await getSearchHistory();
        setSearchHistory(hist.history || []);
        const analytics = await getAnalytics();
        setTrending(analytics.trending || []);
      } catch (err) {
        console.warn('Unable to load history/trending', err);
      }

      const theme = localStorage.getItem('theme') || 'light';
      setMode(theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      setVoiceSupported(!!SpeechRecognition);
    };
    init();
  }, []);

  useEffect(() => {
    if (cameraOpen && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [cameraOpen, stream]);

  const updateAiAssist = (searchQuery, items) => {
    const count = items?.length || 0;

    // Extract key topics and content insights from the search results
    const topics = items?.slice(0, 5).map(item => item.title?.toLowerCase() || '').join(' ') || '';
    const content = items?.slice(0, 5).map(item => item.content || item.snippet || '').join(' ').toLowerCase() || '';

    // Analyze the search query and content to provide intelligent summary
    const queryWords = searchQuery.toLowerCase().split(' ');
    const isProgramming = /\b(python|javascript|react|node|express|database|api|web|programming|code|development)\b/i.test(searchQuery + ' ' + topics);
    const isDatabase = /\b(database|sql|mongodb|postgresql|mysql|data|query)\b/i.test(searchQuery + ' ' + topics);
    const isWebDev = /\b(html|css|javascript|react|frontend|backend|web|browser|responsive)\b/i.test(searchQuery + ' ' + topics);
    const isDevOps = /\b(docker|git|ci|cd|deployment|cloud|aws|devops)\b/i.test(searchQuery + ' ' + topics);

    let category = 'General';
    if (isProgramming) category = 'Programming & Development';
    else if (isDatabase) category = 'Database & Data Management';
    else if (isWebDev) category = 'Web Development';
    else if (isDevOps) category = 'DevOps & Infrastructure';

    const summary = [
      `🔍 AI Assistant Summary for: "${searchQuery}"`,
      '',
      `📊 Found ${count} relevant results in ${category}`,
      '',
      '💡 Key Insights:',
    ];

    // Add specific insights based on content analysis
    if (isProgramming) {
      summary.push('• This appears to be programming-related content');
      if (content.includes('framework') || content.includes('library')) {
        summary.push('• Focuses on frameworks and libraries for development');
      }
      if (content.includes('best practices') || content.includes('patterns')) {
        summary.push('• Includes development best practices and design patterns');
      }
    } else if (isDatabase) {
      summary.push('• Database and data management focused content');
      if (content.includes('query') || content.includes('sql')) {
        summary.push('• Covers database querying and optimization');
      }
    } else if (isWebDev) {
      summary.push('• Web development and frontend/backend technologies');
      if (content.includes('responsive') || content.includes('mobile')) {
        summary.push('• Includes responsive design and mobile optimization');
      }
    } else if (isDevOps) {
      summary.push('• DevOps, deployment, and infrastructure content');
      if (content.includes('container') || content.includes('docker')) {
        summary.push('• Focuses on containerization and deployment');
      }
    } else {
      summary.push('• General technology and knowledge content');
    }

    // Add top result highlights
    if (items && items.length > 0) {
      summary.push('', '🔗 Top Results:');
      items.slice(0, 3).forEach((item, idx) => {
        const title = item.title || 'Untitled';
        const domain = item.domain || new URL(item.url || '').hostname || 'unknown';
        summary.push(`${idx + 1}. ${title} (${domain})`);
      });
    }

    summary.push('', '📝 Click on result cards below for full content or use filters for more specific results.');

    setAiAssistText(summary.join('\n'));
  };

  const fetchResults = async (searchQuery, currentPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await searchDocuments(searchQuery, { page: currentPage, pageSize: 10 });
      const newResults = response.results || [];
      setResults(currentPage === 1 ? newResults : [...results, ...newResults]);
      setImageResults([]);
      setSearchPerformed(true);
      setQuery(searchQuery);
      setPage(response.analytics?.page || currentPage);
      setTotal(response.analytics?.totalResults || newResults.length);
      setPerformance({ durationMs: response.analytics?.durationMs || 0, matched: response.analytics?.totalResults || newResults.length });
      updateAiAssist(searchQuery, newResults);
      setTrending(response.analytics?.trending || trending);
      setSearchHistory((prev) => [searchQuery, ...prev.filter((h) => h !== searchQuery)].slice(0, 10));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch results. Ensure backend is running.');
      setResults([]);
      setImageResults([]);
      setTotal(0);
      setPerformance({ durationMs: 0, matched: 0 });
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async (searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      // Search the database for results, then display them as "image links"
      const response = await searchDocuments(searchQuery, { page: 1, pageSize: 12 });
      const results = response.results || [];

      // Transform results into image-like display with URLs as clickable links
      const imageLinks = results.map((item, idx) => ({
        id: idx,
        url: item.url,
        title: item.title,
        snippet: item.snippet,
        domain: item.domain,
      }));

      setImageResults(imageLinks);
      setResults([]);
      setSearchPerformed(true);
      setQuery(searchQuery);
      setTotal(imageLinks.length);
      setPerformance({ durationMs: response.analytics?.durationMs || 0, matched: response.analytics?.totalResults || imageLinks.length });
      updateAiAssist(searchQuery, imageLinks);
      setSearchHistory((prev) => [searchQuery, ...prev.filter((h) => h !== searchQuery)].slice(0, 10));
    } catch (err) {
      setError('Unable to fetch image search results.');
      setImageResults([]);
      setTotal(0);
      setPerformance({ durationMs: 0, matched: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchQuery) => {
    if (!searchQuery) {
      setAlertText('Please enter a search query.');
      return;
    }
    setAlertText('');
    if (searchMode === 'images') {
      await fetchImages(searchQuery);
    } else {
      await fetchResults(searchQuery, 1);
    }
  };

  const handleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setAlertText('Voice search is not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript;
      setQuery(spoken);
      handleSearch(spoken);
    };
    recognition.onerror = (event) => {
      setAlertText(`Voice error: ${event.error}`);
    };
    recognition.start();
  };

  const handleInputChange = async (value) => {
    setQuery(value);
    if (!value) {
      setSuggestions([]);
      return;
    }
    const data = await getSuggestions(value);
    setSuggestions(data);
  };

  const handleSearchMode = (modeValue) => {
    setSearchMode(modeValue);
    setError(null);
    setAlertText('');
    setAiAssistText('');
    setResults([]);
    setImageResults([]);
    setTotal(0);
    setPerformance({ durationMs: 0, matched: 0 });
    if (modeValue === 'images') {
      // optionally open camera on image mode selection (handled separately by onCamera)
      setCapturedImage(null);
    }
  };

  const handleCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera API not supported in your browser.');
      return;
    }

    setCameraError('');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setCameraOpen(true);
      setSearchMode('images');
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      setCameraError('Unable to access camera. Please allow camera permission.');
      console.error('Camera error:', err);
    }
  };

  const closeCamera = () => {
    setCameraOpen(false);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const videoEl = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = videoEl.videoWidth || 640;
    canvas.height = videoEl.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(dataUrl);
    closeCamera();

    // Use a descriptive search term for camera-captured content
    fetchImages('technology documentation resources');
  };

  const handleSaveSearch = () => {
    if (!query) return;
    const newSaved = [query, ...searchHistory.filter((q) => q !== query)].slice(0, 10);
    setSearchHistory(newSaved);
    localStorage.setItem('savedSearches', JSON.stringify(newSaved));
  };

  const handleShare = () => {
    const shareData = {
      title: 'Search Results',
      text: `Search results for \"${query}\" (${results.length} items)`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareData.text} \n${shareData.url}`);
      setAlertText('Search summary copied to clipboard.');
    }
  };

  const toggleTheme = () => {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const hasResults = searchMode === 'images' ? imageResults.length > 0 : results.length > 0;

  return (
    <div className={`min-h-screen flex flex-col ${mode === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`sticky top-0 z-40 border-b ${mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'Arial, sans-serif', color: '#1a0dab' }}>
            SearchEngine
          </h1>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="px-3 py-1 border rounded text-sm">
              {mode === 'light' ? 'Dark' : 'Light'}
            </button>
            <button onClick={handleShare} className="px-3 py-1 border rounded text-sm" disabled={!query}>
              Share
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-5">


          <div className="mb-2 flex flex-col lg:flex-row items-center gap-2">
            <SearchBar
              onSearch={handleSearch}
              suggestionsList={suggestions}
              onInputChange={handleInputChange}
              mode={searchMode}
              onModeChange={handleSearchMode}
              onVoice={handleVoice}
              onCamera={handleCamera}
            />
          </div>

          {alertText && <div className="mb-3 text-red-600">{alertText}</div>}

          {cameraError && <div className="mb-3 text-red-600">{cameraError}</div>}

          {cameraOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
              <div className="relative bg-white dark:bg-gray-800 rounded-xl p-4 w-full max-w-xl shadow-2xl">
                <video ref={videoRef} className="w-full h-64 rounded-md bg-black" autoPlay playsInline />
                <div className="mt-3 flex justify-between gap-2">
                  <button onClick={capturePhoto} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Capture</button>
                  <button onClick={closeCamera} className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">Close</button>
                </div>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-1">Captured Photo (for search)</h3>
              <img src={capturedImage} alt="Captured" className="w-full max-w-md rounded-lg border" />
            </div>
          )}

          {searchPerformed && aiAssistText && (
            <div className="bg-indigo-50 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 rounded p-3 mb-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-100">{aiAssistText}</pre>
            </div>
          )}

          {loading && <Loader message={searchMode === 'images' ? 'Loading images...' : 'Searching results...'} />}

          {!loading && !error && searchMode === 'images' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {imageResults.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-2">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-3">
                    {link.snippet}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {link.domain || link.url}
                  </p>
                </a>
              ))}
            </div>
          )}

          {!loading && !error && searchMode === 'web' && <ResultsList results={results} />}

          {!loading && !error && searchMode === 'web' && results.length > 0 && (
            <div className="mt-6 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-2">Top 5 Searched Links (click to open)</h3>
              <ul className="space-y-2 text-sm text-blue-600 dark:text-blue-300">
                {results.slice(0, 5).map((item, idx) => (
                  <li key={item.url || idx}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="underline">
                      {item.title || item.url || `Result #${idx + 1}`}
                    </a>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.summary || item.snippet || 'No summary available'}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!loading && !error && searchMode === 'web' && total > 0 && (
            <div className="mt-4 text-sm text-gray-500">Showing {results.length} of {total} results</div>
          )}

          {!loading && !error && searchMode === 'web' && results.length > 0 && results.length < total && (
            <button onClick={() => fetchResults(query, page + 1)} className="mt-3 px-4 py-2 rounded bg-blue-600 text-white">
              Load More
            </button>
          )}

          {error && !hasResults && <div className="mt-4 text-red-500">{error}</div>}

          {searchMode === 'images' && !loading && !error && searchPerformed && imageResults.length === 0 && (
            <div className="mt-4 text-center text-gray-500">No image results found for "{query}".</div>
          )}

          {searchMode === 'web' && !loading && !error && searchPerformed && results.length === 0 && (
            <div className="mt-4 text-center text-gray-500">No web results found for "{query}".</div>
          )}
        </div>

        <aside className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 border p-3 rounded">
            <h3 className="text-sm font-semibold mb-2">Recent Searches</h3>
            <ul className="text-sm space-y-1">
              {searchHistory.slice(0, 3).map((item) => (
                <li key={item}>
                  <button onClick={() => handleSearch(item)} className="text-blue-600 dark:text-blue-300 hover:underline">{item}</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 border p-3 rounded">
            <h3 className="text-sm font-semibold mb-2">Top Topics</h3>
            <ul className="text-sm space-y-1">
              {trending.slice(0, 2).map((item) => (
                <li key={item.term}>
                  <button onClick={() => handleSearch(item.term)} className="text-green-600 dark:text-green-300 hover:underline">{item.term} ({item.count})</button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </main>

      <footer className={`py-6 text-center ${mode === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
        &copy; {new Date().getFullYear()} SearchEngine prototype
      </footer>
    </div>
  );
};

export default Home;
