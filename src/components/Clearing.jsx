import { useState } from 'react';
import { Plus, Clock, CheckCircle, AlertCircle, Send, Eye } from 'lucide-react';
import ClearanceForm from './ClearanceForm';

const Clearing = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [clearanceRequests] = useState([
    {
      id: 1,
      sampleName: "Jazz Piano Loop",
      originalArtist: "Miles Davis",
      rightsHolder: "Miles Davis Estate",
      status: "pending",
      submittedDate: "2024-01-15",
      followUpDate: "2024-01-22",
      royaltyOffer: "15%",
      usageTerms: "Worldwide, 5 years",
      project: "Summer Vibes EP",
      contactEmail: "licensing@milesdavisestate.com",
      notes: "Initial contact sent, awaiting response"
    },
    {
      id: 2,
      sampleName: "Funk Bass Line",
      originalArtist: "James Brown",
      rightsHolder: "James Brown Music",
      status: "approved",
      submittedDate: "2024-01-10",
      approvedDate: "2024-01-18",
      royaltyRate: "20%",
      usageTerms: "Worldwide, perpetual",
      project: "Groove Session",
      contactEmail: "rights@jamesbrownmusic.com",
      notes: "Approved with standard terms"
    },
    {
      id: 3,
      sampleName: "Soul Vocals",
      originalArtist: "Aretha Franklin",
      rightsHolder: "Aretha Franklin Estate",
      status: "negotiating",
      submittedDate: "2024-01-12",
      lastContact: "2024-01-19",
      royaltyOffer: "25%",
      counterOffer: "30%",
      usageTerms: "North America only, 3 years",
      project: "Classic Revival",
      contactEmail: "licensing@arethafranklinestate.com",
      notes: "Negotiating royalty rate and territory"
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'negotiating':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'negotiating':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sample Clearance</h1>
          <p className="text-gray-600 mt-1">Manage your sample clearance requests</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Clearance Request</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">8</div>
          <div className="text-sm text-gray-600">Total Requests</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">3</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">4</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">1</div>
          <div className="text-sm text-gray-600">Negotiating</div>
        </div>
      </div>

      {/* Clearance Requests List */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Recent Clearance Requests</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 font-medium text-gray-700">Sample</th>
                <th className="text-left py-3 font-medium text-gray-700">Rights Holder</th>
                <th className="text-left py-3 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 font-medium text-gray-700">Royalty</th>
                <th className="text-left py-3 font-medium text-gray-700">Submitted</th>
                <th className="text-left py-3 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clearanceRequests.map((request) => (
                <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4">
                    <div>
                      <div className="font-medium text-gray-900">{request.sampleName}</div>
                      <div className="text-gray-500">{request.originalArtist}</div>
                    </div>
                  </td>
                  <td className="py-4">{request.rightsHolder}</td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(request.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 font-medium">
                    {request.royaltyRate || request.royaltyOffer}
                  </td>
                  <td className="py-4 text-gray-600">{request.submittedDate}</td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setSelectedRequest(request)}
                        className="text-primary hover:text-primary/80"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {request.status === 'pending' && (
                        <button className="text-blue-600 hover:text-blue-800">
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Clearance Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-modal max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ClearanceForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-modal max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Clearance Request Details</h2>
                <button 
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Sample Name</label>
                    <p className="text-gray-900">{selectedRequest.sampleName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Original Artist</label>
                    <p className="text-gray-900">{selectedRequest.originalArtist}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Rights Holder</label>
                    <p className="text-gray-900">{selectedRequest.rightsHolder}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Project</label>
                    <p className="text-gray-900">{selectedRequest.project}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Contact Email</label>
                    <p className="text-gray-900">{selectedRequest.contactEmail}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Usage Terms</label>
                  <p className="text-gray-900">{selectedRequest.usageTerms}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Notes</label>
                  <p className="text-gray-900">{selectedRequest.notes}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  onClick={() => setSelectedRequest(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
                {selectedRequest.status === 'pending' && (
                  <button className="btn-primary">
                    Send Follow-up
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clearing;