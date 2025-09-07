import { useState } from 'react';
import { Search, Filter, Plus, Grid, List } from 'lucide-react';
import SampleCard from './SampleCard';

const Samples = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [samples] = useState([
    {
      id: 1,
      name: "Jazz Piano Loop",
      artist: "Miles Davis Estate",
      status: "pending",
      requestDate: "2024-01-15",
      royaltyRate: "15%",
      project: "Summer Vibes EP",
      price: 25
    },
    {
      id: 2,
      name: "Funk Bass Line",
      artist: "James Brown Music",
      status: "approved",
      requestDate: "2024-01-10",
      royaltyRate: "20%",
      project: "Groove Session",
      price: 35
    },
    {
      id: 3,
      name: "Soul Vocals",
      artist: "Aretha Franklin Estate",
      status: "negotiating",
      requestDate: "2024-01-12",
      royaltyRate: "25%",
      project: "Classic Revival",
      price: 50
    },
    {
      id: 4,
      name: "Hip Hop Drums",
      artist: "Breakbeat Records",
      status: "approved",
      requestDate: "2024-01-08",
      royaltyRate: "18%",
      project: "Urban Beats",
      price: 20
    },
    {
      id: 5,
      name: "Guitar Riff",
      artist: "Rock Legends Inc",
      status: "pending",
      requestDate: "2024-01-18",
      royaltyRate: "22%",
      project: "Electric Dreams",
      price: 40
    },
    {
      id: 6,
      name: "Orchestral Strings",
      artist: "Symphony Collective",
      status: "approved",
      requestDate: "2024-01-05",
      royaltyRate: "30%",
      project: "Cinematic Score",
      price: 75
    }
  ]);

  const filteredSamples = samples.filter(sample => {
    const matchesSearch = sample.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sample.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || sample.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Samples</h1>
          <p className="text-gray-600 mt-1">Manage your sample collection and clearances</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Sample</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search samples..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-64"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="negotiating">Negotiating</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sample Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSamples.map((sample) => (
            <SampleCard key={sample.id} sample={sample} variant="display" />
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="space-y-2">
            {filteredSamples.map((sample) => (
              <SampleCard key={sample.id} sample={sample} variant="list" />
            ))}
          </div>
        </div>
      )}

      {filteredSamples.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No samples found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Samples;