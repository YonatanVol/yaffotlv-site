export interface Review {
  id: string;
  guestName: string;
  country: string;
  countryFlag: string;
  date: string; // "YYYY-MM"
  rating: number;
  source: "airbnb" | "booking";
  text: string; // the review as the guest wrote it (real reviews are shown as-written)
}

// NOTE: these are SAMPLE reviews — placeholders until the owner pastes real ones.
// Replace this array with real Airbnb/Booking reviews (keep the same fields).
export const reviews: Review[] = [
  {
    id: "r1",
    guestName: "Sarah",
    country: "UK",
    countryFlag: "🇬🇧",
    date: "2024-11",
    rating: 5,
    source: "airbnb",
    text: "Absolutely stunning apartment in the heart of Jaffa. Everything was spotless and the location is perfect — walking distance to amazing restaurants and the beach.",
  },
  {
    id: "r2",
    guestName: "Marco",
    country: "Italy",
    countryFlag: "🇮🇹",
    date: "2024-10",
    rating: 5,
    source: "airbnb",
    text: "Fantastic host. The apartment is modern, clean, and has everything you need. The Nespresso machine was a great touch. Will definitely come back!",
  },
  {
    id: "r3",
    guestName: "Anna",
    country: "Germany",
    countryFlag: "🇩🇪",
    date: "2024-09",
    rating: 5,
    source: "booking",
    text: "Perfect location in Old Jaffa. Quiet neighborhood but close to everything. The apartment was recently renovated and looks even better than the photos.",
  },
  {
    id: "r4",
    guestName: "David",
    country: "USA",
    countryFlag: "🇺🇸",
    date: "2024-08",
    rating: 5,
    source: "airbnb",
    text: "We stayed here for a week with our family and loved every minute. The apartment is spacious, the AC works great, and the self check-in was super easy.",
  },
  {
    id: "r5",
    guestName: "Marie",
    country: "France",
    countryFlag: "🇫🇷",
    date: "2024-07",
    rating: 5,
    source: "airbnb",
    text: "The best Airbnb we've stayed at in Israel. Beautifully designed, incredibly clean, and the neighborhood has the best food in Tel Aviv. Abu Hasan is 3 minutes away!",
  },
  {
    id: "r6",
    guestName: "Alex",
    country: "Canada",
    countryFlag: "🇨🇦",
    date: "2024-06",
    rating: 4,
    source: "booking",
    text: "Great apartment with a lovely garden view. The host was very responsive and helpful. The only thing I'd note is that parking isn't right at the building, but it's a short walk.",
  },
  {
    id: "r7",
    guestName: "Yuki",
    country: "Japan",
    countryFlag: "🇯🇵",
    date: "2024-05",
    rating: 5,
    source: "airbnb",
    text: "Such a peaceful stay. The apartment is quiet despite being in the city, the bed was extremely comfortable, and the kitchen had everything we needed to cook.",
  },
  {
    id: "r8",
    guestName: "Liam",
    country: "Australia",
    countryFlag: "🇦🇺",
    date: "2024-12",
    rating: 5,
    source: "airbnb",
    text: "Hands down the best place to stay in Jaffa. Modern, clean, great location. The flea market is walking distance, and the beach sunset views are incredible.",
  },
];
