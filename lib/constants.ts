export interface Event {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: Event[] = [
  {
    title: "Google I/O 2026",
    image: "/images/event1.png",
    slug: "google-io-2026",
    location: "Shoreline Amphitheatre, Mountain View, CA",
    date: "2026-05-19",
    time: "09:00 AM",
  },
  {
    title: "AWS re:Invent 2026",
    image: "/images/event2.png",
    slug: "aws-reinvent-2026",
    location: "Las Vegas, NV",
    date: "2026-11-30",
    time: "10:00 AM",
  },
  {
    title: "KubeCon + CloudNativeCon North America 2026",
    image: "/images/event3.png",
    slug: "kubecon-cloudnativecon-na-2026",
    location: "Atlanta, GA",
    date: "2026-10-26",
    time: "08:30 AM",
  },
  {
    title: "GitHub Universe 2026",
    image: "/images/event4.png",
    slug: "github-universe-2026",
    location: "San Francisco, CA",
    date: "2026-10-14",
    time: "09:30 AM",
  },
  {
    title: "ETHGlobal Paris Hackathon 2026",
    image: "/images/event5.png",
    slug: "ethglobal-paris-2026",
    location: "Paris, France",
    date: "2026-07-17",
    time: "06:00 PM",
  },
  {
    title: "TechCrunch Disrupt 2026",
    image: "/images/event6.png",
    slug: "techcrunch-disrupt-2026",
    location: "San Francisco, CA",
    date: "2026-09-22",
    time: "10:00 AM",
  },
  {
    title: "JSNation Conference 2026",
    image: "/images/event-full.png",
    slug: "jsnation-2026",
    location: "Amsterdam, Netherlands",
    date: "2026-06-11",
    time: "09:00 AM",
  },
];
