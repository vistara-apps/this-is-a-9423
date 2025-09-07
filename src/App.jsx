import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Samples from './components/Samples';
import Clearing from './components/Clearing';
import Licensing from './components/Licensing';
import Settings from './components/Settings';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'samples':
        return <Samples />;
      case 'clearing':
        return <Clearing />;
      case 'licensing':
        return <Licensing />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="flex">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        <div className="flex-1 flex flex-col ml-0 lg:ml-64">
          <Header />
          <main className="flex-1 p-4 lg:p-6">
            {renderCurrentView()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;