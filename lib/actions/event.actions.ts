"use server";

import { Event, IEvent } from "@/database";
import connectDB from "@/lib/mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await connectDB();

    const event = await Event.findOne({ slug }).lean<IEvent>().exec();

    if (!event) {
      return [];
    }

    return await Event.find(
      {
        _id: { $ne: event._id },
        tags: { $in: event.tags },
      },
      { _id: 0 },
    ).lean<Omit<IEvent, "_id">[]>();
  } catch (error) {
    console.error("Error fetching similar events:", error);
    return [];
  }
};
