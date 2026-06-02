import {
  model,
  models,
  Schema,
  Document,
  type Model,
  type Types,
} from "mongoose";

import Event from "./event.model";

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => EMAIL_PATTERN.test(value),
        message: "Invalid email format.",
      },
    },
  },
  {
    timestamps: true,
  },
);


// Ensure every booking references a real event and stores a normalized email.
bookingSchema.pre("save", async function (next) {
  try {
    const doc = this as IBooking;

    if (doc.isModified("email")) {
      doc.email = doc.email.trim().toLowerCase();
      if (!EMAIL_PATTERN.test(doc.email)) {
        throw new Error("Invalid email format.");
      }
    }

    if (doc.isModified("eventId") || doc.isNew) {
      const eventExists = await Event.exists({ _id: doc.eventId });
      if (!eventExists) {
        throw new Error("Referenced event does not exist.");
      }
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

const BookingModel =
  (models.Booking as Model<IBooking> | undefined) ??
  model<IBooking>("Booking", bookingSchema);

export default BookingModel;
export { BookingModel as Booking };
