import mongoose from 'mongoose';

const deskTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Hot Desk', 'Dedicated Desk', 'Private Cabin', 'Meeting Room', 'Podcast Room', 'Event Space', 'Phone Booth'],
    required: true,
  },
  pricePerHour: { type: Number },
  pricePerDay: { type: Number },
  pricePerMonth: { type: Number },
  capacity: { type: Number, required: true },
  availableQty: { type: Number, required: true },
});

const spaceSchema = new mongoose.Schema(
  {
    operatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    spaceType: {
      type: String,
      enum: ['Coworking', 'Private Office', 'Meeting Room', 'Podcast Studio', 'Event Space'],
      default: 'Coworking',
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    images: [{ type: String }],
    amenities: [{ type: String }],
    deskTypes: [deskTypeSchema],
    pricing: {
      hourly: { type: Number, default: 0 },
      daily: { type: Number, default: 0 },
      monthly: { type: Number, default: 0 },
    },
    bookingType: {
      type: String,
      enum: ['Instant', 'Request'],
      default: 'Instant',
    },
    operatingHours: {
      open: { type: String, required: true },
      close: { type: String, required: true },
      daysOpen: [{ type: String }],
    },
    capacity: {
      total: { type: Number, default: 0 },
      meetingRooms: { type: Number, default: 0 },
      privateCabins: { type: Number, default: 0 },
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending_approval', 'active', 'rejected'],
      default: 'pending_approval',
    },
    // Keep isActive for backward compat
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

spaceSchema.index({ location: '2dsphere' });
spaceSchema.index({ 'address.city': 'text', 'address.street': 'text', name: 'text' });

// Auto-set isActive based on status
spaceSchema.pre('save', function (next) {
  this.isActive = this.status === 'active';
  next();
});

const Space = mongoose.model('Space', spaceSchema);
export default Space;
