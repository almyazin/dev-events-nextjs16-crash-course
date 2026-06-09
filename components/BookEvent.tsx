"use client";

import { createBooking } from "@/lib/actions/booking.actions";
import posthog from "posthog-js";
import { useState } from "react";

const BookEvent = ({ eventId }: { eventId: string }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const { success, error } = await createBooking({ eventId, email });

    if (success) {
      setSubmitted(true);
      posthog.capture("booking_created", { eventId, email });
    } else {
      posthog.captureException(error, { eventId, email });
      console.error("Booking creation failed:", error);
    }
  };

  return (
    <div id='book-event'>
      {submitted ? (
        <p className='text-sm'>Thank you for signing up!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='email'>Email Address</label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email address'
            />
          </div>

          <button type='submit' className='button-submit'>
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
