import React, { useEffect, useState } from 'react';
import MapComponent from './components/MapComponent';
import ControlPanel from './components/ControlPanel';
import RankingPanel from './components/RankingPanel';
import AreaInsightsPanel from './components/AreaInsightsPanel';
import MapInsightPanel from './components/MapInsightPanel';
import { getRecommendations, getMapInsight } from './api';

function App() {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('geo-theme');
    return savedTheme === 'dark';
  });
  const [recommendations, setRecommendations] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [mapInsight, setMapInsight] = useState(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem('geo-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setSelectedCity(null);
    setSelectedArea(null);
    setMapInsight(null);
    setCurrentQuery(query);
    setShowHelpPanel(false);
    try {
      const data = await getRecommendations(query);
      setRecommendations(data.recommendations);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch recommendations. Please ensure the API is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSelectedArea(null);
    setMapInsight(null);
  };

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
  };

  const handleMapClick = async (lat, lng) => {
    setShowHelpPanel(false);
    
    // Use a generic business query if none specified
    const businessQuery = currentQuery || "general business opportunities";

    setMapInsight({
      location_name: "Analyzing...",
      insights: "AI is analyzing this location...",
      opportunities: [],
      challenges: [],
      recommendation_score: 0
    });

    try {
      const insight = await getMapInsight(lat, lng, businessQuery);
      setMapInsight(insight);
    } catch (err) {
      console.error(err);
      setMapInsight({
        location_name: "Error",
        insights: "Unable to analyze this location. Please try again.",
        opportunities: [],
        challenges: [],
        recommendation_score: 0
      });
    }
  };

  return (
    <div className={`flex flex-col h-screen ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-emerald-100 text-slate-900'}`}>
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-rose-600 shadow-lg z-10 border-b border-white/20">
        <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center">
               Geo Market Match <span className="ml-2 text-xs sm:text-sm font-medium text-emerald-50 bg-white/20 px-3 py-1 rounded-full">AI-Powered Location Intelligence</span>
            </h1>
            <div className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
              <button
                onClick={() => setShowHelpPanel(true)}
                className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-black text-base transition-colors"
                title="Open help"
                aria-label="Open help"
              >
                ?
              </button>
              <button
                onClick={() => setIsDark((prev) => !prev)}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full font-semibold transition-colors"
                title="Toggle dark mode"
              >
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </button>
              <div className="bg-white/20 text-white px-3 py-1 rounded-full">Results: {recommendations.length}</div>
              {selectedCity && <div className="bg-white/20 text-white px-3 py-1 rounded-full">City: {selectedCity.city}</div>}
              {selectedArea && <div className="bg-white/20 text-white px-3 py-1 rounded-full">Area: {selectedArea.area_name}</div>}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-grow flex flex-col lg:flex-row overflow-hidden ${isSidebarOpen ? 'gap-4 p-3 sm:p-4' : 'gap-0 p-0'}`}>

        {/* Map Area */}
        <div className={`flex-grow relative overflow-hidden min-h-[320px] lg:min-h-0 ${isSidebarOpen ? `rounded-2xl border shadow-sm ${isDark ? 'border-slate-700' : 'border-emerald-200'}` : 'rounded-none border-0 shadow-none'}`}>
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className={`absolute top-4 right-4 z-[1002] h-9 w-9 rounded-full border shadow-md transition-colors ${isDark ? 'bg-slate-900/90 border-slate-600 text-slate-100 hover:bg-slate-800' : 'bg-white/95 border-emerald-200 text-emerald-700 hover:bg-emerald-50'}`}
            title={isSidebarOpen ? 'Collapse panel' : 'Expand panel'}
            aria-label={isSidebarOpen ? 'Collapse panel' : 'Expand panel'}
          >
            {isSidebarOpen ? '→' : '←'}
          </button>
          <MapComponent 
            data={recommendations} 
            selectedCity={selectedCity} 
            selectedArea={selectedArea}
            onCitySelect={handleCitySelect}
            onMapClick={handleMapClick}
            isDark={isDark}
            isSidebarOpen={isSidebarOpen}
          />

          {/* Help Guide */}
          {showHelpPanel && (
            <div className={`absolute inset-0 flex items-center justify-center z-[999] ${isDark ? 'bg-slate-950/70' : 'bg-emerald-950/10'}`}>
              <div className={`${isDark ? 'bg-slate-900 border-emerald-400' : 'bg-white border-emerald-500'} rounded-2xl shadow-2xl p-8 max-w-2xl mx-4 border-4 relative`}>
                  {/* Close Button */}
                  <button 
                      onClick={() => setShowHelpPanel(false)}
                        className={`absolute top-4 right-4 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isDark ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800' : 'text-gray-400 hover:text-gray-600 hover:bg-rose-50'}`}
                      title="Close welcome screen"
                  >
                      ×
                  </button>
                  
                  <div className="text-center">
                      <div className="text-5xl mb-4 font-bold text-emerald-500">GEO MARKET MATCH</div>
                      <h2 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-slate-100' : 'text-gray-700'}`}>AI-Powered Location Intelligence</h2>
                      <p className={`${isDark ? 'text-slate-300' : 'text-gray-600'} mb-6 text-lg`}>AI-powered business location intelligence</p>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-6 text-left">
                            <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-5 rounded-xl border-2 border-emerald-200">
                              <div className="text-2xl mb-2 font-bold text-emerald-600">1</div>
                              <h3 className="font-bold text-emerald-900 mb-2">Search with AI</h3>
                              <p className={`text-sm ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>Ask questions like:</p>
                              <ul className={`text-xs mt-2 space-y-1 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                                  <li>• "Best areas for cafe in Islamabad"</li>
                                  <li>• "Where to open restaurant in Dubai"</li>
                                  <li>• "Tech startup opportunities in Berlin"</li>
                              </ul>
                          </div>
                          
                            <div className="bg-gradient-to-br from-rose-50 to-red-50 p-5 rounded-xl border-2 border-rose-200">
                              <div className="text-2xl mb-2 font-bold text-rose-600">2</div>
                              <h3 className="font-bold text-rose-900 mb-2">Click on Map</h3>
                              <p className={`text-sm ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>Explore any location:</p>
                              <ul className={`text-xs mt-2 space-y-1 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                                  <li>• Click anywhere on the map</li>
                                  <li>• Get instant AI insights</li>
                                  <li>• See opportunities & challenges</li>
                              </ul>
                          </div>
                      </div>
                      
                        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4 mb-4">
                          <p className="text-sm text-emerald-800 font-medium"><span className="font-bold">Tip:</span> Search first to set your business type, then click the map for location-specific insights</p>
                      </div>
                      
                      <button 
                          onClick={() => setShowHelpPanel(false)}
                            className="bg-gradient-to-r from-emerald-600 to-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-rose-700 transition-all shadow-lg"
                      >
                          Got it! Start Exploring →
                      </button>
                  </div>
              </div>
          </div>
      )}
      {loading && (
            <div className={`absolute inset-0 flex items-center justify-center z-[1000] ${isDark ? 'bg-slate-950/70' : 'bg-white/80'}`}>
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                  <p className={`${isDark ? 'text-slate-200' : 'text-gray-600'} font-medium`}>AI is analyzing your query...</p>
              </div>
          </div>
      )}
        </div>

        {/* Sidebar */}
        {isSidebarOpen && (
          <div className={`w-full lg:w-96 lg:flex-shrink-0 p-4 overflow-y-auto border rounded-2xl shadow-sm ${isDark ? 'border-slate-700 bg-slate-900/90' : 'border-emerald-200 bg-white/95'}`}>
            <ControlPanel onSearch={handleSearch} loading={loading} isDark={isDark} />
           
           {error && (
             <div className={`${isDark ? 'bg-rose-900/40 border-rose-700 text-rose-200' : 'bg-rose-50 border-rose-300 text-rose-700'} border px-4 py-3 rounded relative mb-4`} role="alert">
                <span className="block sm:inline">{error}</span>
             </div>
           )}

           {recommendations.length > 0 && (
              <>
               <RankingPanel 
                  data={recommendations} 
                  selectedCity={selectedCity} 
                  onCitySelect={handleCitySelect}
                  isDark={isDark}
               />
               
               {selectedCity && (
                   <div className={`mt-4 p-4 rounded-xl shadow border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-emerald-50/70 border-emerald-200'}`}>
                       <h3 className={`font-bold border-b pb-2 mb-2 ${isDark ? 'text-emerald-300 border-slate-600' : 'text-emerald-900 border-emerald-300'}`}>
                         Market Analysis: {selectedCity.city}
                       </h3>
                       <p className={`text-sm ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>{selectedCity.reason}</p>
                       {selectedCity.areas && selectedCity.areas.length > 0 && (
                         <div className={`mt-2 pt-2 border-t ${isDark ? 'border-slate-600' : 'border-emerald-200'}`}>
                           <p className={`text-xs font-semibold ${isDark ? 'text-rose-300' : 'text-rose-700'}`}>
                             {selectedCity.areas.length} strategic areas identified
                           </p>
                         </div>
                       )}
                   </div>
               )}

               {selectedCity && (
                 <AreaInsightsPanel
                   city={selectedCity}
                   selectedArea={selectedArea}
                   onAreaSelect={handleAreaSelect}
                   isDark={isDark}
                 />
               )}
              </>
           )}
        </div>
        )}

        {/* Map Click Insight Panel */}
        {mapInsight && (
          <MapInsightPanel 
            insight={mapInsight} 
            onClose={() => setMapInsight(null)}
            isDark={isDark}
          />
        )}

      </main>
    </div>
  );
}

export default App;
