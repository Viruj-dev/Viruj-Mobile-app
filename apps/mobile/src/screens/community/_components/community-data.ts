export type TipStory = {
  id: string;
  name: string;
  image: string;
  own?: boolean;
};

export type FeedPost = {
  id: string;
  author: string;
  role: string;
  time: string;
  body: string;
  tags: string;
  image: string;
  likes: number;
  comments: number;
  liked: boolean;
  saved: boolean;
  avatar: string;
  verified?: boolean;
  editorial?: boolean;
};

export const doctorPortraits = [
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=200&q=80",
];

export const stories: TipStory[] = [
  { id: "tip-1", name: "Dr. Smith", image: doctorPortraits[0] },
  { id: "tip-2", name: "Dr. Anjali", image: doctorPortraits[1] },
  { id: "tip-3", name: "Dr. Vikram", image: doctorPortraits[2] },
  { id: "tip-4", name: "Dr. Sarah", image: doctorPortraits[3] },
  { id: "tip-you", name: "Your Story", image: doctorPortraits[0], own: true },
];

export const initialPosts: FeedPost[] = [
  {
    id: "post-neha",
    author: "Dr. Neha Verma",
    role: "Neurologist",
    time: "2h ago",
    body:
      "Understanding migraines isn't just about the pain; it's about identifying triggers. Here are 5 common lifestyle factors that could be causing your headaches.",
    tags: "#NeuroHealth #MigraineRelief",
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=900&q=80",
    likes: 1200,
    comments: 84,
    liked: false,
    saved: false,
    avatar: doctorPortraits[1],
    verified: true,
  },
  {
    id: "editorial",
    author: "Viruj Editorial",
    role: "New Research",
    time: "5 min read",
    body: "The future of AI in early cancer detection.",
    tags: "Dr. Rohan Mehta",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80",
    likes: 0,
    comments: 0,
    liked: false,
    saved: false,
    avatar: "",
    editorial: true,
  },
  {
    id: "post-abhishek",
    author: "Abhishek Negi",
    role: "Health Enthusiast",
    time: "5h ago",
    body:
      "Just finished my morning run! Feeling incredibly energized. Remember, consistency is better than intensity. Who else is hitting their goals today?",
    tags: "#FitnessJourney #MorningRoutine",
    image:
      "https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&w=900&q=80",
    likes: 456,
    comments: 22,
    liked: false,
    saved: false,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
];

export function formatLikes(likes: number) {
  if (likes >= 1000) {
    return `${(likes / 1000).toFixed(likes % 1000 === 0 ? 0 : 1)}k`;
  }

  return String(likes);
}

export function makeMorePosts(start: number, count: number): FeedPost[] {
  return Array.from({ length: count }, (_, index) => {
    const number = start + index;
    const doctor = number % 2 === 0;

    return {
      id: `generated-${number}`,
      author: doctor ? "Dr. Rohan Mehta" : "Viruj City Hospital",
      role: doctor ? "Oncologist" : "Hospital Update",
      time: `${number + 2}h ago`,
      body: doctor
        ? "Small preventive habits compound over time. Schedule screenings on time and keep your reports organized for every follow-up."
        : "Our evening health desk is open for report reviews and follow-up appointment support today.",
      tags: doctor
        ? "#PreventiveCare #HealthScreening"
        : "#HospitalUpdate #VirujCare",
      image: doctor
        ? "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=900&q=80"
        : "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80",
      likes: 180 + number * 17,
      comments: 12 + number,
      liked: false,
      saved: false,
      avatar: doctor ? doctorPortraits[2] : doctorPortraits[3],
      verified: doctor,
    };
  });
}
