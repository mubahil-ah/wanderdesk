import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Building2, Calendar, DollarSign, Clock, Check, X, Eye, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const TABS = ['Overview', 'Operator Applications', 'Manage Spaces', 'All Bookings'];

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spaceFilter, setSpaceFilter] = useState('');
  const [appFilter, setAppFilter] = useState('pending');

  const getHeaders = async () => {
    const token = await currentUser.getIdToken();
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = await getHeaders();
        const [statsRes, appsRes, spacesRes, bookingsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/stats', { headers }),
          axios.get(`http://localhost:5000/api/admin/applications?status=${appFilter}`, { headers }),
          axios.get(`http://localhost:5000/api/admin/spaces${spaceFilter ? `?status=${spaceFilter}` : ''}`, { headers }),
          axios.get('http://localhost:5000/api/admin/bookings', { headers }),
        ]);
        setStats(statsRes.data);
        setApplications(appsRes.data);
        setSpaces(spacesRes.data);
        setBookings(bookingsRes.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [appFilter, spaceFilter]);

  const handleApproveApp = async (id) => {
    try {
      const headers = await getHeaders();
      await axios.put(`http://localhost:5000/api/admin/applications/${id}/approve`, {}, { headers });
      setApplications(applications.filter(a => a._id !== id));
      toast.success('Application approved! User is now an operator.');
    } catch (error) {
      toast.error('Failed to approve');
    }
  };

  const handleRejectApp = async (id) => {
    try {
      const headers = await getHeaders();
      await axios.put(`http://localhost:5000/api/admin/applications/${id}/reject`, {}, { headers });
      setApplications(applications.filter(a => a._id !== id));
      toast.success('Application rejected.');
    } catch (error) {
      toast.error('Failed to reject');
    }
  };

  const handleApproveSpace = async (id) => {
    try {
      const headers = await getHeaders();
      await axios.put(`http://localhost:5000/api/admin/spaces/${id}/approve`, {}, { headers });
      setSpaces(spaces.map(s => s._id === id ? { ...s, status: 'active' } : s));
      toast.success('Space approved and live!');
    } catch (error) {
      toast.error('Failed to approve space');
    }
  };

  const handleRejectSpace = async (id) => {
    try {
      const headers = await getHeaders();
      await axios.put(`http://localhost:5000/api/admin/spaces/${id}/reject`, {}, { headers });
      setSpaces(spaces.map(s => s._id === id ? { ...s, status: 'rejected' } : s));
      toast.success('Space rejected.');
    } catch (error) {
      toast.error('Failed to reject space');
    }
  };

  const statusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      pending: 'bg-amber-100 text-amber-700',
      pending_approval: 'bg-amber-100 text-amber-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      confirmed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      completed: 'bg-blue-100 text-blue-700',
    };
    return <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${styles[status] || 'bg-gray-100'}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 mt-1">Manage users, operators, spaces, and bookings.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white p-1.5 rounded-xl border border-gray-200 overflow-x-auto">
          {TABS.map((label, i) => (
            <button key={i} onClick={() => setTab(i)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                tab === i ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
              }`}>{label}</button>
          ))}
        </div>

        {/* Tab: Overview */}
        {tab === 0 && stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Total Users', value: stats.userCount, icon: Users, color: 'bg-blue-50 text-blue-600 border-blue-100' },
              { label: 'Active Spaces', value: stats.spaceCount, icon: Building2, color: 'bg-green-50 text-green-600 border-green-100' },
              { label: 'Total Bookings', value: stats.bookingCount, icon: Calendar, color: 'bg-purple-50 text-purple-600 border-purple-100' },
              { label: 'Revenue', value: `₹${stats.totalRevenue}`, icon: DollarSign, color: 'bg-amber-50 text-amber-600 border-amber-100' },
              { label: 'Pending Apps', value: stats.pendingApps, icon: Clock, color: 'bg-orange-50 text-orange-600 border-orange-100' },
              { label: 'Pending Spaces', value: stats.pendingSpaces, icon: Building2, color: 'bg-rose-50 text-rose-600 border-rose-100' },
            ].map((stat, i) => (
              <div key={i} className={`p-5 rounded-xl border ${stat.color}`}>
                <stat.icon className="w-5 h-5 mb-2" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs font-medium mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Operator Applications */}
        {tab === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Operator Applications</h2>
              <select value={appFilter} onChange={e => setAppFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            {applications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No {appFilter} applications.</p>
            ) : (
              <div className="space-y-4">
                {applications.map(app => (
                  <div key={app._id} className="flex flex-col md:flex-row md:items-center gap-4 p-5 border border-gray-100 rounded-xl">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-gray-900">{app.fullName}</h3>
                        {statusBadge(app.status)}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        <strong>{app.businessName}</strong> · {app.city} · {app.phone}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{app.description}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Email: {app.userId?.email} · Applied: {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {app.status === 'pending' && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => handleApproveApp(app._id)}
                          className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                          <Check className="w-4 h-4" /> Approve
                        </button>
                        <button onClick={() => handleRejectApp(app._id)}
                          className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">
                          <X className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Manage Spaces */}
        {tab === 2 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">All Spaces</h2>
              <select value={spaceFilter} onChange={e => setSpaceFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                <option value="">All</option>
                <option value="pending_approval">Pending</option>
                <option value="active">Active</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            {spaces.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No spaces found.</p>
            ) : (
              <div className="space-y-4">
                {spaces.map(space => (
                  <div key={space._id} className="flex flex-col md:flex-row md:items-center gap-4 p-5 border border-gray-100 rounded-xl">
                    <div className="w-full md:w-28 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {space.images?.[0] ? (
                        <img src={space.images[0]} alt={space.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Building2 className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-gray-900">{space.name}</h3>
                        {statusBadge(space.status)}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {space.address?.city}, {space.address?.state} · Operator: {space.operatorId?.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Listed: {new Date(space.createdAt).toLocaleDateString()} · Amenities: {space.amenities?.length || 0}
                      </p>
                    </div>
                    {space.status === 'pending_approval' && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => handleApproveSpace(space._id)}
                          className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                          <Check className="w-4 h-4" /> Approve
                        </button>
                        <button onClick={() => handleRejectSpace(space._id)}
                          className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">
                          <X className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: All Bookings */}
        {tab === 3 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">All Bookings</h2>
            {bookings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No bookings yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-gray-500">
                      <th className="pb-3 font-medium">User</th>
                      <th className="pb-3 font-medium">Space</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
                      <tr key={booking._id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-4">{booking.user?.name || 'N/A'}</td>
                        <td className="py-4">{booking.space?.name || 'N/A'}</td>
                        <td className="py-4">{new Date(booking.date).toLocaleDateString()}</td>
                        <td className="py-4 font-medium">₹{booking.totalAmount}</td>
                        <td className="py-4">{statusBadge(booking.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
