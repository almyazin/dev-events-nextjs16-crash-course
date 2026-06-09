import { model, models, Schema, Document, type Model } from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeDateToISO(value: string): string {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date format.");
  }
  return parsedDate.toISOString().split("T")[0]; // Return YYYY-MM-DD format
}

function normalizeTime(value: string): string {
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*([AaPp][Mm])?$/);

  if (!match) {
    throw new Error("Invalid time format. Use HH:mm or h:mm AM/PM.");
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2] ?? "0");
  const meridiem = match[3]?.toLowerCase();

  if (minutes < 0 || minutes > 59) {
    throw new Error("Invalid minutes in time value.");
  }

  if (meridiem) {
    if (hours < 1 || hours > 12) {
      throw new Error("Invalid hour in 12-hour time value.");
    }
    if (meridiem === "pm" && hours !== 12) {
      hours += 12;
    }
    if (meridiem === "am" && hours === 12) {
      hours = 0;
    }
  }

  if (!meridiem && (hours < 0 || hours > 23)) {
    throw new Error("Invalid hour in 24-hour time value.");
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function isNonEmptyString(value: string): boolean {
  return value.trim().length > 0;
}

function hasNonEmptyItems(values: string[]): boolean {
  return values.length > 0 && values.every((item) => item.trim().length > 0);
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Title is required.",
      },
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Description is required.",
      },
    },
    overview: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Overview is required.",
      },
    },
    image: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Image is required.",
      },
    },
    venue: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Venue is required.",
      },
    },
    location: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Location is required.",
      },
    },
    date: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Date is required.",
      },
    },
    time: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Time is required.",
      },
    },
    mode: {
      type: String,
      required: true,
      trim: true,
      enum: {
        values: ["online", "offline", "hybrid"],
        message: "Mode must be either online, offline, or hybrid",
      },
    },
    audience: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Audience is required.",
      },
    },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: hasNonEmptyItems,
        message: "Agenda is required and cannot contain empty items.",
      },
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Organizer is required.",
      },
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: hasNonEmptyItems,
        message: "Tags are required and cannot contain empty items.",
      },
    },
  },
  {
    timestamps: true,
  },
);

// Keep URL slug/date/time in a normalized format before persistence.
eventSchema.pre("save", function () {
  const doc = this as IEvent;

  if (doc.isModified("title") || !doc.slug) {
    const generatedSlug = slugify(doc.title);
    if (!generatedSlug) {
      throw new Error("Unable to generate slug from title.");
    }
    doc.slug = generatedSlug;
  }

  if (doc.isModified("date")) {
    doc.date = normalizeDateToISO(doc.date);
  }

  if (doc.isModified("time")) {
    doc.time = normalizeTime(doc.time);
  }
});

const EventModel =
  (models.Event as Model<IEvent> | undefined) ??
  model<IEvent>("Event", eventSchema);

export default EventModel;
export { EventModel as Event };
