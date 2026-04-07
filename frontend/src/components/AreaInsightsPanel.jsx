import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

const AreaInsightsPanel = ({ city, selectedArea, onAreaSelect, isDark }) => {
  if (!city || !city.areas || city.areas.length === 0) {
    return null;
  }

  const sortedAreas = [...city.areas].sort((a, b) => b.score - a.score);

  const chartData = {
    labels: sortedAreas.map(d => d.area_name),
    datasets: [
      {
        label: 'Area Suitability Score',
        data: sortedAreas.map(d => d.score),
        backgroundColor: sortedAreas.map(d => 
            selectedArea?.area_name === d.area_name ? 'rgba(244, 63, 94, 0.8)' : 'rgba(22, 163, 74, 0.8)'
        ),
        borderColor: isDark ? 'rgba(74, 222, 128, 1)' : 'rgba(21, 128, 61, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Best Areas in ${city.city}`,
        color: isDark ? '#a7f3d0' : '#065f46',
        font: {
          size: 14,
          weight: 'bold'
        }
      },
    },
    onClick: (event, elements) => {
        if (elements.length > 0) {
            const index = elements[0].index;
            onAreaSelect(sortedAreas[index]);
        }
    },
    scales: {
        x: {
            min: 0,
            max: 1
        }
    }
  };

  return (
    <div className={`${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-emerald-200'} p-4 rounded-xl shadow-md border mt-4`}>
       <div className="h-64 mb-4">
         <Bar data={chartData} options={options} />
       </div>
       
       {/* Area Details List */}
       <div className="space-y-2 max-h-48 overflow-y-auto">
         <h4 className={`font-semibold text-sm mb-2 ${isDark ? 'text-emerald-300' : 'text-emerald-900'}`}>Neighborhood Insights</h4>
         {sortedAreas.map((area, idx) => (
           <div 
             key={idx}
             onClick={() => onAreaSelect(area)}
             className={`p-2 rounded border cursor-pointer transition-all ${
               selectedArea?.area_name === area.area_name 
                 ? isDark ? 'border-rose-500 bg-rose-900/30' : 'border-rose-300 bg-rose-50'
                 : isDark ? 'border-slate-700 hover:border-emerald-500 hover:bg-slate-800' : 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50'
             }`}
           >
             <div className="flex justify-between items-center mb-1">
               <span className={`font-medium text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>📍 {area.area_name}</span>
               <span className={`text-xs font-semibold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                 {(area.score * 100).toFixed(0)}/100
               </span>
             </div>
             <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{area.characteristics}</p>
           </div>
         ))}
       </div>
    </div>
  );
};

export default AreaInsightsPanel;
