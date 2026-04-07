import React from 'react';

const MapInsightPanel = ({ insight, onClose }) => {
  if (!insight) return null;

  const getScoreColor = (score) => {
    if (score >= 0.7) return 'text-emerald-700 bg-emerald-100';
    return 'text-rose-700 bg-rose-100';
  };

  const getScoreBgColor = (score) => {
    if (score >= 0.7) return 'bg-emerald-500';
    return 'bg-rose-500';
  };

  return (
    <div className="fixed bottom-6 right-6 w-[450px] bg-white rounded-2xl shadow-2xl border border-emerald-100 z-[1001] animate-slideIn overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-700 to-rose-600 text-white p-5 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">{insight.location_name}</h3>
          <p className="text-xs text-emerald-50">Location Insights</p>
        </div>
        <button 
          onClick={onClose}
          className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Score Display */}
        <div className="bg-gradient-to-br from-emerald-50 to-rose-50 rounded-xl p-4 border-2 border-emerald-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-gray-700">Suitability Score</span>
            <div className={`px-4 py-2 rounded-full font-bold text-lg ${getScoreColor(insight.recommendation_score)}`}>
              {(insight.recommendation_score * 100).toFixed(0)}/100
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
            <div 
              className={`h-full ${getScoreBgColor(insight.recommendation_score)} transition-all duration-500 rounded-full`}
              style={{ width: `${insight.recommendation_score * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-lg">
          <h4 className="font-bold text-sm text-emerald-900 mb-2 flex items-center gap-2">
            <span>💡</span> Key Insights
          </h4>
          <p className="text-sm text-gray-800 leading-relaxed">{insight.insights}</p>
        </div>

        {/* Financial Estimates */}
        {(insight.estimated_monthly_revenue || insight.estimated_startup_cost) && (
          <div className="grid grid-cols-2 gap-3">
            {insight.estimated_monthly_revenue && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <p className="text-xs text-green-700 font-semibold mb-1">Est. Monthly Revenue</p>
                <p className="text-sm font-bold text-green-900">{insight.estimated_monthly_revenue}</p>
              </div>
            )}
            {insight.estimated_startup_cost && (
              <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-4">
                <p className="text-xs text-rose-700 font-semibold mb-1">Est. Startup Cost</p>
                <p className="text-sm font-bold text-rose-900">{insight.estimated_startup_cost}</p>
              </div>
            )}
          </div>
        )}

        {/* Target Customers */}
        {insight.target_customers && (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
            <h4 className="font-bold text-sm text-emerald-900 mb-2">
              Target Customers
            </h4>
            <p className="text-sm text-gray-800">{insight.target_customers}</p>
          </div>
        )}

        {/* Opportunities */}
        {insight.opportunities && insight.opportunities.length > 0 && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <h4 className="font-bold text-sm text-green-900 mb-3 flex items-center gap-2">
              <span>✅</span> Opportunities
            </h4>
            <ul className="space-y-2">
              {insight.opportunities.map((opp, idx) => (
                <li key={idx} className="text-sm text-gray-800 flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">→</span>
                  <span>{opp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Challenges */}
        {insight.challenges && insight.challenges.length > 0 && (
          <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-4">
            <h4 className="font-bold text-sm text-rose-900 mb-3 flex items-center gap-2">
              <span>⚠️</span> Challenges
            </h4>
            <ul className="space-y-2">
              {insight.challenges.map((chal, idx) => (
                <li key={idx} className="text-sm text-gray-800 flex items-start gap-2">
                  <span className="text-rose-600 font-bold mt-0.5">→</span>
                  <span>{chal}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapInsightPanel;
