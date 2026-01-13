import React, { useState } from 'react';

const ControlPanel = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [queryType, setQueryType] = useState('business'); // 'business' or 'general'

  const businessCategories = [
    'Restaurant', 'Coffee Shop', 'Gym/Fitness Center', 'Retail Store', 
    'Hotel', 'Co-working Space', 'Bakery', 'Tech Startup', 
    'Beauty Salon', 'Bookstore', 'Pharmacy', 'Other'
  ];

  const exampleQueries = {
    business: [
      'Which business to open in Islamabad?',
      'Best location for coffee shop in Dubai',
      'Where to open restaurant in Toronto?',
      'Tech startup opportunities in Singapore',
      'Retail store locations in Berlin',
    ],
    general: [
      'Tell me about business opportunities in New York',
      'Economic conditions in Tokyo',
      'Market analysis for London',
    ]
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const fullQuery = businessType && queryType === 'business' 
        ? `${businessType}: ${query}` 
        : query;
      onSearch(fullQuery);
    }
  };

  const handleExampleClick = (example) => {
    setQuery(example);
    onSearch(example);
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          AI Business Intelligence
        </h2>
        <p className="text-sm text-indigo-100 mb-4">
          Get data-driven insights for any location and business type worldwide
        </p>
        
        {/* How to Use Guide */}
        <div className="bg-white bg-opacity-20 rounded-lg p-3 mt-3 backdrop-blur-sm">
          <div className="text-xs font-semibold mb-2 text-white">
            How to Use:
          </div>
          <div className="space-y-1.5 text-xs text-indigo-50">
            <div className="flex items-start gap-2">
              <span className="bg-white text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs flex-shrink-0">1</span>
              <span>Type your question below (e.g., "Best areas for cafe in Islamabad")</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-white text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs flex-shrink-0">2</span>
              <span>View recommended cities and neighborhoods on the map</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-white text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs flex-shrink-0">3</span>
              <span>Click any map location for detailed local insights</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Query Type Selection */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setQueryType('business')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${ 
              queryType === 'business'
                ? 'bg-white text-indigo-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Business Query
          </button>
          <button
            onClick={() => setQueryType('general')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              queryType === 'general'
                ? 'bg-white text-indigo-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            General Info
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Business Type Selection (only for business queries) */}
          {queryType === 'business' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Type (Optional)
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              >
                <option value="">Select a business type...</option>
                {businessCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Query Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Query
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                queryType === 'business'
                  ? "e.g., Which business to open in Islamabad? Best locations for coffee shop in Dubai..."
                  : "e.g., Tell me about business opportunities in New York..."
              }
              rows={4}
              className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className={`w-full flex justify-center items-center gap-2 py-4 px-6 rounded-xl shadow-lg text-base font-semibold text-white transition-all transform ${
              loading || !query.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                AI is analyzing...
              </>
            ) : (
              <>
                <span className="text-xl">✨</span>
                Get AI Recommendations
              </>
            )}
          </button>
        </form>

        {/* Example Queries */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>💡</span> Try these examples:
          </p>
          <div className="space-y-2">
            {exampleQueries[queryType].map((example, idx) => (
              <button
                key={idx}
                onClick={() => handleExampleClick(example)}
                disabled={loading}
                className="w-full text-left text-sm px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-purple-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-all text-gray-700 hover:text-indigo-700 disabled:opacity-50 hover:shadow-md"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>

        {/* Pro Tip */}
        <div className="p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border-2 border-indigo-200">
          <p className="text-sm text-indigo-900">
            <span className="font-bold text-base">💡 Pro Tip:</span> Click anywhere on the map to get instant location-specific insights!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;

