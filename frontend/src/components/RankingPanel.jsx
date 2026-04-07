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

const RankingPanel = ({ data, selectedCity, onCitySelect }) => {
  // Sort data Descending
  const sortedData = [...data].sort((a, b) => b.score - a.score);

  const chartData = {
    labels: sortedData.map(d => d.city),
    datasets: [
      {
        label: 'Suitability Score',
        data: sortedData.map(d => d.score),
        backgroundColor: sortedData.map(d => 
            selectedCity?.city === d.city ? 'rgba(225, 29, 72, 0.75)' : 'rgba(16, 185, 129, 0.6)'
        ),
        borderColor: 'rgba(5, 150, 105, 1)',
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
        color: '#065f46',
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
    <div className="bg-white p-4 rounded-xl shadow-md border border-emerald-100 h-96 flex flex-col">
       <div className="flex-grow">
         <Bar data={chartData} options={options} />
       </div>
    </div>
  );
};

export default RankingPanel;
