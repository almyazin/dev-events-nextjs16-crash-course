import { Event, IEvent } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextResponse, type NextRequest } from "next/server";

type EventRouteParams = {
  slug?: string | string[];
};

type EventRouteContext = {
  params?: Promise<EventRouteParams>;
};

function normalizeSlug(slug: string): string {
  return slug.trim().toLowerCase();
}

function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export async function GET(
  _request: NextRequest,
  { params }: EventRouteContext,
) {
  try {
    const resolvedParams = params ? await params : undefined;
    const rawSlug = resolvedParams?.slug;

    if (typeof rawSlug !== "string") {
      return NextResponse.json(
        { message: "Slug is required." },
        { status: 400 },
      );
    }

    const slug = normalizeSlug(rawSlug);
    if (!slug || !isValidSlug(slug)) {
      return NextResponse.json(
        { message: "Slug is invalid." },
        { status: 400 },
      );
    }

    await connectDB();

    // Fetch the event by its normalized slug.
    const event = await Event.findOne({ slug }).lean<IEvent>().exec();

    if (!event) {
      return NextResponse.json(
        { message: `Event with slug "${slug}" not found.` },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Event fetched successfully.",
        event,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Event fetch by slug failed:", error);

    return NextResponse.json(
      {
        message: "Unexpected error while fetching event.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
