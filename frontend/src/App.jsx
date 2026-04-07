import React, { useState } from 'react';
import MapComponent from './components/MapComponent';
import ControlPanel from './components/ControlPanel';
import RankingPanel from './components/RankingPanel';
import AreaInsightsPanel from './components/AreaInsightsPanel';
import MapInsightPanel from './components/MapInsightPanel';
import { getRecommendations, getMapInsight } from './api';

function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [mapInsight, setMapInsight] = useState(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setSelectedCity(null);
    setSelectedArea(null);
    setMapInsight(null);
    setCurrentQuery(query);
    setShowWelcome(false); // Dismiss welcome on first search
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
    setShowWelcome(false); // Dismiss welcome on first map click
    
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
    <div className="flex flex-col h-screen bg-emerald-50/60 text-slate-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-rose-600 shadow-lg z-10 border-b border-white/20">
        <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center">
               Geo Market Match <span className="ml-2 text-xs sm:text-sm font-medium text-emerald-50 bg-white/20 px-3 py-1 rounded-full">AI-Powered Location Intelligence</span>
            </h1>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <div className="bg-white/20 text-white px-3 py-1 rounded-full">Results: {recommendations.length}</div>
              {selectedCity && <div className="bg-white/20 text-white px-3 py-1 rounded-full">City: {selectedCity.city}</div>}
              {selectedArea && <div className="bg-white/20 text-white px-3 py-1 rounded-full">Area: {selectedArea.area_name}</div>}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col lg:flex-row overflow-hidden gap-4 p-3 sm:p-4">
        
        {/* Sidebar */}
        <div className="w-full lg:w-96 lg:flex-shrink-0 p-4 overflow-y-auto border border-emerald-100 bg-white/90 backdrop-blur rounded-2xl shadow-sm">
           <ControlPanel onSearch={handleSearch} loading={loading} />
           
           {error && (
             <div className="bg-rose-50 border border-rose-300 text-rose-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
             </div>
           )}

           {recommendations.length > 0 && (
              <>
               <RankingPanel 
                  data={recommendations} 
                  selectedCity={selectedCity} 
                  onCitySelect={handleCitySelect} 
               />
               
               {selectedCity && (
                   <div className="mt-4 bg-gradient-to-br from-emerald-50 to-rose-50 p-4 rounded-xl shadow border border-emerald-200">
                       <h3 className="font-bold text-emerald-900 border-b border-emerald-300 pb-2 mb-2">
                         Market Analysis: {selectedCity.city}
                       </h3>
                       <p className="text-sm text-gray-700">{selectedCity.reason}</p>
                       {selectedCity.areas && selectedCity.areas.length > 0 && (
                         <div className="mt-2 pt-2 border-t border-emerald-200">
                           <p className="text-xs font-semibold text-rose-700">
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
                 />
               )}
              </>
           )}
        </div>

        {/* Map Area */}
          <div className="flex-grow relative rounded-2xl overflow-hidden border border-emerald-100 shadow-sm min-h-[320px] lg:min-h-0">
           <MapComponent 
              data={recommendations} 
              selectedCity={selectedCity} 
              selectedArea={selectedArea}
              onCitySelect={handleCitySelect}
              onMapClick={handleMapClick}
           />
           
           {/* Welcome Guide - Shows when no search has been made */}
           {showWelcome && recommendations.length === 0 && !loading && (
                 <div className="absolute inset-0 flex items-center justify-center bg-emerald-950/10 z-[999]">
                   <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-4 border-4 border-emerald-500 relative">
                       {/* Close Button */}
                       <button 
                           onClick={() => setShowWelcome(false)}
                             className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-rose-50 transition-colors"
                           title="Close welcome screen"
                       >
                           ×
                       </button>
                       
                       <div className="text-center">
                           <div className="text-5xl mb-4 font-bold text-emerald-600">GEO MARKET MATCH</div>
                           <h2 className="text-2xl font-semibold text-gray-700 mb-3">AI-Powered Location Intelligence</h2>
                           <p className="text-gray-600 mb-6 text-lg">AI-powered business location intelligence</p>
                           
                           <div className="grid md:grid-cols-2 gap-4 mb-6 text-left">
                                 <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-5 rounded-xl border-2 border-emerald-200">
                                   <div className="text-2xl mb-2 font-bold text-emerald-600">1</div>
                                   <h3 className="font-bold text-emerald-900 mb-2">Search with AI</h3>
                                   <p className="text-sm text-gray-700">Ask questions like:</p>
                                   <ul className="text-xs text-gray-600 mt-2 space-y-1">
                                       <li>• "Best areas for cafe in Islamabad"</li>
                                       <li>• "Where to open restaurant in Dubai"</li>
                                       <li>• "Tech startup opportunities in Berlin"</li>
                                   </ul>
                               </div>
                               
                                 <div className="bg-gradient-to-br from-rose-50 to-red-50 p-5 rounded-xl border-2 border-rose-200">
                                   <div className="text-2xl mb-2 font-bold text-rose-600">2</div>
                                   <h3 className="font-bold text-rose-900 mb-2">Click on Map</h3>
                                   <p className="text-sm text-gray-700">Explore any location:</p>
                                   <ul className="text-xs text-gray-600 mt-2 space-y-1">
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
                               onClick={() => setShowWelcome(false)}
                                 className="bg-gradient-to-r from-emerald-600 to-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-rose-700 transition-all shadow-lg"
                           >
                               Got it! Start Exploring →
                           </button>
                       </div>
                   </div>
               </div>
           )}
           {loading && (
                 <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-[1000]">
                   <div className="text-center">
                     <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                       <p className="text-gray-600 font-medium">AI is analyzing your query...</p>
                   </div>
               </div>
           )}
        </div>

        {/* Map Click Insight Panel */}
        {mapInsight && (
          <MapInsightPanel 
            insight={mapInsight} 
            onClose={() => setMapInsight(null)}
          />
        )}

      </main>
    </div>
  );
}

export default App;
