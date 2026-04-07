import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RankingPanel = ({ data, selectedCity, onCitySelect, isDark }) => {
  // Sort data Descending
  const sortedData = [...data].sort((a, b) => b.score - a.score);

  const chartData = {
    labels: sortedData.map(d => d.city),
    datasets: [
      {
        label: 'Suitability Score',
        data: sortedData.map(d => d.score),
        backgroundColor: sortedData.map(d => 
            selectedCity?.city === d.city ? 'rgba(244, 63, 94, 0.8)' : 'rgba(22, 163, 74, 0.8)'
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
        text: 'Top Cities Ranking',
        color: isDark ? '#a7f3d0' : '#065f46',
      },
    },
    onClick: (event, elements) => {
        if (elements.length > 0) {
            const index = elements[0].index;
            onCitySelect(sortedData[index]);
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
    <div className={`${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-emerald-200'} p-4 rounded-xl shadow-md border h-96 flex flex-col`}>
       <div className="flex-grow">
         <Bar data={chartData} options={options} />
       </div>
    </div>
  );
};

export default RankingPanel;
