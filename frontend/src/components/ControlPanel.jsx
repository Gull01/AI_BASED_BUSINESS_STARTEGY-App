import React, { useState } from 'react';

const ControlPanel = ({ onSearch, loading, isDark }) => {
  const [query, setQuery] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [queryType, setQueryType] = useState('business'); // 'business' or 'general'
  const [showHowTo, setShowHowTo] = useState(false);

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
    <div className={`${isDark ? 'bg-slate-900 border-slate-700' : 'bg-gradient-to-br from-white via-emerald-50 to-lime-50 border-emerald-200'} rounded-2xl shadow-xl border overflow-hidden`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-rose-600 p-6 text-white">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h2 className="text-2xl font-bold">
            AI Business Intelligence
          </h2>
          <button
            onClick={() => setShowHowTo((prev) => !prev)}
            className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-black text-sm transition-colors"
            title="Toggle quick help"
            aria-label="Toggle quick help"
          >
            ?
          </button>
        </div>
        <p className="text-sm text-emerald-50 mb-4">
          Get data-driven insights for any location and business type worldwide
        </p>

        {/* Compact How to Use Guide */}
        {showHowTo && (
          <div className="bg-white/20 rounded-lg p-3 mt-3 backdrop-blur-sm relative">
            <button
              onClick={() => setShowHowTo(false)}
              className="absolute top-2 right-2 text-white/80 hover:text-white text-base leading-none"
              title="Close quick help"
              aria-label="Close quick help"
            >
              ×
            </button>
            <div className="text-xs font-semibold mb-2 text-white">
              How to Use:
            </div>
            <div className="space-y-1.5 text-xs text-emerald-50 pr-5">
              <div className="flex items-start gap-2">
                <span className="bg-white text-emerald-700 rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs flex-shrink-0">1</span>
                <span>Type your question below</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-white text-emerald-700 rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs flex-shrink-0">2</span>
                <span>See city and neighborhood recommendations</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-white text-rose-700 rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs flex-shrink-0">3</span>
                <span>Click map for local AI insights</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Query Type Selection */}
        <div className={`flex gap-2 p-1 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-emerald-100 border-emerald-200'}`}>
          <button
            onClick={() => setQueryType('business')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${ 
              queryType === 'business'
                ? isDark ? 'bg-slate-700 text-emerald-300 shadow-sm border border-slate-600' : 'bg-white text-emerald-700 shadow-sm border border-emerald-300'
                : isDark ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Business Query
          </button>
          <button
            onClick={() => setQueryType('general')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              queryType === 'general'
                ? isDark ? 'bg-slate-700 text-rose-300 shadow-sm border border-slate-600' : 'bg-white text-rose-700 shadow-sm border border-rose-200'
                : isDark ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            General Info
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Business Type Selection (only for business queries) */}
          {queryType === 'business' && (
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>
                Business Type (Optional)
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className={`w-full px-4 py-3 text-base border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${isDark ? 'border-slate-600 bg-slate-800 text-slate-100' : 'border-emerald-300 bg-white'}`}
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
            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>
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
              className={`w-full px-4 py-3 text-base border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-all ${isDark ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-400' : 'border-emerald-300 bg-white text-slate-900'}`}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className={`w-full flex justify-center items-center gap-2 py-4 px-6 rounded-xl shadow-lg text-base font-semibold text-white transition-all transform ${
              loading || !query.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-rose-600 hover:from-emerald-700 hover:to-rose-700 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
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
        <div className={`pt-4 border-t ${isDark ? 'border-slate-700' : 'border-emerald-200'}`}>
          <p className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>
            <span>💡</span> Try these examples:
          </p>
          <div className="space-y-2">
            {exampleQueries[queryType].map((example, idx) => (
              <button
                key={idx}
                onClick={() => handleExampleClick(example)}
                disabled={loading}
                className={`w-full text-left text-sm px-4 py-3 rounded-lg border transition-all disabled:opacity-50 hover:shadow-md ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:border-emerald-400 hover:text-emerald-300' : 'bg-gradient-to-r from-white to-emerald-50 hover:from-emerald-50 hover:to-lime-100 border-emerald-200 hover:border-emerald-400 text-gray-700 hover:text-emerald-800'}`}
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>

        {/* Pro Tip */}
        <div className={`p-4 rounded-xl border-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-r from-emerald-100 to-lime-100 border-emerald-300'}`}>
          <p className={`text-sm ${isDark ? 'text-emerald-200' : 'text-emerald-900'}`}>
            <span className="font-bold text-base">💡 Pro Tip:</span> Click anywhere on the map to get instant location-specific insights!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;

