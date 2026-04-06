import mongoose from 'mongoose';

const ScheduleSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // e.g., "2026-04-10"
  timeSlots: [{ type: String }] // e.g., ["10:00 AM", "1:00 PM", "4:00 PM"]
});

export default mongoose.models.Schedule || mongoose.model('Schedule', ScheduleSchema);