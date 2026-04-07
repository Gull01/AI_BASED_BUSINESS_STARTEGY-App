import React from 'react';

const MapInsightPanel = ({ insight, onClose, isDark }) => {
  if (!insight) return null;

  const getScoreColor = (score) => {
    if (score >= 0.7) return isDark ? 'text-emerald-200 bg-emerald-900/50' : 'text-emerald-700 bg-emerald-100';
    return isDark ? 'text-rose-200 bg-rose-900/50' : 'text-rose-700 bg-rose-100';
  };

  const getScoreBgColor = (score) => {
    if (score >= 0.7) return 'bg-emerald-500';
    return 'bg-rose-500';
  };

  return (
    <div className={`fixed bottom-6 right-6 w-[450px] rounded-2xl shadow-2xl border z-[1001] animate-slideIn overflow-hidden ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-emerald-200'}`}>
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
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-br from-emerald-100 to-lime-100 border-emerald-300'} rounded-xl p-4 border-2`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>Suitability Score</span>
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
        <div className={`${isDark ? 'bg-slate-800 border-emerald-500' : 'bg-emerald-50 border-emerald-500'} border-l-4 p-4 rounded-lg`}>
          <h4 className="font-bold text-sm text-emerald-900 mb-2 flex items-center gap-2">
            <span>💡</span> Key Insights
          </h4>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>{insight.insights}</p>
        </div>

        {/* Financial Estimates */}
        {(insight.estimated_monthly_revenue || insight.estimated_startup_cost) && (
          <div className="grid grid-cols-2 gap-3">
            {insight.estimated_monthly_revenue && (
              <div className={`${isDark ? 'bg-emerald-900/30 border-emerald-700' : 'bg-green-50 border-green-200'} border-2 rounded-xl p-4`}>
                <p className={`text-xs font-semibold mb-1 ${isDark ? 'text-emerald-300' : 'text-green-700'}`}>Est. Monthly Revenue</p>
                <p className={`text-sm font-bold ${isDark ? 'text-emerald-100' : 'text-green-900'}`}>{insight.estimated_monthly_revenue}</p>
              </div>
            )}
            {insight.estimated_startup_cost && (
              <div className={`${isDark ? 'bg-rose-900/30 border-rose-700' : 'bg-rose-50 border-rose-200'} border-2 rounded-xl p-4`}>
                <p className={`text-xs font-semibold mb-1 ${isDark ? 'text-rose-300' : 'text-rose-700'}`}>Est. Startup Cost</p>
                <p className={`text-sm font-bold ${isDark ? 'text-rose-100' : 'text-rose-900'}`}>{insight.estimated_startup_cost}</p>
              </div>
            )}
          </div>
        )}

        {/* Target Customers */}
        {insight.target_customers && (
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-emerald-50 border-emerald-200'} border-2 rounded-xl p-4`}>
            <h4 className={`font-bold text-sm mb-2 ${isDark ? 'text-emerald-300' : 'text-emerald-900'}`}>
              Target Customers
            </h4>
            <p className={`text-sm ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>{insight.target_customers}</p>
          </div>
        )}

        {/* Opportunities */}
        {insight.opportunities && insight.opportunities.length > 0 && (
          <div className={`${isDark ? 'bg-emerald-900/30 border-emerald-700' : 'bg-green-50 border-green-200'} border-2 rounded-xl p-4`}>
            <h4 className={`font-bold text-sm mb-3 flex items-center gap-2 ${isDark ? 'text-emerald-200' : 'text-green-900'}`}>
              <span>✅</span> Opportunities
            </h4>
            <ul className="space-y-2">
              {insight.opportunities.map((opp, idx) => (
                <li key={idx} className={`text-sm flex items-start gap-2 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
                  <span className={`font-bold mt-0.5 ${isDark ? 'text-emerald-300' : 'text-green-600'}`}>→</span>
                  <span>{opp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Challenges */}
        {insight.challenges && insight.challenges.length > 0 && (
          <div className={`${isDark ? 'bg-rose-900/30 border-rose-700' : 'bg-rose-50 border-rose-200'} border-2 rounded-xl p-4`}>
            <h4 className={`font-bold text-sm mb-3 flex items-center gap-2 ${isDark ? 'text-rose-200' : 'text-rose-900'}`}>
              <span>⚠️</span> Challenges
            </h4>
            <ul className="space-y-2">
              {insight.challenges.map((chal, idx) => (
                <li key={idx} className={`text-sm flex items-start gap-2 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
                  <span className={`font-bold mt-0.5 ${isDark ? 'text-rose-300' : 'text-rose-600'}`}>→</span>
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
