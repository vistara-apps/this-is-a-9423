import { useState } from 'react';
import { X, Upload, Send } from 'lucide-react';

const ClearanceForm = ({ onClose, variant = 'initial' }) => {
  const [formData, setFormData] = useState({
    sampleName: '',
    originalArtist: '',
    rightsHolder: '',
    contactEmail: '',
    project: '',
    royaltyOffer: '',
    usageTerms: 'worldwide',
    duration: '5',
    description: '',
    intendedUse: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Clearance request submitted:', formData);
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (variant === 'negotiation') {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Negotiation Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Current Negotiation Status</h3>
            <p className="text-blue-800 text-sm">Rights holder has responded with a counter-offer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Offer
              </label>
              <input
                type="text"
                value="15%"
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Counter Offer
              </label>
              <input
                type="text"
                value="25%"
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Response
            </label>
            <textarea
              name="response"
              rows={4}
              placeholder="Respond to the counter-offer..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex items-center space-x-2">
              <Send className="w-4 h-4" />
              <span>Send Response</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (variant === 'approved') {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Clearance Approved!</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-green-900 mb-2">Sample Cleared Successfully</h3>
          <p className="text-green-800 mb-4">Your sample clearance has been approved with the agreed terms.</p>
          
          <div className="text-left bg-white rounded-lg p-4 mb-4">
            <h4 className="font-medium mb-2">Agreement Terms:</h4>
            <ul className="text-sm space-y-1">
              <li><strong>Royalty Rate:</strong> 20%</li>
              <li><strong>Territory:</strong> Worldwide</li>
              <li><strong>Duration:</strong> 5 years</li>
              <li><strong>Usage:</strong> Commercial release permitted</li>
            </ul>
          </div>
          
          <div className="flex justify-center space-x-3">
            <button className="btn-secondary">Download Agreement</button>
            <button className="btn-primary">Start Using Sample</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">New Clearance Request</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sample Name *
            </label>
            <input
              type="text"
              name="sampleName"
              value={formData.sampleName}
              onChange={handleInputChange}
              required
              placeholder="e.g., Jazz Piano Loop"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Artist *
            </label>
            <input
              type="text"
              name="originalArtist"
              value={formData.originalArtist}
              onChange={handleInputChange}
              required
              placeholder="e.g., Miles Davis"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rights Holder *
            </label>
            <input
              type="text"
              name="rightsHolder"
              value={formData.rightsHolder}
              onChange={handleInputChange}
              required
              placeholder="e.g., Miles Davis Estate"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleInputChange}
              placeholder="licensing@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Project *
          </label>
          <input
            type="text"
            name="project"
            value={formData.project}
            onChange={handleInputChange}
            required
            placeholder="e.g., Summer Vibes EP"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Royalty Offer (%)
            </label>
            <input
              type="number"
              name="royaltyOffer"
              value={formData.royaltyOffer}
              onChange={handleInputChange}
              placeholder="15"
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usage Territory
            </label>
            <select
              name="usageTerms"
              value={formData.usageTerms}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="worldwide">Worldwide</option>
              <option value="north-america">North America</option>
              <option value="europe">Europe</option>
              <option value="domestic">Domestic Only</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (years)
            </label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="1">1 year</option>
              <option value="3">3 years</option>
              <option value="5">5 years</option>
              <option value="10">10 years</option>
              <option value="perpetual">Perpetual</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sample Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            placeholder="Describe the sample and how you discovered it..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intended Use
          </label>
          <textarea
            name="intendedUse"
            value={formData.intendedUse}
            onChange={handleInputChange}
            rows={3}
            placeholder="Explain how you plan to use this sample in your project..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sample File (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Drag and drop your sample file here, or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-1">
              MP3, WAV, AIFF up to 50MB
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary flex items-center space-x-2">
            <Send className="w-4 h-4" />
            <span>Submit Request</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClearanceForm;