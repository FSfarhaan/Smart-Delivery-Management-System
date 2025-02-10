import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import { useEffect, useState } from 'react';
import { IOrder } from '@/models/Order';
import { fetchOrders } from '../api/order';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const OrdersPieChart = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [orders, setOrders] = useState<IOrder[]>([])

  useEffect(() => {

    fetchOrders().then((order) => {
      setOrders(order);

      const statusCount = order.reduce((acc: any, order: any) => {
        const status = order.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});
  
      setChartData({
        labels: Object.keys(statusCount), // Status types
        datasets: [
          {
            label: 'Order Status Count',
            data: Object.values(statusCount), // Counts for each status
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF5733'], // Different colors for each status
            hoverOffset: 4,
          },
        ],
      });
    });
    
  }, []);

  return (
    <div>
        <h2 className="text-lg font-semibold">Order Status</h2>
        <div className="text-sm text-gray-500">
            Total orders: {orders.length}
        </div>
      {chartData && (
        <Pie data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
      )}
    </div>
  );
};

export default OrdersPieChart;
