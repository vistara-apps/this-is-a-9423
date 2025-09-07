import { useState } from 'react';
import { X, Copy, Download, Check } from 'lucide-react';

const AttributionGenerator = ({ onClose, variant = 'basic' }) => {
  const [samples, setSamples] = useState([
    {
      id: 1,
      name: '',
      artist: '',
      album: '',
      year: '',
      label: '',
      writers: '',
      publishers: ''
    }
  ]);
  
  const [trackInfo, setTrackInfo] = useState({
    trackTitle: '',
    artistName: '',
    albumTitle: '',
    releaseYear: ''
  });

  const [format, setFormat] = useState('standard');
  const [copied, setCopied] = useState(false);

  const addSample = () => {
    setSamples([...samples, {
      id: Date.now(),
      name: '',
      artist: '',
      album: '',
      year: '',
      label: '',
      writers: '',
      publishers: ''
    }]);
  };

  const removeSample = (id) => {
    setSamples(samples.filter(sample => sample.id !== id));
  };

  const updateSample = (id, field, value) => {
    setSamples(samples.map(sample => 
      sample.id === id ? { ...sample, [field]: value } : sample
    ));
  };

  const updateTrackInfo = (field, value) => {
    setTrackInfo(prev => ({ ...prev, [field]: value }));
  };

  const generateAttribution = () => {
    const validSamples = samples.filter(sample => sample.name && sample.artist);
    
    if (format === 'standard') {
      const sampleCredits = validSamples.map(sample => {
        let credit = `"${sample.name}"`;
        if (sample.album) credit += ` from "${sample.album}"`;
        credit += ` by ${sample.artist}`;
        if (sample.year) credit += ` (${sample.year})`;
        if (sample.label) credit += `, ${sample.label}`;
        return credit;
      }).join('\n');

      return `${trackInfo.trackTitle ? `"${trackInfo.trackTitle}"` : '[Track Title]'}${trackInfo.artistName ? ` by ${trackInfo.artistName}` : ''}\n\nContains samples from:\n${sampleCredits}`;
    } else if (format === 'liner-notes') {
      const trackCredit = `${trackInfo.trackTitle || '[Track Title]'}${trackInfo.artistName ? ` performed by ${trackInfo.artistName}` : ''}`;
      const sampleCredits = validSamples.map(sample => {
        let credit = `• "${sample.name}" written by ${sample.writers || sample.artist}`;
        if (sample.publishers) credit += `, published by ${sample.publishers}`;
        if (sample.album) credit += `, from the album "${sample.album}"`;
        if (sample.year && sample.label) credit += ` (${sample.year}, ${sample.label})`;
        return credit;
      }).join('\n');

      return `${trackCredit}\n\nSample Credits:\n${sampleCredits}`;
    } else {
      // JSON format
      const data = {
        track: trackInfo,
        samples: validSamples.map(sample => ({
          title: sample.name,
          artist: sample.artist,
          album: sample.album,
          year: sample.year,
          label: sample.label,
          writers: sample.writers ? sample.writers.split(',').map(w => w.trim()) : [],
          publishers: sample.publishers ? sample.publishers.split(',').map(p => p.trim()) : []
        }))
      };
      return JSON.stringify(data, null, 2);
    }
  };

  const copyToClipboard = () => {
    const attribution = generateAttribution();
    navigator.clipboard.writeText(attribution);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (variant === 'advanced') {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Advanced Attribution Generator</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Advanced options and metadata fields */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Advanced Features</h3>
            <p className="text-blue-800 text-sm">Generate attribution with detailed metadata, copyright information, and multiple format options.</p>
          </div>
          
          {/* Rest of advanced form... */}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Sample Attribution Generator</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Track Information */}
        <div>
          <h3 className="text-lg font-medium mb-4">Your Track Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Track Title
              </label>
              <input
                type="text"
                value={trackInfo.trackTitle}
                onChange={(e) => updateTrackInfo('trackTitle', e.target.value)}
                placeholder="Enter track title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artist Name
              </label>
              <input
                type="text"
                value={trackInfo.artistName}
                onChange={(e) => updateTrackInfo('artistName', e.target.value)}
                placeholder="Enter artist name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Samples Information */}
        <div>
          <h3 className="text-lg font-medium mb-4">Sample Information</h3>
          {samples.map((sample, index) => (
            <div key={sample.id} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Sample {index + 1}</h4>
                {samples.length > 1 && (
                  <button
                    onClick={() => removeSample(sample.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sample Title *
                  </label>
                  <input
                    type="text"
                    value={sample.name}
                    onChange={(e) => updateSample(sample.id, 'name', e.target.value)}
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
                    value={sample.artist}
                    onChange={(e) => updateSample(sample.id, 'artist', e.target.value)}
                    placeholder="e.g., Miles Davis"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Album
                  </label>
                  <input
                    type="text"
                    value={sample.album}
                    onChange={(e) => updateSample(sample.id, 'album', e.target.value)}
                    placeholder="Album name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <input
                    type="text"
                    value={sample.year}
                    onChange={(e) => updateSample(sample.id, 'year', e.target.value)}
                    placeholder="1959"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Record Label
                  </label>
                  <input
                    type="text"
                    value={sample.label}
                    onChange={(e) => updateSample(sample.id, 'label', e.target.value)}
                    placeholder="Columbia Records"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Writers/Composers
                  </label>
                  <input
                    type="text"
                    value={sample.writers}
                    onChange={(e) => updateSample(sample.id, 'writers', e.target.value)}
                    placeholder="Comma-separated names"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button
            onClick={addSample}
            className="btn-secondary flex items-center space-x-2"
          >
            <span>Add Another Sample</span>
          </button>
        </div>

        {/* Format Selection */}
        <div>
          <h3 className="text-lg font-medium mb-4">Attribution Format</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="standard"
                checked={format === 'standard'}
                onChange={(e) => setFormat(e.target.value)}
                className="text-primary"
              />
              <span className="font-medium">Standard</span>
            </label>
            <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="liner-notes"
                checked={format === 'liner-notes'}
                onChange={(e) => setFormat(e.target.value)}
                className="text-primary"
              />
              <span className="font-medium">Liner Notes</span>
            </label>
            <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="json"
                checked={format === 'json'}
                onChange={(e) => setFormat(e.target.value)}
                className="text-primary"
              />
              <span className="font-medium">JSON</span>
            </label>
          </div>
        </div>

        {/* Generated Attribution */}
        <div>
          <h3 className="text-lg font-medium mb-4">Generated Attribution</h3>
          <div className="bg-gray-50 border border-gray-300 rounded-md p-4 min-h-[200px]">
            <pre className="text-sm text-gray-900 whitespace-pre-wrap font-mono">
              {generateAttribution()}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
          <button
            onClick={copyToClipboard}
            className="btn-primary flex items-center space-x-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Attribution'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttributionGenerator;