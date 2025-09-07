import { useState } from 'react';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Music,
  AlertCircle,
  CheckCircle,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import SampleCard from './SampleCard';
import RoyaltyTracker from './RoyaltyTracker';

const Dashboard = () => {
  const [samples] = useState([
    {
      id: 1,
      name: "Jazz Piano Loop",
      artist: "Miles Davis Estate",
      status: "pending",
      requestDate: "2024-01-15",
      royaltyRate: "15%",
      project: "Summer Vibes EP"
    },
    {
      id: 2,
      name: "Funk Bass Line",
      artist: "James Brown Music",
      status: "approved",
      requestDate: "2024-01-10",
      royaltyRate: "20%",
      project: "Groove Session"
    },
    {
      id: 3,
      name: "Soul Vocals",
      artist: "Aretha Franklin Estate",
      status: "negotiating",
      requestDate: "2024-01-12",
      royaltyRate: "25%",
      project: "Classic Revival"
    }
  ]);

  const stats = [
    {
      label: "Active Samples",
      value: "12",
      change: "+3 this month",
      icon: Music,
      color: "text-blue-600"
    },
    {
      label: "Pending Clearances",
      value: "5",
      change: "2 urgent",
      icon: Clock,
      color: "text-orange-600"
    },
    {
      label: "Monthly Royalties",
      value: "$2,847",
      change: "+12% vs last month",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      label: "Cleared This Month",
      value: "8",
      change: "+4 vs last month",
      icon: CheckCircle,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your sample clearances and royalties</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn-primary">
            New Sample Request
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sample Clearance Requests */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Sample Clearance Requests</h2>
              <button className="text-primary text-sm font-medium hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {samples.map((sample) => (
                <SampleCard key={sample.id} sample={sample} variant="list" />
              ))}
            </div>
          </div>
        </div>

        {/* Royalty Overview */}
        <div className="space-y-6">
          <RoyaltyTracker variant="dashboard" />
          
          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-green-100 rounded-full mt-1">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">Funk Bass Line clearance approved</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-orange-100 rounded-full mt-1">
                  <Clock className="w-3 h-3 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">Jazz Piano Loop pending review</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-blue-100 rounded-full mt-1">
                  <DollarSign className="w-3 h-3 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">Royalty payment sent - $450</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;