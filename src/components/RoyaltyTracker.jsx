import { DollarSign, TrendingUp, Calendar, User } from 'lucide-react';

const RoyaltyTracker = ({ variant = 'dashboard' }) => {
  const royaltyData = [
    { month: 'Jan', amount: 2400 },
    { month: 'Feb', amount: 1800 },
    { month: 'Mar', amount: 2900 },
    { month: 'Apr', amount: 3200 },
    { month: 'May', amount: 2847 },
  ];

  const recentPayments = [
    {
      id: 1,
      artist: "Miles Davis Estate",
      amount: 450,
      sample: "Jazz Piano Loop",
      date: "2024-01-20"
    },
    {
      id: 2,
      artist: "James Brown Music",
      amount: 680,
      sample: "Funk Bass Line",
      date: "2024-01-18"
    },
    {
      id: 3,
      artist: "Aretha Franklin Estate",
      amount: 320,
      sample: "Soul Vocals",
      date: "2024-01-15"
    }
  ];

  if (variant === 'dashboard') {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Royalty Overview</h3>
          <button className="text-primary text-sm font-medium hover:underline">
            View Details
          </button>
        </div>
        
        <div className="gradient-card rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">$2,847</p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% vs last month
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Recent Payments</h4>
          {recentPayments.slice(0, 3).map((payment) => (
            <div key={payment.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{payment.artist}</span>
              </div>
              <span className="font-medium">${payment.amount}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">Royalty Tracking</h2>
        
        {/* Monthly Chart */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Monthly Revenue</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-end justify-center space-x-4 p-4">
            {royaltyData.map((data, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="bg-primary rounded-t w-8 mb-2"
                  style={{ height: `${(data.amount / 3200) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-600">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment History */}
        <div>
          <h3 className="text-lg font-medium mb-4">Payment History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-medium text-gray-700">Artist</th>
                  <th className="text-left py-2 font-medium text-gray-700">Sample</th>
                  <th className="text-left py-2 font-medium text-gray-700">Amount</th>
                  <th className="text-left py-2 font-medium text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100">
                    <td className="py-3">{payment.artist}</td>
                    <td className="py-3">{payment.sample}</td>
                    <td className="py-3 font-medium">${payment.amount}</td>
                    <td className="py-3 text-gray-600">{payment.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoyaltyTracker;