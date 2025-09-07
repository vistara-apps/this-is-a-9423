import { useState } from 'react';
import { Search, Filter, Play, Download, Heart, Star } from 'lucide-react';
import SampleCard from './SampleCard';
import AttributionGenerator from './AttributionGenerator';

const Licensing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [showAttribution, setShowAttribution] = useState(false);

  const [marketplaceSamples] = useState([
    {
      id: 1,
      name: "Vintage Drum Break",
      artist: "Classic Breaks Co.",
      genre: "hip-hop",
      price: 25,
      duration: "0:08",
      bpm: 95,
      key: "C",
      tags: ["vintage", "break", "drums"],
      license: "Standard",
      featured: true
    },
    {
      id: 2,
      name: "Smooth Jazz Guitar",
      artist: "Jazz Collective",
      genre: "jazz",
      price: 35,
      duration: "0:15",
      bpm: 120,
      key: "Dm",
      tags: ["guitar", "smooth", "jazzy"],
      license: "Premium",
      featured: false
    },
    {
      id: 3,
      name: "Electronic Synth Pad",
      artist: "Digital Sounds",
      genre: "electronic",
      price: 20,
      duration: "0:12",
      bpm: 128,
      key: "Am",
      tags: ["synth", "pad", "ambient"],
      license: "Standard",
      featured: true
    },
    {
      id: 4,
      name: "Latin Percussion Loop",
      artist: "Rhythm Masters",
      genre: "world",
      price: 30,
      duration: "0:16",
      bpm: 110,
      key: "G",
      tags: ["percussion", "latin", "world"],
      license: "Premium",
      featured: false
    },
    {
      id: 5,
      name: "Rock Guitar Riff",
      artist: "Power Chords Inc.",
      genre: "rock",
      price: 40,
      duration: "0:20",
      bpm: 140,
      key: "E",
      tags: ["guitar", "rock", "riff"],
      license: "Extended",
      featured: true
    },
    {
      id: 6,
      name: "Soul Vocal Harmony",
      artist: "Harmony Collective",
      genre: "soul",
      price: 50,
      duration: "0:18",
      bpm: 75,
      key: "F",
      tags: ["vocals", "harmony", "soul"],
      license: "Premium",
      featured: false
    }
  ]);

  const genres = ['all', 'hip-hop', 'jazz', 'electronic', 'rock', 'soul', 'world'];
  const priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under $25', value: 'under-25' },
    { label: '$25 - $50', value: '25-50' },
    { label: 'Over $50', value: 'over-50' }
  ];

  const filteredSamples = marketplaceSamples.filter(sample => {
    const matchesSearch = sample.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sample.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sample.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesGenre = selectedGenre === 'all' || sample.genre === selectedGenre;
    
    let matchesPrice = true;
    if (priceRange === 'under-25') matchesPrice = sample.price < 25;
    else if (priceRange === '25-50') matchesPrice = sample.price >= 25 && sample.price <= 50;
    else if (priceRange === 'over-50') matchesPrice = sample.price > 50;
    
    return matchesSearch && matchesGenre && matchesPrice;
  });

  const featuredSamples = marketplaceSamples.filter(sample => sample.featured);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sample Marketplace</h1>
          <p className="text-gray-600 mt-1">Discover and license high-quality samples</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setShowAttribution(true)}
            className="btn-primary"
          >
            Attribution Generator
          </button>
        </div>
      </div>

      {/* Featured Samples */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span>Featured Samples</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredSamples.slice(0, 3).map((sample) => (
            <div key={sample.id} className="relative">
              <SampleCard sample={sample} variant="marketplace" />
              <div className="absolute top-2 right-2">
                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  Featured
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search samples, artists, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre === 'all' ? 'All Genres' : genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sample Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSamples.map((sample) => (
          <div key={sample.id} className="card group cursor-pointer hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
              <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
              <div className="absolute top-2 left-2">
                <button className="p-1 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">{sample.name}</h3>
              <p className="text-sm text-gray-600">{sample.artist}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{sample.duration}</span>
                <span>{sample.bpm} BPM</span>
                <span>Key: {sample.key}</span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {sample.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-lg font-bold text-gray-900">${sample.price}</span>
                  <span className="text-xs text-gray-500 ml-1">{sample.license}</span>
                </div>
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
          </div>
        ))}
      </div>

      {filteredSamples.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No samples found matching your criteria.</p>
        </div>
      )}

      {/* Attribution Generator Modal */}
      {showAttribution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-modal max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <AttributionGenerator onClose={() => setShowAttribution(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Licensing;