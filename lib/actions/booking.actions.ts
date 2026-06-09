"use server";

import { Booking } from "@/database";
import connectDB from "@/lib/mongodb";

export const createBooking = async ({
  eventId,
  email,
}: {
  eventId: string;
  email: string;
}) => {
  try {
    await connectDB();
    const bookingDoc = await Booking.create({ eventId, email });

    return { success: true as const, bookingId: bookingDoc._id.toString() };
  } catch (error) {
    console.error("Error creating booking:", error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
