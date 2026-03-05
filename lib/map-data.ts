export type POICategory = "apartment" | "beach" | "food" | "cafe" | "attraction" | "transport" | "shopping";

export interface POI {
  id: string;
  category: POICategory;
  lat: number;
  lng: number;
  walkingMinutes: number;
  name: {
    en: string;
    he: string;
  };
  description?: {
    en: string;
    he: string;
  };
  emoji: string;
}

export const APARTMENT_LOCATION = {
  lat: 32.0485,
  lng: 34.7545,
};

export const categoryLabels: Record<POICategory, { en: string; he: string; emoji: string }> = {
  apartment: { en: "Your Stay", he: "הדירה", emoji: "🏠" },
  beach: { en: "Beaches", he: "חופים", emoji: "🏖️" },
  food: { en: "Food & Drink", he: "אוכל ושתייה", emoji: "🍽️" },
  cafe: { en: "Cafés", he: "בתי קפה", emoji: "☕" },
  attraction: { en: "Attractions", he: "אטרקציות", emoji: "🏛️" },
  transport: { en: "Transport", he: "תחבורה", emoji: "🚌" },
  shopping: { en: "Shopping", he: "קניות", emoji: "🛒" },
};

export const pois: POI[] = [
  // Apartment
  {
    id: "yaffotlv",
    category: "apartment",
    lat: 32.0485,
    lng: 34.7545,
    walkingMinutes: 0,
    name: { en: "YaffoTLV", he: "YaffoTLV" },
    description: { en: "Your luxury apartment", he: "הדירה שלכם" },
    emoji: "🏠",
  },

  // Beaches
  {
    id: "alma-beach",
    category: "beach",
    lat: 32.0468,
    lng: 34.7476,
    walkingMinutes: 8,
    name: { en: "Alma Beach", he: "חוף אלמא" },
    description: { en: "Relaxed beach bar & restaurant", he: "בר חוף ומסעדה רגועים" },
    emoji: "🏖️",
  },
  {
    id: "givat-aliya",
    category: "beach",
    lat: 32.0445,
    lng: 34.7472,
    walkingMinutes: 5,
    name: { en: "Givat Aliya Beach", he: "חוף גבעת עלייה" },
    description: { en: "Local hidden gem, quieter beach", he: "חוף שקט ומקומי" },
    emoji: "🏖️",
  },
  {
    id: "midron-yaffo",
    category: "beach",
    lat: 32.0510,
    lng: 34.7470,
    walkingMinutes: 10,
    name: { en: "Midron Yaffo Beach", he: "חוף מדרון יפו" },
    description: { en: "Beautiful sunset views", he: "שקיעות מדהימות" },
    emoji: "🏖️",
  },

  // Food
  {
    id: "abu-hasan",
    category: "food",
    lat: 32.0503,
    lng: 34.7537,
    walkingMinutes: 3,
    name: { en: "Abu Hasan (Ali Caravan)", he: "אבו חסן (עלי קרוואן)" },
    description: { en: "Legendary hummus — the best in Israel", he: "החומוס הכי טוב בישראל" },
    emoji: "🍽️",
  },
  {
    id: "dr-shakshuka",
    category: "food",
    lat: 32.0520,
    lng: 34.7530,
    walkingMinutes: 4,
    name: { en: "Dr. Shakshuka", he: "ד״ר שקשוקה" },
    description: { en: "Famous Libyan-style shakshuka", he: "שקשוקה לובית מפורסמת" },
    emoji: "🍽️",
  },
  {
    id: "the-container",
    category: "food",
    lat: 32.0498,
    lng: 34.7492,
    walkingMinutes: 7,
    name: { en: "The Container", he: "הקונטיינר" },
    description: { en: "Seafood & cocktails at the port", he: "פירות ים וקוקטיילים בנמל" },
    emoji: "🍽️",
  },
  {
    id: "puaa",
    category: "food",
    lat: 32.0512,
    lng: 34.7542,
    walkingMinutes: 5,
    name: { en: "Puaa", he: "פועה" },
    description: { en: "Eclectic Israeli kitchen & bar", he: "מטבח ישראלי אקלקטי ובר" },
    emoji: "🍽️",
  },

  // Cafés
  {
    id: "cafe-yafa",
    category: "cafe",
    lat: 32.0508,
    lng: 34.7535,
    walkingMinutes: 3,
    name: { en: "Café Yafa", he: "קפה יפא" },
    description: { en: "Cozy neighborhood café", he: "בית קפה שכונתי נעים" },
    emoji: "☕",
  },
  {
    id: "abulafia",
    category: "cafe",
    lat: 32.0525,
    lng: 34.7525,
    walkingMinutes: 5,
    name: { en: "Abulafia Bakery", he: "אבולעפיה" },
    description: { en: "Iconic Jaffa bakery — open 24h", he: "מאפייה אייקונית — פתוח 24 שעות" },
    emoji: "☕",
  },

  // Attractions
  {
    id: "flea-market",
    category: "attraction",
    lat: 32.0526,
    lng: 34.7540,
    walkingMinutes: 4,
    name: { en: "Jaffa Flea Market", he: "שוק הפשפשים" },
    description: { en: "Vintage, design & street food", he: "וינטג׳, עיצוב ואוכל רחוב" },
    emoji: "🏛️",
  },
  {
    id: "old-jaffa-port",
    category: "attraction",
    lat: 32.0528,
    lng: 34.7482,
    walkingMinutes: 8,
    name: { en: "Old Jaffa Port", he: "נמל יפו העתיק" },
    description: { en: "Historic port with galleries & views", he: "נמל היסטורי עם גלריות ונוף" },
    emoji: "🏛️",
  },
  {
    id: "clock-tower",
    category: "attraction",
    lat: 32.0532,
    lng: 34.7525,
    walkingMinutes: 6,
    name: { en: "Jaffa Clock Tower", he: "מגדל השעון" },
    description: { en: "Ottoman-era landmark, city center", he: "ציון דרך עות׳מאני, מרכז העיר" },
    emoji: "🏛️",
  },

  // Transport
  {
    id: "jaffa-center-lr",
    category: "transport",
    lat: 32.0530,
    lng: 34.7530,
    walkingMinutes: 5,
    name: { en: "Jaffa Center (Light Rail)", he: "מרכז יפו (רכבת קלה)" },
    description: { en: "Red Line to Tel Aviv & beyond", he: "קו אדום לתל אביב" },
    emoji: "🚌",
  },

  // Shopping
  {
    id: "clock-tower-square",
    category: "shopping",
    lat: 32.0530,
    lng: 34.7520,
    walkingMinutes: 6,
    name: { en: "Clock Tower Square", he: "כיכר מגדל השעון" },
    description: { en: "Shops, restaurants & nightlife", he: "חנויות, מסעדות וחיי לילה" },
    emoji: "🛒",
  },
];
