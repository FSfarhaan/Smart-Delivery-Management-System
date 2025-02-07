// types.ts
interface StatCard {
    value: number | string;
    label: string;
    trend: number;
    icon: string;
    isCurrency?: boolean;
  }
  
  interface Order {
    queueId: string;
    date: string;
    customer: string;
    serviceType: 'Delivery' | 'Take Away';
    itemName: string;
    qty: number;
    status: 'NEW' | 'IN PROCESS' | 'DONE';
    total: number;
  }
  
  // page.tsx
  import { FC } from 'react';
  import { Monitor, Layers, MessageSquare, DollarSign } from 'lucide-react';
  
  const KassaDashboard: FC = () => {
    const stats: StatCard[] = [
      { value: 134, label: 'Total order', trend: 14, icon: 'Monitor' },
      { value: 21, label: 'Order in process', trend: -18, icon: 'Layers' },
      { value: 113, label: 'Order done', trend: -16, icon: 'MessageSquare' },
      { value: 2096, label: 'Total income', trend: 18, icon: 'DollarSign', isCurrency: true },
    ];
  
    const orders: Order[] = [
      { queueId: '#CHO067', date: 'NOV 26, 2023', customer: 'Maulana', serviceType: 'Delivery', itemName: 'American Style Burger', qty: 1, status: 'NEW', total: 75.00 },
      { queueId: '#CHO068', date: 'NOV 25, 2023', customer: 'Hanifa', serviceType: 'Take Away', itemName: 'Sushi Platter', qty: 2, status: 'NEW', total: 175.00 },
      { queueId: '#CHO069', date: 'NOV 24, 2023', customer: 'Annisa', serviceType: 'Delivery', itemName: 'Chicken Curry Katsu', qty: 4, status: 'IN PROCESS', total: 375.00 },
      { queueId: '#CHO070', date: 'NOV 23,2023', customer: 'Iwan', serviceType: 'Take Away', itemName: 'American Style Burger', qty: 1, status: 'DONE', total: 88.00 },
      { queueId: '#CHO071', date: 'NOV 22, 2023', customer: 'Dwi', serviceType: 'Take Away', itemName: 'Sushi Platter', qty: 4, status: 'NEW', total: 155.00 },
      { queueId: '#CHO072', date: 'NOV 21, 2023', customer: 'Wahyu', serviceType: 'Delivery', itemName: 'American Style Burger', qty: 2, status: 'DONE', total: 60.00 },
    ];
  
    const getStatusColor = (status: Order['status']) => {
      switch (status) {
        case 'NEW':
          return 'bg-blue-100 text-blue-600';
        case 'IN PROCESS':
          return 'bg-yellow-100 text-yellow-600';
        case 'DONE':
          return 'bg-green-100 text-green-600';
        default:
          return 'bg-gray-100 text-gray-600';
      }
    };
  
    const getIcon = (iconName: string) => {
      switch (iconName) {
        case 'Monitor':
          return <Monitor className="h-6 w-6" />;
        case 'Layers':
          return <Layers className="h-6 w-6" />;
        case 'MessageSquare':
          return <MessageSquare className="h-6 w-6" />;
        case 'DollarSign':
          return <DollarSign className="h-6 w-6" />;
        default:
          return null;
      }
    };
  
    return (
      <div className="min-h-screen bg-gray-50 text-black">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <span className="text-blue-600 text-2xl font-bold">K</span>
                <span className="ml-2">Kassa</span>
              </div>
              
              <nav className="flex space-x-8">
                <a href="#" className="text-gray-500 hover:text-gray-900">Home</a>
                <a href="#" className="text-gray-500 hover:text-gray-900">Orders</a>
                <a href="#" className="text-gray-500 hover:text-gray-900">Customers</a>
                <a href="#" className="text-gray-500 hover:text-gray-900">Setting</a>
              </nav>
  
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-white">
                    A
                  </div>
                  <span>Alchemyst Cafe</span>
                </div>
              </div>
            </div>
          </div>
        </header>
  
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Good Morning, Aaron!</h1>
              <p className="text-gray-500">Start your day by checking today's tasks and updates.</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-blue-600">November 21, 2023</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div>
                  <div className="font-medium">Aaron Odegaard</div>
                  <div className="text-sm text-gray-500">Owner</div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getIcon(stat.icon)}
                  </div>
                  <div className={`text-sm ${stat.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.trend > 0 ? '+' : ''}{stat.trend}%
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {stat.isCurrency ? '$' : ''}{stat.value}
                </div>
                <div className="text-gray-500">{stat.label}</div>
                <div className="text-sm text-gray-400">Compare to yesterday</div>
              </div>
            ))}
          </div>
  
          {/* Order List */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Order List</h2>
                  <p className="text-gray-500">View and manage all transactions with details on status, payment, and customer.</p>
                </div>
                <button className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg">
                  <span>Date & Time</span>
                </button>
              </div>
            </div>
  
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Queue ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QTY</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.queueId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.queueId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.serviceType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.itemName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.qty}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    );
  };
  
  export default KassaDashboard;