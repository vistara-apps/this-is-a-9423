import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Samples from './components/Samples';
import Clearing from './components/Clearing';
import Licensing from './components/Licensing';
import Marketplace from './components/Marketplace';
import Settings from './components/Settings';
import AuthModal from './components/AuthModal';

function AppContent() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated, loading } = useAuth();

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
      case 'marketplace':
        return <Marketplace />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SampleSafe...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg">
        <AuthModal 
          isOpen={true} 
          onClose={() => {}} 
          defaultMode="signin"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="flex">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        <div className="flex-1 flex flex-col ml-0 lg:ml-64">
          <Header onAuthClick={() => setShowAuthModal(true)} />
          <main className="flex-1 p-4 lg:p-6">
            {renderCurrentView()}
          </main>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
