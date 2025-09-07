import { 
  LayoutDashboard, 
  Music, 
  FileCheck, 
  Scale, 
  Settings,
  ShoppingBag,
  Crown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ currentView, setCurrentView }) => {
  const { hasFeature, subscriptionTier } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'samples', label: 'Samples', icon: Music },
    { id: 'clearing', label: 'Clearing', icon: FileCheck },
    { id: 'licensing', label: 'Licensing', icon: Scale },
    { 
      id: 'marketplace', 
      label: 'Marketplace', 
      icon: ShoppingBag,
      requiresFeature: 'marketplace_access'
    },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40 hidden lg:block">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">SampleSafe</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const hasAccess = !item.requiresFeature || hasFeature(item.requiresFeature);
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                  currentView === item.id
                    ? 'bg-primary text-white'
                    : hasAccess 
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-gray-400 cursor-not-allowed'
                }`}
                disabled={!hasAccess}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {!hasAccess && (
                  <Crown className="w-4 h-4 ml-auto text-yellow-500" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-8 p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg text-white">
          <div className="flex items-center space-x-2 mb-2">
            <Crown className="w-5 h-5" />
            <span className="font-semibold">Upgrade to Pro</span>
          </div>
          <p className="text-sm text-purple-100 mb-3">
            Unlimited samples and advanced analytics
          </p>
          <button className="w-full bg-white text-purple-600 font-medium py-2 px-4 rounded-md text-sm hover:bg-gray-100 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
