import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  // NOTE: We default to 'Approved' so they show up instantly for your testing.
  // Later, we can change this to 'Pending' and add an approval button to your Admin Panel!
  status: { type: String, default: 'Pending' } 
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);