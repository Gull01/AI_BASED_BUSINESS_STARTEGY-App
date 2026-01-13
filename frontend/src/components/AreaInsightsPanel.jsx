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

const AreaInsightsPanel = ({ city, selectedArea, onAreaSelect }) => {
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
            selectedArea?.area_name === d.area_name ? 'rgba(99, 102, 241, 0.8)' : 'rgba(99, 102, 241, 0.4)'
        ),
        borderColor: 'rgba(99, 102, 241, 1)',
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
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
       <div className="h-64 mb-4">
         <Bar data={chartData} options={options} />
       </div>
       
       {/* Area Details List */}
       <div className="space-y-2 max-h-48 overflow-y-auto">
         <h4 className="font-semibold text-sm text-gray-700 mb-2">Neighborhood Insights</h4>
         {sortedAreas.map((area, idx) => (
           <div 
             key={idx}
             onClick={() => onAreaSelect(area)}
             className={`p-2 rounded border cursor-pointer transition-all ${
               selectedArea?.area_name === area.area_name 
                 ? 'border-indigo-500 bg-indigo-50' 
                 : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
             }`}
           >
             <div className="flex justify-between items-center mb-1">
               <span className="font-medium text-sm">📍 {area.area_name}</span>
               <span className="text-xs font-semibold text-indigo-600">
                 {(area.score * 100).toFixed(0)}/100
               </span>
             </div>
             <p className="text-xs text-gray-600">{area.characteristics}</p>
           </div>
         ))}
       </div>
    </div>
  );
};

export default AreaInsightsPanel;
