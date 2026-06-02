"use client";

import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";

const Navbar = () => {
  const handleCreateEventClick = () => {
    posthog.capture("nav_create_event_clicked");
  };

  return (
    <header>
      <nav>
        <Link href='/' className='logo'>
          <Image src='/icons/logo.png' alt='logo' width={24} height={24} />

          <p>DevEvent</p>
        </Link>

        <ul>
          <Link href='/'>Home</Link>
          <Link href='/events'>Events</Link>
          <Link href='/about' onClick={handleCreateEventClick}>Create Event</Link>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
