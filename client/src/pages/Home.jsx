import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Coffee, Users, Calendar } from 'lucide-react';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?city=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/search');
    }
  };

  const QuickFilter = ({ icon: Icon, label }) => (
    <button onClick={() => navigate(`/search?category=${encodeURIComponent(label)}`)} 
            className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all group">
      <div className="bg-primary-50 p-3 rounded-full mb-3 group-hover:bg-primary-100 transition-colors">
        <Icon className="w-6 h-6 text-primary-600" />
      </div>
      <span className="font-medium text-gray-800 text-sm">{label}</span>
    </button>
  );

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
        {/* Abstract Background - mimicking a beautiful office image placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 z-0">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-400 via-transparent to-transparent blur-2xl"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Find your space. <br/>
            <span className="text-primary-400">Do your best work.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Discover and book the perfect coworking spaces globally. From hot desks to private suites, we have what you need to focus and thrive.
          </p>

          <form onSubmit={handleSearch} className="mt-8 bg-white p-2 sm:p-3 rounded-full shadow-2xl flex flex-col sm:flex-row items-center max-w-2xl mx-auto gap-2">
            <div className="flex-grow flex items-center pl-4 pr-2 py-2 sm:py-0 w-full sm:w-auto">
              <MapPin className="w-5 h-5 text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search by city, area, or landmark..." 
                className="w-full bg-transparent border-none text-gray-800 focus:outline-none focus:ring-0 placeholder-gray-400 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-full px-8 py-4 sm:py-3 flex items-center justify-center transition-colors">
              <Search className="w-5 h-5 mr-2" />
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Category Quick Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <QuickFilter icon={Coffee} label="Hot Desk" />
          <QuickFilter icon={Users} label="Private Office" />
          <QuickFilter icon={Calendar} label="Meeting Room" />
          <QuickFilter icon={MapPin} label="Podcast Studio" />
          <QuickFilter icon={Users} label="Event Space" />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: '1', title: 'Find a Space', desc: 'Browse hundreds of spaces globally using intuitive filters.' },
              { step: '2', title: 'Book & Pay', desc: 'Reserve instantly and pay securely via Razorpay.' },
              { step: '3', title: 'Get to Work', desc: 'Show up, check in, and do your best work effortlessly.' }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 font-bold text-2xl flex items-center justify-center mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
