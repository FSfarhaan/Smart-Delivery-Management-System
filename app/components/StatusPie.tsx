import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { useEffect, useState } from "react";
import { fetchOrders } from "../api/order";
import { fetchAssignments } from "../api/assignments";
import { usePathname } from "next/navigation";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const OrdersPieChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any>(null);

  const pathname = usePathname();
  const isAssignmentsPage = pathname === "/assignments";

  // Fetch orders or assignments based on pathname
  useEffect(() => {
    const fetchData = async () => {
      const result = isAssignmentsPage ? await fetchAssignments() : await fetchOrders();
      setData(result || []); // Ensure it never remains `null`
    };

    fetchData();
  }, [isAssignmentsPage]); // Runs when pathname changes

  // Generate Chart Data after `data` is updated
  useEffect(() => {
    if (data.length === 0) return;

    const statusCount = data.reduce((acc: Record<string, number>, item: any) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});

    setChartData({
      labels: Object.keys(statusCount),
      datasets: [
        {
          label: isAssignmentsPage ? "Assignment Status" : "Order Status",
          data: Object.values(statusCount),
          backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384", "#4BC0C0", "#FF5733"],
          hoverOffset: 4,
        },
      ],
    });
  }, [data]); // Runs when `data` updates

  return (
    <div>
      <h2 className="text-lg font-semibold">
        {isAssignmentsPage ? "Assignment Status" : "Order Status"}
      </h2>
      <div className="text-sm text-gray-500">
        {isAssignmentsPage ? "Total Assignments: " : "Total Orders: "} {data.length}
      </div>
      {chartData && <Pie data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />}
    </div>
  );
};

export default OrdersPieChart;
