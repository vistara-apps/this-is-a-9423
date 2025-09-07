import { Clock, CheckCircle, AlertCircle, MoreHorizontal, Play, Download } from 'lucide-react';

const SampleCard = ({ sample, variant = 'display' }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'negotiating':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'negotiating':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (variant === 'list') {
    return (
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="flex-shrink-0">
            {getStatusIcon(sample.status)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{sample.name}</p>
            <p className="text-xs text-gray-500 truncate">{sample.artist}</p>
          </div>
          <div className="hidden sm:block">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sample.status)}`}>
              {sample.status}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-900 font-medium">{sample.royaltyRate}</span>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'marketplace') {
    return (
      <div className="card group cursor-pointer hover:shadow-lg transition-shadow">
        <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
          <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">{sample.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{sample.artist}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">${sample.price}</span>
          <div className="flex items-center space-x-2">
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <Download className="w-4 h-4" />
            </button>
            <button className="btn-primary text-sm px-3 py-1">
              License
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon(sample.status)}
          <div>
            <h3 className="font-semibold text-gray-900">{sample.name}</h3>
            <p className="text-sm text-gray-600">{sample.artist}</p>
          </div>
        </div>
        <button className="p-1 text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Status:</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sample.status)}`}>
            {sample.status}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Royalty Rate:</span>
          <span className="font-medium">{sample.royaltyRate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Project:</span>
          <span className="font-medium">{sample.project}</span>
        </div>
      </div>
    </div>
  );
};

export default SampleCard;