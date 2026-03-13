import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Users, Star, Filter, Map as MapIcon, Grid } from 'lucide-react';

const SearchSpaces = () => {
  const [searchParams] = useSearchParams();
  const cityQuery = searchParams.get('city') || '';
  const categoryQuery = searchParams.get('category') || '';
  
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

  useEffect(() => {
    const fetchSpaces = async () => {
      setLoading(true);
      try {
        let qs = '';
        if (cityQuery) qs += `city=${cityQuery}&`;
        if (categoryQuery) qs += `category=${categoryQuery}`;
        
        const { data } = await axios.get(`http://localhost:5000/api/spaces?${qs}`);
        setSpaces(data);
      } catch (error) {
        console.error('Error fetching spaces', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpaces();
  }, [cityQuery, categoryQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold flex items-center mb-4"><Filter className="w-5 h-5 mr-2"/> Filters</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (Daily)</label>
              <input type="range" className="w-full accent-primary-600" min="0" max="5000" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Space Type</label>
              {['Hot Desk', 'Dedicated Desk', 'Private Cabin', 'Meeting Room'].map(type => (
                <label key={type} className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                  <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500" />
                  <span>{type}</span>
                </label>
              ))}
            </div>

            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-lg transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {spaces.length} spaces {cityQuery ? `in ${cityQuery}` : 'available'}
          </h2>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md flex items-center text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Grid className="w-4 h-4 mr-1"/> Grid
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-md flex items-center text-sm font-medium transition-colors ${viewMode === 'map' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <MapIcon className="w-4 h-4 mr-1"/> Map
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="bg-gray-200 h-80 rounded-xl"></div>
            ))}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map(space => (
              <Link to={`/space/${space._id}`} key={space._id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  {space.images && space.images.length > 0 ? (
                    <img src={space.images[0]} alt={space.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex justify-center items-center text-gray-400">No Image</div>
                  )}
                  <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg text-xs font-bold text-gray-900 shadow">
                    ₹{space.deskTypes?.[0]?.pricePerDay || 'N/A'} / day
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 truncate mb-1">{space.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{space.address.city}, {space.address.state}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-yellow-500 font-medium">
                      <Star className="w-4 h-4 fill-current mr-1" />
                      {space.averageRating ? space.averageRating.toFixed(1) : 'New'} 
                      <span className="text-gray-400 font-normal ml-1">({space.numReviews})</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-1"/>
                      {space.deskTypes?.reduce((acc, curr) => acc + curr.capacity, 0) || 0} seats
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-200 h-[600px] rounded-xl flex items-center justify-center border border-gray-300">
             <div className="text-center p-6">
               <MapIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
               <p className="text-gray-600 font-medium text-lg">Map view integration ready.</p>
               <p className="text-gray-500 text-sm">Requires Google Maps/Mapbox API Key configuration.</p>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchSpaces;
