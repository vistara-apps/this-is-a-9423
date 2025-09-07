import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Play, 
  Pause, 
  ShoppingCart, 
  Heart,
  Download,
  Music,
  Clock,
  DollarSign,
  Tag,
  Star,
  Grid,
  List
} from 'lucide-react';
import { db } from '../lib/supabase';
import { stripeService, formatPrice } from '../lib/stripe';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Marketplace = () => {
  const { user, hasFeature } = useAuth();
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    genre: '',
    minPrice: '',
    maxPrice: '',
    licenseType: '',
    bpm: ''
  });
  const [viewMode, setViewMode] = useState('grid');
  const [playingSample, setPlayingSample] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [cart, setCart] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Check if user has marketplace access
  const hasMarketplaceAccess = hasFeature('marketplace_access');

  useEffect(() => {
    if (hasMarketplaceAccess) {
      loadSamples();
    }
  }, [filters, searchTerm, sortBy, hasMarketplaceAccess]);

  const loadSamples = async () => {
    try {
      setLoading(true);
      const searchFilters = {
        ...filters,
        search: searchTerm
      };

      const { data, error } = await db.getMarketplaceSamples(searchFilters);
      
      if (error) {
        toast.error('Failed to load samples');
        return;
      }

      // Sort samples
      let sortedSamples = [...data];
      switch (sortBy) {
        case 'price_low':
          sortedSamples.sort((a, b) => a.price - b.price);
          break;
        case 'price_high':
          sortedSamples.sort((a, b) => b.price - a.price);
          break;
        case 'popular':
          // This would require a popularity metric in the database
          break;
        case 'newest':
        default:
          sortedSamples.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          break;
      }

      setSamples(sortedSamples);
    } catch (error) {
      console.error('Error loading samples:', error);
      toast.error('Failed to load samples');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySample = (sampleId, previewUrl) => {
    if (playingSample === sampleId) {
      setPlayingSample(null);
      // Stop audio playback
    } else {
      setPlayingSample(sampleId);
      // Start audio playback
      // In a real implementation, you'd use an audio player library
    }
  };

  const toggleFavorite = (sampleId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(sampleId)) {
      newFavorites.delete(sampleId);
      toast.success('Removed from favorites');
    } else {
      newFavorites.add(sampleId);
      toast.success('Added to favorites');
    }
    setFavorites(newFavorites);
  };

  const addToCart = (sample) => {
    const existingItem = cart.find(item => item.id === sample.id);
    if (existingItem) {
      toast.info('Sample already in cart');
      return;
    }

    setCart([...cart, sample]);
    toast.success('Added to cart');
  };

  const removeFromCart = (sampleId) => {
    setCart(cart.filter(item => item.id !== sampleId));
    toast.success('Removed from cart');
  };

  const handlePurchase = async (sample) => {
    if (!user) {
      toast.error('Please sign in to purchase samples');
      return;
    }

    try {
      const { clientSecret, error } = await stripeService.createSamplePayment(
        sample.price,
        sample.id,
        user.id,
        `${window.location.origin}/marketplace/success`,
        `${window.location.origin}/marketplace/cancel`
      );

      if (error) {
        toast.error('Failed to initiate payment');
        return;
      }

      // In a real implementation, you'd redirect to Stripe Checkout
      // or use Stripe Elements for embedded payment
      toast.success('Redirecting to payment...');
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to process purchase');
    }
  };

  const SampleCard = ({ sample, variant = 'grid' }) => {
    const isPlaying = playingSample === sample.id;
    const isFavorite = favorites.has(sample.id);
    const inCart = cart.some(item => item.id === sample.id);

    if (variant === 'list') {
      return (
        <motion.div
          layout
          className="card flex items-center space-x-4 p-4"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Music className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {sample.sample_name}
            </h3>
            <p className="text-sm text-gray-600">{sample.artist_name}</p>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-xs text-gray-500">{sample.genre}</span>
              {sample.bpm && (
                <span className="text-xs text-gray-500">{sample.bpm} BPM</span>
              )}
              <span className="text-xs text-gray-500">{sample.license_type}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePlaySample(sample.id, sample.preview_url)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => toggleFavorite(sample.id)}
              className={`p-2 rounded-full transition-colors ${
                isFavorite 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                {formatPrice(sample.price)}
              </p>
              <button
                onClick={() => inCart ? removeFromCart(sample.id) : addToCart(sample)}
                className={`text-sm px-3 py-1 rounded-full transition-colors ${
                  inCart
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-primary text-white hover:opacity-90'
                }`}
              >
                {inCart ? 'Remove' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        layout
        className="card overflow-hidden"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative">
          <div className="aspect-square bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Music className="w-12 h-12 text-white" />
          </div>
          
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
            <button
              onClick={() => handlePlaySample(sample.id, sample.preview_url)}
              className="opacity-0 hover:opacity-100 transition-opacity bg-white rounded-full p-3 shadow-lg"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-gray-900" />
              ) : (
                <Play className="w-6 h-6 text-gray-900" />
              )}
            </button>
          </div>

          <button
            onClick={() => toggleFavorite(sample.id)}
            className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white bg-opacity-80 hover:bg-opacity-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 truncate">
            {sample.sample_name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{sample.artist_name}</p>
          
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span>{sample.genre}</span>
            {sample.bpm && <span>{sample.bpm} BPM</span>}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(sample.price)}
            </span>
            <button
              onClick={() => inCart ? removeFromCart(sample.id) : addToCart(sample)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                inCart
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-primary text-white hover:opacity-90'
              }`}
            >
              {inCart ? 'Remove' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  if (!hasMarketplaceAccess) {
    return (
      <div className="text-center py-12">
        <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Upgrade to Access Marketplace
        </h2>
        <p className="text-gray-600 mb-6">
          Browse and purchase pre-cleared samples from our curated marketplace.
        </p>
        <button className="btn-primary">
          Upgrade to Creator Plan
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sample Marketplace</h1>
          <p className="text-gray-600 mt-1">
            Discover and purchase pre-cleared samples
          </p>
        </div>
        
        {cart.length > 0 && (
          <div className="mt-4 sm:mt-0">
            <button className="btn-primary flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Cart ({cart.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search samples, artists, genres..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="newest">Newest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>

            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Genre
                  </label>
                  <select
                    value={filters.genre}
                    onChange={(e) => setFilters({...filters, genre: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">All Genres</option>
                    <option value="hip-hop">Hip Hop</option>
                    <option value="jazz">Jazz</option>
                    <option value="funk">Funk</option>
                    <option value="soul">Soul</option>
                    <option value="electronic">Electronic</option>
                    <option value="rock">Rock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Type
                  </label>
                  <select
                    value={filters.licenseType}
                    onChange={(e) => setFilters({...filters, licenseType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">All Licenses</option>
                    <option value="royalty_free">Royalty Free</option>
                    <option value="exclusive">Exclusive</option>
                    <option value="non_exclusive">Non-Exclusive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    BPM
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 120"
                    value={filters.bpm}
                    onChange={(e) => setFilters({...filters, bpm: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setFilters({
                    genre: '',
                    minPrice: '',
                    maxPrice: '',
                    licenseType: '',
                    bpm: ''
                  })}
                  className="btn-secondary"
                >
                  Clear Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading samples...</p>
        </div>
      ) : samples.length === 0 ? (
        <div className="text-center py-12">
          <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No samples found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters
          </p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {samples.map((sample) => (
            <SampleCard 
              key={sample.id} 
              sample={sample} 
              variant={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
