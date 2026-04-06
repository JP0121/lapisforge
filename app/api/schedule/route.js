import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import Schedule from '../../../models/schedule';

export async function GET() {
  try {
    await connectToDatabase();
    
    // 1. Get current date and time locked to Michigan (Eastern Time)
    const now = new Date();
    const options = { timeZone: 'America/New_York' };
    const formatterDate = new Intl.DateTimeFormat('en-CA', { ...options, year: 'numeric', month: '2-digit', day: '2-digit' });
    const formatterTime = new Intl.DateTimeFormat('en-US', { ...options, hour: 'numeric', minute: '2-digit', hour12: false });

    const formattedToday = formatterDate.format(now); // "YYYY-MM-DD"
    const currentTimeStr = formatterTime.format(now); // "HH:MM" (24-hour)
    const [currentHour, currentMinute] = currentTimeStr.split(':').map(Number);
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // 2. Auto-Janitor: Delete all schedules strictly from past dates
    await Schedule.deleteMany({ date: { $lt: formattedToday } });

    // 3. Fetch schedules for today and the future
    let schedules = await Schedule.find({ 
      date: { $gte: formattedToday },
      timeSlots: { $not: { $size: 0 } } 
    }).sort({ date: 1 });
    
    // 4. If any schedule is for TODAY, filter out past times
    schedules = schedules.map(schedule => {
      if (schedule.date === formattedToday) {
        const validTimes = schedule.timeSlots.filter(timeStr => {
          const [time, modifier] = timeStr.split(' ');
          let [hours, minutes] = time.split(':');
          hours = parseInt(hours, 10);
          minutes = parseInt(minutes, 10);
          if (hours === 12) hours = 0;
          if (modifier === 'PM') hours += 12;
          
          const slotTimeInMinutes = hours * 60 + minutes;
          
          return slotTimeInMinutes > (currentTimeInMinutes + 60);
        });
        
        schedule.timeSlots = validTimes;
      }
      return schedule;
    }).filter(schedule => schedule.timeSlots.length > 0); 
    
    return NextResponse.json({ success: true, schedules }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
  }
}