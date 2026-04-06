import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  // Customer & Device Info
  name: { type: String, required: true },
  email: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String },
  device: { type: String },
  modelNumber: { type: String },
  service: { type: String, required: true },
  message: { type: String },
  
  // Booking & Location Info
  bookingDate: { type: String, required: true },
  bookingTime: { type: String, required: true },
  locationType: { type: String, default: 'dropoff' }, // NEW
  address: { type: String },                          // NEW
  
  paymentStatus: { type: String, default: 'Pending' }, 
  stripeSessionId: { type: String }, 
  
  // Admin Tracking
  status: { type: String, default: 'New Request' }
}, { timestamps: true });

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);