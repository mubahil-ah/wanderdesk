import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Calendar, Heart, Settings, LogOut } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { userProfile, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Bookings', href: '/dashboard/bookings', icon: Calendar },
    { name: 'Saved Spaces', href: '/dashboard/saved', icon: Heart },
    { name: 'Profile Settings', href: '/dashboard/profile', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-40 flex justify-around p-3">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center p-2 rounded-lg ${isActive(item.href) ? 'text-primary-600' : 'text-gray-500'}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-medium mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            {userProfile?.profilePicture ? (
              <img src={userProfile.profilePicture} alt="Profile" className="w-12 h-12 rounded-full border border-gray-200 object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl">
                {userProfile?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="font-semibold text-gray-900 truncate">{userProfile?.name}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">{userProfile?.role}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive(item.href) 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive(item.href) ? 'text-primary-600' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-gray-200">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-8 pb-24 md:pb-8 w-full max-w-5xl mx-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
