import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Trash2, Camera, Bell, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';

const Profile = () => {
  const { userProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    phone: '',
    city: '',
    emailNotifications: true
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call to update profile
    setTimeout(() => {
      setSaving(false);
      toast.success('Profile settings updated successfully!');
    }, 1000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Member since just now';
    return `Member since ${new Date(dateString).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  };

  return (
    <div className="max-w-3xl animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-500 mt-2">Manage your account details and preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-500" /> Personal Information
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                {userProfile?.profilePicture ? (
                  <img src={userProfile.profilePicture} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-3xl shadow-sm">
                    {userProfile?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-200 text-gray-600 hover:text-primary-600 hover:border-primary-200 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{userProfile?.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{formatDate(userProfile?.createdAt)}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-gray-500" /> Account Details
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="flex items-center gap-3">
                <input 
                  type="email" 
                  disabled 
                  value={userProfile?.email || 'N/A'}
                  className="w-full max-w-md px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 outline-none"
                />
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Verified
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Your email is managed through your Google Provider.</p>
            </div>
            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200 capitalize">
                {userProfile?.role} Account
              </span>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-500" /> Preferences
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-500 mt-1">Receive booking confirmations, reminders, and offers updates.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.emailNotifications} 
                  onChange={(e) => setFormData({...formData, emailNotifications: e.target.checked})}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            
            <div className="border-t border-gray-100 pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred City</label>
              <p className="text-sm text-gray-500 mb-3">We'll use this city as the default when you search for spaces.</p>
              <div className="relative max-w-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Bangalore, Mumbai..."
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow-sm border border-rose-200 overflow-hidden">
          <div className="p-6 border-b border-rose-100 bg-rose-50/30">
            <h2 className="text-lg font-bold text-rose-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Danger Zone
            </h2>
          </div>
          <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Delete Account</h3>
              <p className="text-sm text-gray-500 mt-1">Permanently delete your account and all associated data.</p>
            </div>
            <button className="px-4 py-2 bg-white border border-rose-300 text-rose-600 font-medium rounded-lg hover:bg-rose-50 transition-colors whitespace-nowrap">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
