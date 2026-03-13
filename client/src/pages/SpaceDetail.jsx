import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MapPin, Star, Building, CheckCircle, Clock } from 'lucide-react';

const SpaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Booking State
  const [selectedDesk, setSelectedDesk] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [seats, setSeats] = useState(1);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/spaces/${id}`);
        setSpace(data);
        if (data.deskTypes && data.deskTypes.length > 0) {
          setSelectedDesk(data.deskTypes[0]._id);
        }
      } catch (error) {
        toast.error('Failed to load space details');
      } finally {
        setLoading(false);
      }
    };
    fetchSpace();
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      toast.info('Please login to book a space');
      navigate('/login');
      return;
    }

    if (!bookingDate) {
      toast.error('Please select a date');
      return;
    }

    const desk = space.deskTypes.find(d => d._id === selectedDesk);
    if (!desk) return;

    const totalAmount = (desk.pricePerDay || desk.pricePerHour * 8) * seats;

    try {
      const { data } = await axios.post('http://localhost:5000/api/bookings', {
        spaceId: space._id,
        deskType: desk.type,
        date: bookingDate,
        numberOfSeats: seats,
        totalAmount
      });
      toast.success('Booking request created!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create booking');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading space details...</div>;
  if (!space) return <div className="p-8 text-center text-red-500">Space not found</div>;

  const currentDesk = space.deskTypes?.find(d => d._id === selectedDesk);
  const estimatedTotal = currentDesk ? (currentDesk.pricePerDay || currentDesk.pricePerHour * 8) * seats : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 border-b pb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{space.name}</h1>
        <div className="flex items-center text-sm text-gray-600 gap-4">
          <span className="flex items-center"><MapPin className="w-4 h-4 mr-1"/> {space.address.street}, {space.address.city}</span>
          <span className="flex items-center text-yellow-600 font-medium"><Star className="w-4 h-4 fill-current mr-1"/> {space.averageRating ? space.averageRating.toFixed(1) : 'New'} ({space.numReviews} reviews)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Images */}
          <div className="h-[400px] bg-gray-200 rounded-2xl overflow-hidden relative">
            {space.images && space.images.length > 0 ? (
              <img src={space.images[0]} alt={space.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Building className="w-16 h-16 opacity-50 mb-2" />
              </div>
            )}
          </div>

          <section>
            <h2 className="text-2xl font-bold mb-4">About this space</h2>
            <p className="text-gray-700 leading-relaxed">{space.description}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {space.amenities?.map((item, idx) => (
                <div key={idx} className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-primary-500 mr-2" />
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Booking Widget */}
        <div className="lg:col-span-1">
          <div className="bg-white border text-gray-900 border-gray-200 rounded-2xl p-6 shadow-xl sticky top-24">
            <h3 className="text-xl font-bold mb-4 border-b pb-4">Book your space</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Space Type</label>
                <select 
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={selectedDesk}
                  onChange={(e) => setSelectedDesk(e.target.value)}
                >
                  {space.deskTypes?.map(desk => (
                    <option key={desk._id} value={desk._id}>
                      {desk.type} - ₹{desk.pricePerDay}/day
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Seats</label>
                <input 
                  type="number" 
                  min="1"
                  max={currentDesk?.availableQty || 1}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                />
              </div>

              <div className="pt-4 border-t mt-4">
                <div className="flex justify-between font-medium mb-2 text-gray-600">
                  <span>Price per seat</span>
                  <span>₹{currentDesk?.pricePerDay || 0}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span>₹{estimatedTotal}</span>
                </div>
              </div>

              <button 
                onClick={handleBooking}
                className="w-full mt-4 bg-primary-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-primary-700 transition-colors shadow-lg"
              >
                {space.bookingType === 'Instant' ? 'Book Instantly' : 'Request to Book'}
              </button>
              
              <p className="text-center text-xs text-gray-500 mt-3 pt-2">
                <Clock className="inline w-3 h-3 mr-1" />
                {space.bookingType === 'Instant' ? 'Confirmed immediately' : 'Requires host approval'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceDetail;
