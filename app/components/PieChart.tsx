import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Define TypeScript type for partner data
interface Partner {
  status: "active" | "inactive";
}

const PartnerStatusChart: React.FC = () => {
  const [chartData, setChartData] = useState({
    labels: ["Active", "Inactive"],
    datasets: [
      {
        data: [0, 0], // Default values before fetching data
        backgroundColor: ["#28a745", "#dc3545"], // Green for active, Red for inactive
        hoverBackgroundColor: ["#218838", "#c82333"],
      },
    ],
  });

  const [count, setCount] = useState(0)

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch("/api/partners"); // Replace with your API route
        const partners: Partner[] = await response.json();

        // Count active and inactive partners
        const activeCount = partners.filter((p) => p.status === "active").length;
        const inactiveCount = partners.filter((p) => p.status === "inactive").length;
        setCount(partners.length);

        // Update chart data
        setChartData({
          labels: ["Active", "Inactive"],
          datasets: [
            {
              data: [activeCount, inactiveCount],
              backgroundColor: ["#28a745", "#dc3545"],
              hoverBackgroundColor: ["#218838", "#c82333"],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching partners:", error);
      }
    };

    fetchPartners();
  }, []);

  return (
    <div className="flex flex-col bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold">Partner Availability</h2>
        <div className="text-sm text-gray-500">
            Total Partners: {count}
        </div>
      <div className="w-full mx-auto">
        <Pie data={chartData} />
      </div>
      <button className="text-green-700 font-bold text-right">View all</button>
    </div>
  );
};

export default PartnerStatusChart;
