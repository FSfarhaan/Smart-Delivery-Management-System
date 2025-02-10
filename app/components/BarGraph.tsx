"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data, type }: { data: any[], type: string }) => {
  // Prepare the data for Chart.js
  const chartData = {
    labels: data.map((item) => item.area[0]), // Areas as labels
    datasets: [
      {
        label: type === "partners" ? "Partners Count" : "Orders count",
        data: data.map((item) => item.count), // Counts for each area
        backgroundColor: "rgba(75, 192, 192, 0.5)", // Color of bars
        borderColor: "rgba(75, 192, 192, 1)", // Border color of bars
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: type === "partners" ? "Partners per area": "Orders per area"
      },
    },
    scales: {
        y: {
          min: 0, // Minimum value for y-axis
          max: Math.max(...data.map((item) => item.count)) + 1, // Max value slightly higher than the highest count
          ticks: {
            stepSize: 1, // Ensure ticks are incremented by 1
          },
        },
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {data && <Bar data={chartData} options={chartOptions} width={100} height={100} /> }
    </div>
  ) 
};

export default BarChart;
