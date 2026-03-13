import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Building2, Calendar, DollarSign, Plus, MapPin, Clock, Eye, Edit, XCircle } from 'lucide-react';
import axios from 'axios';

const OperatorDashboard = () => {
  const { userProfile } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/spaces/my-spaces');
        setSpaces(res.data);
      } catch (error) {
        console.error('Error fetching spaces:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpaces();
  }, []);

  const statusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-700 border-green-200',
      pending_approval: 'bg-amber-100 text-amber-700 border-amber-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
    };
    const labels = {
      active: 'Active',
      pending_approval: 'Pending Approval',
      rejected: 'Rejected',
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${styles[status] || 'bg-gray-100'}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {userProfile?.name?.split(' ')[0]}! 🏢</h1>
              <p className="text-gray-500 mt-2 text-lg">Manage your coworking spaces and bookings.</p>
            </div>
            <Link
              to="/operator/spaces/new"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Add New Space
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-primary-50 p-6 rounded-xl border border-primary-100">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-5 h-5 text-primary-600" />
                <p className="text-sm font-medium text-primary-800">Total Listings</p>
              </div>
              <p className="text-3xl font-bold text-primary-900">{spaces.length}</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <p className="text-sm font-medium text-blue-800">Total Bookings</p>
              </div>
              <p className="text-3xl font-bold text-blue-900">0</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <p className="text-sm font-medium text-green-800">Total Revenue</p>
              </div>
              <p className="text-3xl font-bold text-green-900">₹0</p>
            </div>
          </div>
        </div>

        {/* My Spaces */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Spaces</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : spaces.length > 0 ? (
            <div className="space-y-4">
              {spaces.map((space) => (
                <div key={space._id} className="flex flex-col sm:flex-row gap-4 p-5 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                  <div className="w-full sm:w-36 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {space.images?.[0] ? (
                      <img src={space.images[0]} alt={space.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Building2 className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{space.name}</h3>
                        <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                          <MapPin className="w-4 h-4" /> {space.address?.city}, {space.address?.state}
                        </div>
                      </div>
                      {statusBadge(space.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {space.operatingHours?.open} - {space.operatingHours?.close}</span>
                      <span>₹{space.pricing?.daily || 0}/day</span>
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 sm:justify-center border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-4">
                    <button className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" /> View
                    </button>
                    <button className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-900 font-medium text-lg">No spaces listed yet</h3>
              <p className="text-gray-500 text-sm mt-1 mb-6">Start by adding your first coworking space.</p>
              <Link
                to="/operator/spaces/new"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 shadow-sm transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add New Space
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OperatorDashboard;
