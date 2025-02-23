import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Link from "next/link";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Define TypeScript type for partner data
interface Partner {
  status: "active" | "inactive";
}

interface PieChartProps {
  showText: boolean;
}

const PieChart: React.FC<PieChartProps> = ({ showText }) => {
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
        const response = await fetch("/api/partners");
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
      <div className="mx-auto">
        <Pie data={chartData} />
      </div>
      {showText && 
        <Link href="/partners" className="text-right">
          <button className="text-green-700 font-bold">View all</button> 
        </Link> }
    </div>
  );
};

export default PieChart;
