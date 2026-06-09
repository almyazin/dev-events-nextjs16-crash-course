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
    const booking = (await Booking.create({ eventId, email })).toJSON();

    return { success: true, booking };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, error };
  }
};
