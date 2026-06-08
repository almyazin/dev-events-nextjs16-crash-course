import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import Event from "@/database/event.model";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    let event;
    try {
      event = Object.fromEntries(formData.entries());
    } catch (error) {
      console.error("Error parsing form data:", error);
      return NextResponse.json(
        {
          message: "Invalid JSON data format",
        },
        { status: 400 },
      );
    }

    const file = formData.get("image") as File | null;
    if (!file) {
      return NextResponse.json(
        {
          message: "Image file is required",
        },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const tags = JSON.parse(formData.get("tags") as string);
    const agenda = JSON.parse(formData.get("agenda") as string);

    event.tags = tags;
    event.agenda = agenda;

    const uploadResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) {
              reject(error);
            }
            if (!result) {
              reject(new Error("Unknown error"));
            } else {
              resolve(result);
            }
          })
          .end(buffer);
      },
    );

    event.image = uploadResult.secure_url;

    // await cloudinary.uploader
    //   .upload_stream({ resource_type: "image" }, (error, result) => {
    //     if (error || !result) {
    //       return NextResponse.json(
    //         {
    //           message: "Image upload failed",
    //           error: error ? error.message : "Unknown error",
    //         },
    //         { status: 500 },
    //       );
    //     }
    //     event.image = result.secure_url;
    //   })
    //   .end(buffer);

    const createdEvent = await Event.create(event);

    return NextResponse.json(
      {
        message: "Event created successfully",
        event: createdEvent,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Event creation failed",
        error: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "Events fetched successfully",
        events,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Event fetching failed",
        error: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 },
    );
  }
}
