import React, { useState, useEffect } from 'react';

const AISummary = ({ query, results }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (results && results.length > 0) {
      generateSummary();
    } else {
      setLoading(false);
    }
  }, [query, results]);

  const generateSummary = async () => {
    setLoading(true);
    try {
      // Simulate AI summary generation from search results
      const summaryText = generateFromResults();
      
      // Simulate a slight delay for better UX
      setTimeout(() => {
        setSummary(summaryText);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error generating summary:', error);
      setLoading(false);
    }
  };

  const generateFromResults = () => {
    if (!results || results.length === 0) return '';

    // Extract content from top results
    const topResults = results.slice(0, 3);
    const titles = topResults.map(r => r.title).join(', ');

    // Generate a meaningful summary
    const summaries = [
      `Based on search results for "${query}", the top resources include ${titles}. These sources provide comprehensive information about the topic.`,
      `Your search for "${query}" returned multiple relevant resources. Key sources include ${titles}, which contain detailed information and insights about the subject.`,
      `The search results for "${query}" highlight several important sources: ${titles}. These documents provide valuable perspectives and detailed coverage of the topic.`,
      `Searching for "${query}" yields important resources including ${titles}. These sources collectively offer a thorough understanding of the subject matter.`,
      `For "${query}", the most relevant results are ${titles}. These resources provide complementary information and perspectives on the topic.`,
    ];

    return summaries[Math.floor(Math.random() * summaries.length)];
  };

  if (!summary && !loading) return null;

  return (
    <div className='w-full max-w-4xl mx-auto mb-8 animate-fade-in-up'>
      <div className='bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
        {/* Header */}
        <div className='flex items-start justify-between mb-4'>
          <div className='flex items-center space-x-3'>
            <div className='flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md'>
              <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z' />
              </svg>
            </div>
            <div>
              <h3 className='text-lg font-bold text-gray-900'>AI Summary</h3>
              <p className='text-xs text-gray-600 mt-0.5'>Quick overview of your search</p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className='p-2 hover:bg-white/50 rounded-lg transition-all duration-300 text-gray-600 hover:text-gray-900'
          >
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
            </svg>
          </button>
        </div>

        {/* Content */}
        {expanded && (
          <div className='space-y-4'>
            {loading ? (
              <div className='space-y-3'>
                {/* Skeleton Loading */}
                <div className='space-y-2'>
                  <div className='h-3 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full w-full animate-pulse'></div>
                  <div className='h-3 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full w-5/6 animate-pulse'></div>
                  <div className='h-3 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full w-4/6 animate-pulse'></div>
                </div>
              </div>
            ) : (
              <>
                <p className='text-gray-700 leading-relaxed text-base font-medium'>
                  {summary}
                </p>
                
                {/* Key Points */}
                {results && results.length > 0 && (
                  <div className='mt-6 pt-4 border-t border-blue-200'>
                    <h4 className='text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2'>
                      <span className='text-blue-600'>✨</span>
                      <span>Key Sources</span>
                    </h4>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                      {results.slice(0, 4).map((result, index) => (
                        <div
                          key={index}
                          className='flex items-start space-x-2 p-3 bg-white/50 rounded-lg hover:bg-white/80 transition-all duration-200 cursor-pointer group'
                        >
                          <span className='text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full mt-0.5 group-hover:bg-blue-200 transition-colors'>
                            {index + 1}
                          </span>
                          <div className='flex-1 min-w-0'>
                            <p className='text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors'>
                              {result.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AISummary;
