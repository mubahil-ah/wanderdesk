import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, Heart } from 'lucide-react';

const Dashboard = () => {
  const { userProfile } = useAuth();
  
  // Dummy data for visual representation until API is fully wired
  const upcomingBookings = [
    { id: 1, spaceName: 'The Hive Coworking', date: 'Oct 15, 2023', time: '09:00 AM - 05:00 PM', status: 'Confirmed', image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?q=80&w=200&auto=format&fit=crop' },
  ];
  
  const pastBookings = [];

  const savedSpaces = [
    { id: 101, name: 'WeWork Galaxy', location: 'Bangalore, India', price: '$15/day', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=200&auto=format&fit=crop' }
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Header */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userProfile?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-gray-500 mt-2 text-lg">Ready for another productive day?</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-primary-50 p-6 rounded-xl border border-primary-100">
            <p className="text-sm font-medium text-primary-800 mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-primary-900">12</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <p className="text-sm font-medium text-blue-800 mb-1">Upcoming</p>
            <p className="text-3xl font-bold text-blue-900">{upcomingBookings.length}</p>
          </div>
          <div className="bg-rose-50 p-6 rounded-xl border border-rose-100">
            <p className="text-sm font-medium text-rose-800 mb-1">Saved Spaces</p>
            <p className="text-3xl font-bold text-rose-900">{savedSpaces.length}</p>
          </div>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Upcoming Bookings</h2>
        </div>
        
        {upcomingBookings.length > 0 ? (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-white">
                <img src={booking.image} alt={booking.spaceName} className="w-full sm:w-32 h-24 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-gray-900">{booking.spaceName}</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">{booking.status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                    <Calendar className="w-4 h-4" /> {booking.date}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                    <Clock className="w-4 h-4" /> {booking.time}
                  </div>
                </div>
                <div className="flex sm:flex-col justify-end gap-2 mt-4 sm:mt-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100">
                  <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 w-full sm:w-auto">View Details</button>
                  <button className="px-4 py-2 bg-white border border-rose-200 text-rose-600 text-sm font-medium rounded-lg hover:bg-rose-50 w-full sm:w-auto">Cancel</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <Calendar className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-gray-900 font-medium">No upcoming bookings</h3>
            <p className="text-gray-500 text-sm mt-1 mb-4">You have no spaces booked for the future.</p>
            <button className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 shadow-sm transition-colors">Find a Space</button>
          </div>
        )}
      </div>

      {/* Past Bookings */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Past Bookings</h2>
        </div>
        
        {pastBookings.length > 0 ? (
          <div className="space-y-4">
             {/* Map over past bookings here */}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 text-sm rounded-xl">
            You don't have any past bookings yet.
          </div>
        )}
      </div>

      {/* Saved Spaces */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Saved Spaces</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedSpaces.map((space) => (
            <div key={space.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all group">
              <div className="h-40 overflow-hidden relative">
                <img src={space.image} alt={space.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur rounded-full text-rose-500 hover:text-rose-600 hover:bg-white transition-colors shadow-sm">
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-bold text-gray-900">{space.name}</h3>
                <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                  <MapPin className="w-4 h-4" /> {space.location}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-bold text-primary-600">{space.price}</span>
                  <button className="text-sm font-medium bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors">Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
