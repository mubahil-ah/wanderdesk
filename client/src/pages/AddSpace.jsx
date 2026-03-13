import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, Check, Building2, MapPin, Clock, Wifi, Car, Coffee, Printer, Lock,
  Monitor, Phone, Mic, Users, Presentation, PenTool, Armchair, Sun, Upload, X, IndianRupee, Image } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const AMENITIES = [
  { id: 'WiFi', icon: Wifi, label: 'WiFi' },
  { id: 'AC', icon: Sun, label: 'Air Conditioning' },
  { id: 'Parking', icon: Car, label: 'Parking' },
  { id: 'Cafeteria', icon: Coffee, label: 'Cafeteria' },
  { id: 'Printer', icon: Printer, label: 'Printer' },
  { id: 'Locker', icon: Lock, label: 'Locker' },
  { id: '24/7 Access', icon: Clock, label: '24/7 Access' },
  { id: 'Standing Desk', icon: Armchair, label: 'Standing Desk' },
  { id: 'Phone Booth', icon: Phone, label: 'Phone Booth' },
  { id: 'Podcast Room', icon: Mic, label: 'Podcast Room' },
  { id: 'Meeting Room', icon: Users, label: 'Meeting Room' },
  { id: 'Projector', icon: Presentation, label: 'Projector' },
  { id: 'Whiteboard', icon: PenTool, label: 'Whiteboard' },
  { id: 'Reception', icon: Monitor, label: 'Reception' },
];

const STEPS = ['Basic Info', 'Amenities & Capacity', 'Pricing', 'Photos', 'Review & Submit'];

const AddSpace = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    spaceType: 'Coworking',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    longitude: 72.8777,
    latitude: 19.0760,
    openTime: '09:00',
    closeTime: '18:00',
    daysOpen: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    amenities: [],
    totalCapacity: 50,
    meetingRooms: 2,
    privateCabins: 5,
    hourlyRate: 200,
    dailyRate: 800,
    monthlyRate: 12000,
    bookingType: 'Instant',
    images: [],
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({ ...formData, [name]: type === 'number' ? Number(value) : value });
  };

  const toggleAmenity = (id) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter(a => a !== id)
        : [...prev.amenities, id],
    }));
  };

  const toggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      daysOpen: prev.daysOpen.includes(day)
        ? prev.daysOpen.filter(d => d !== day)
        : [...prev.daysOpen, day],
    }));
  };

  const addImageUrl = () => {
    const url = prompt('Enter image URL (from Unsplash or similar):');
    if (url) {
      setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 0: return formData.name && formData.description && formData.city && formData.street && formData.state;
      case 1: return formData.amenities.length > 0;
      case 2: return formData.hourlyRate > 0 || formData.dailyRate > 0;
      case 3: return true; // Photos optional
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await currentUser.getIdToken();
      const payload = {
        name: formData.name,
        description: formData.description,
        spaceType: formData.spaceType,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        location: {
          type: 'Point',
          coordinates: [formData.longitude, formData.latitude],
        },
        operatingHours: {
          open: formData.openTime,
          close: formData.closeTime,
          daysOpen: formData.daysOpen,
        },
        amenities: formData.amenities,
        capacity: {
          total: formData.totalCapacity,
          meetingRooms: formData.meetingRooms,
          privateCabins: formData.privateCabins,
        },
        pricing: {
          hourly: formData.hourlyRate,
          daily: formData.dailyRate,
          monthly: formData.monthlyRate,
        },
        bookingType: formData.bookingType,
        images: formData.images,
        deskTypes: [
          {
            type: 'Hot Desk',
            pricePerHour: formData.hourlyRate,
            pricePerDay: formData.dailyRate,
            pricePerMonth: formData.monthlyRate,
            capacity: formData.totalCapacity,
            availableQty: formData.totalCapacity,
          },
        ],
      };

      await axios.post('http://localhost:5000/api/spaces', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Space submitted for review! Admin will approve it shortly.');
      navigate('/operator/dashboard');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to create space');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Space Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="e.g. The Hive Coworking" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
                placeholder="Describe your space — atmosphere, facilities, ideal for..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Space Type</label>
              <select name="spaceType" value={formData.spaceType} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white">
                {['Coworking', 'Private Office', 'Meeting Room', 'Podcast Studio', 'Event Space'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address *</label>
                <input type="text" name="street" value={formData.street} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="123 MG Road" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Mumbai" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">State *</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Maharashtra" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">ZIP Code</label>
                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="400001" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Opening Time</label>
                <input type="time" name="openTime" value={formData.openTime} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Closing Time</label>
                <input type="time" name="closeTime" value={formData.closeTime} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Days Open</label>
              <div className="flex flex-wrap gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <button key={day} type="button" onClick={() => toggleDay(day)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      formData.daysOpen.includes(day)
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Amenities *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {AMENITIES.map(({ id, icon: Icon, label }) => (
                  <button key={id} type="button" onClick={() => toggleAmenity(id)}
                    className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all border ${
                      formData.amenities.includes(id)
                        ? 'bg-primary-50 border-primary-300 text-primary-700 shadow-sm'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>
                    <Icon className="w-4 h-4" /> {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Capacity</label>
                <input type="number" name="totalCapacity" value={formData.totalCapacity} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Meeting Rooms</label>
                <input type="number" name="meetingRooms" value={formData.meetingRooms} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Private Cabins</label>
                <input type="number" name="privateCabins" value={formData.privateCabins} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Hourly Rate</label>
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-4 h-4 text-gray-500" />
                  <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white" />
                </div>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                <label className="block text-sm font-medium text-blue-800 mb-1.5">Daily Rate</label>
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-4 h-4 text-blue-500" />
                  <input type="number" name="dailyRate" value={formData.dailyRate} onChange={handleChange}
                    className="w-full px-3 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white" />
                </div>
              </div>
              <div className="bg-green-50 p-5 rounded-xl border border-green-200">
                <label className="block text-sm font-medium text-green-800 mb-1.5">Monthly Rate</label>
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-4 h-4 text-green-500" />
                  <input type="number" name="monthlyRate" value={formData.monthlyRate} onChange={handleChange}
                    className="w-full px-3 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Booking Type</label>
              <div className="flex gap-3">
                {['Instant', 'Request'].map(type => (
                  <button key={type} type="button" onClick={() => setFormData({ ...formData, bookingType: type })}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all border ${
                      formData.bookingType === type
                        ? 'bg-primary-50 border-primary-300 text-primary-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>
                    {type === 'Instant' ? '⚡ Instant Book' : '📋 Request to Book'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Photos ({formData.images.length}/10)</label>
              <button type="button" onClick={addImageUrl} disabled={formData.images.length >= 10}
                className="inline-flex items-center gap-1 px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50">
                <Upload className="w-4 h-4" /> Add Image URL
              </button>
            </div>
            {formData.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((url, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200">
                    <img src={url} alt={`Space ${i + 1}`} className="w-full h-36 object-cover" />
                    {i === 0 && (
                      <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">Cover</span>
                    )}
                    <button onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl py-16 text-center">
                <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No photos added yet. Click "Add Image URL" above.</p>
                <p className="text-gray-400 text-xs mt-1">Use URLs from Unsplash or your own hosting.</p>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900">Review Your Space</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Space Name</p>
                  <p className="text-lg font-semibold text-gray-900">{formData.name}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Type</p>
                  <p className="text-gray-900">{formData.spaceType}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Location</p>
                  <p className="text-gray-900">{formData.street}, {formData.city}, {formData.state}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Hours</p>
                  <p className="text-gray-900">{formData.openTime} — {formData.closeTime} ({formData.daysOpen.join(', ')})</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Pricing</p>
                  <p className="text-gray-900">₹{formData.hourlyRate}/hr · ₹{formData.dailyRate}/day · ₹{formData.monthlyRate}/month</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Capacity</p>
                  <p className="text-gray-900">{formData.totalCapacity} seats · {formData.meetingRooms} meeting rooms · {formData.privateCabins} cabins</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Amenities ({formData.amenities.length})</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {formData.amenities.map(a => (
                      <span key={a} className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded-md text-xs font-medium">{a}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Photos</p>
                  <p className="text-gray-900">{formData.images.length} uploaded</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Space</h1>
          <p className="text-gray-500 mt-1">Fill in the details to list your space on WanderDesk.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                i === step ? 'bg-primary-100 text-primary-700' :
                i < step ? 'text-green-700 bg-green-50' : 'text-gray-400'
              }`}>
                <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                  i < step ? 'bg-green-500 text-white' :
                  i === step ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {i < step ? <Check className="w-3 h-3" /> : i + 1}
                </span>
                <span className="hidden md:inline">{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className="w-6 md:w-12 h-px bg-gray-200 mx-1"></div>}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 font-medium disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" /> Previous
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm disabled:opacity-70"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <><Check className="w-5 h-5" /> Submit for Review</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSpace;
