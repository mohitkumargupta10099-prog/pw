export type QuickItem = { label: string; icon: string; to?: string };

export const quickAccess: QuickItem[] = [
  { label: "My Batches", icon: "📖", to: "/my-batches" },
  { label: "My History", icon: "🗓️", to: "/my-history" },
  { label: "My Doubts", icon: "🙋‍♀️" },
  { label: "Dashboard", icon: "📊" },
  { label: "Real Test Se...", icon: "📝" },
  { label: "Downloads", icon: "⬇️" },
  { label: "PDF Bank", icon: "📄" },
  { label: "Rank Predic...", icon: "🎓" },
  { label: "Battleground", icon: "⚔️" },
  { label: "Bookmarks", icon: "🔖" },
];

export const exploreItems = [
  { title: "Test Series", desc: "Explore available test series here", icon: "📋" },
  { title: "Library", desc: "Access all your free study material here", icon: "📚" },
  { title: "Mentorship", desc: "Get free guidance from PW Alumni and Toppers", icon: "🤝" },
];

export const exploreMore = [
  { title: "Doubt Solving", desc: "Get your doubts resolved instantly", icon: "💬" },
  { title: "Saarthi", desc: "Your personal study companion", icon: "🧭" },
  { title: "PW Store", desc: "Books, notes and merchandise", icon: "🛍️" },
];

export type EnrolledBatch = {
  id: string;
  name: string;
  language: string;
  starts: string;
  ends: string;
  isNew?: boolean;
  free: boolean;
  banner: { title: string; from: string; to: string; text: string };
};

export const enrolledBatches: EnrolledBatch[] = [
  {
    id: "udaan",
    name: "Udaan Free Series",
    language: "Hinglish",
    starts: "01 Jul 2025",
    ends: "31 Dec 2026",
    isNew: true,
    free: true,
    banner: {
      title: "UDAAN FREE SERIES",
      from: "#f7dd8f",
      to: "#f3c95c",
      text: "#7a5410",
    },
  },
  {
    id: "lakshya",
    name: "Lakshya NEET 3.0 2027",
    language: "Hinglish",
    starts: "10 Aug 2026",
    ends: "31 May 2027",
    free: false,
    banner: {
      title: "LAKSHYA NEET 3.0 2027",
      from: "#f4d7f8",
      to: "#e9c2f2",
      text: "#6b21a8",
    },
  },
  {
    id: "yakeen",
    name: "Yakeen NEET 2027",
    language: "Hinglish",
    starts: "26 Mar 2026",
    ends: "30 Apr 2027",
    free: false,
    banner: {
      title: "YAKEEN NEET 2027",
      from: "#c9f3d8",
      to: "#a7e8c0",
      text: "#14532d",
    },
  },
];

export const popularExams = [
  { label: "IIT-JEE", icon: "⚛️", bg: "#d6e9fb" },
  { label: "NEET", icon: "🔬", bg: "#cdf0dc" },
  { label: "UPSC", icon: "🏛️", bg: "#fbeeb5" },
  { label: "Govt. Exams", icon: "🎖️", bg: "#fbe2d0" },
];

export const allExams = [
  {
    title: "Engineering & Medical Exams ( College & Job )",
    desc: "GATE, ESE, NEET PG and others",
    icon: "⚛️",
    bg: "#cdf0dc",
  },
  {
    title: "College Entrance Exams ( UG & PG )",
    desc: "CAT, CLAT, CUET and 8 others",
    icon: "📝",
    bg: "#ded9fb",
  },
  { title: "Schools, Boards & Olympiads", desc: "", icon: "🛡️", bg: "#fbeeb5" },
  { title: "All Government Job Exams", desc: "", icon: "🏛️", bg: "#fbd4d4" },
  { title: "CA, CS, Banking & Finance Courses", desc: "", icon: "🧮", bg: "#d6e9fb" },
  { title: "NET Exams & Teacher Training", desc: "", icon: "📚", bg: "#eef0b8" },
];

export const otherOfferings = [
  { title: "Earners ( Upskilling )", icon: "💸", bg: "#e4f5cf" },
  { title: "Chessmate", icon: "♞", bg: "#1e3a2c" },
  { title: "Skills (Intern/Job Assistance)", icon: "🚀", bg: "#ded9fb" },
  { title: "Spoken English", icon: "🗣️", bg: "#111111" },
  { title: "Gyaan-E (Short-Courses)", icon: "🎧", bg: "#ffffff" },
  { title: "Health & Lifestyle", icon: "🌿", bg: "#e4f5cf" },
  { title: "Online Degree", icon: "💻", bg: "#f2ddb0" },
  { title: "Study Abroad & Career Abroad", icon: "🌏", bg: "#bff0cf" },
  { title: "Semester Prep", icon: "🏫", bg: "#dbe7fb" },
  { title: "M.A.D (Music, Art & Dance)", icon: "🎨", bg: "#f0eab4" },
  { title: "PW IOI (College)", icon: "🅿️", bg: "#111111" },
];

export type Course = {
  id: string;
  tag: string;
  title: string;
  exam: string;
  status: string;
  price: number;
  mrp: number;
  off: number;
  language: string;
  banner: { title: string; sub?: string; from: string; to: string; text: string };
};

export const courses: Course[] = [
  {
    id: "lakshya3",
    tag: "Class 12 NEET",
    title: "Lakshya NEET 3.0 2027",
    exam: "NEET 2027",
    status: "Ongoing  |  Started on 10th Aug'26",
    price: 4700,
    mrp: 5200,
    off: 10,
    language: "HINGLISH",
    banner: {
      title: "LAKSHYA NEET 3.0 2027",
      sub: "Multiple plans inside: Infinity, Pro",
      from: "#f7ddfa",
      to: "#eec6f5",
      text: "#6d28d9",
    },
  },
  {
    id: "lakshya",
    tag: "Class 12 NEET",
    title: "Lakshya NEET 2027",
    exam: "NEET 2027",
    status: "Ongoing  |  Started on 26th Mar'26",
    price: 4999,
    mrp: 6000,
    off: 17,
    language: "HINGLISH",
    banner: {
      title: "LAKSHYA NEET 2027",
      sub: "Multiple plans inside: Infinity, Pro",
      from: "#c9f3d8",
      to: "#aeebc4",
      text: "#14532d",
    },
  },
  {
    id: "yakeen",
    tag: "Class 12 NEET",
    title: "Yakeen NEET 2027",
    exam: "NEET 2027",
    status: "Ongoing  |  Started on 1st Apr'26",
    price: 3999,
    mrp: 5500,
    off: 27,
    language: "HINGLISH",
    banner: {
      title: "YAKEEN NEET 2027",
      sub: "Multiple plans inside: Infinity",
      from: "#dbe7fb",
      to: "#bcd6f7",
      text: "#1e3a8a",
    },
  },
  {
    id: "arjuna",
    tag: "Class 11 NEET",
    title: "Arjuna NEET 2028",
    exam: "NEET 2028",
    status: "Ongoing  |  Started on 12th Jun'26",
    price: 4300,
    mrp: 5000,
    off: 14,
    language: "HINGLISH",
    banner: {
      title: "ARJUNA NEET 2028",
      sub: "Multiple plans inside: Pro",
      from: "#fde5cf",
      to: "#f8cfa8",
      text: "#9a3412",
    },
  },
];

export const otherBatchChips = [
  "Chessmate",
  "Dropper NEET",
  "12th CBSE Board",
  "11th - NEET",
  "UPSC CSE",
];
