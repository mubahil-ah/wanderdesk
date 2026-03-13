import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, dbUser, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <MapPin className="h-8 w-8 text-primary-600" />
            <span className="font-bold text-xl text-gray-900 tracking-tight">WanderDesk</span>
          </Link>
          
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/search" className="text-gray-600 hover:text-primary-600 transition-colors">
              Find a Space
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user && dbUser ? (
              <div className="flex items-center gap-4">
                {/* Role-Specific Links */}
                {dbUser.role === 'admin' && (
                  <Link to="/admin" className="hidden sm:block text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100 hover:bg-rose-100 transition-colors">
                    Admin Panel
                  </Link>
                )}
                {dbUser.role === 'operator' && (
                  <Link to="/operator/dashboard" className="hidden sm:block text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                    My Dashboard
                  </Link>
                )}
                {dbUser.role === 'user' && (
                  <>
                    <Link to="/become-operator" className="hidden sm:block text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                      List Your Space
                    </Link>
                    <Link to="/dashboard" className="hidden sm:block text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                      My Bookings
                    </Link>
                  </>
                )}
                
                {/* Profile Badge */}
                <Link to={dbUser.role === 'admin' ? '/admin' : dbUser.role === 'operator' ? '/operator/dashboard' : '/dashboard'} className="flex items-center gap-2 text-gray-700 hover:text-primary-600 font-medium ml-2 pl-4 border-l border-gray-200">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
                  ) : (
                    <User className="w-8 h-8 p-1.5 bg-gray-100 rounded-full" />
                  )}
                </Link>
                <button 
                  onClick={() => logout()}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="hidden sm:block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  List Your Space
                </Link>
                <Link 
                  to="/login"
                  className="bg-primary-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm ml-2"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
