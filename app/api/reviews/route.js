import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import Review from '../../../models/review';

// GET: Fetches all approved reviews for the homepage carousel
export async function GET() {
  try {
    await connectToDatabase();
    // Sorts by newest first
    const reviews = await Review.find({ status: 'Approved' }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, reviews }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST: Saves a newly submitted review from the public form
export async function POST(request) {
  try {
    await connectToDatabase();
    const { name, rating, text } = await request.json();

    if (!name || !rating || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newReview = await Review.create({ name, rating, text });
    return NextResponse.json({ success: true, review: newReview }, { status: 200 });

  } catch (error) {
    console.error("Review save error:", error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}