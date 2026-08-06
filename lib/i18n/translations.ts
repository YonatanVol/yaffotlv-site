export type Locale = "en" | "he" | "ru" | "fr" | "es" | "ar";

export const RTL_LOCALES: Locale[] = ["he", "ar"];

export const LOCALE_FLAGS: Record<Locale, { flag: string; label: string }> = {
  en: { flag: "🇬🇧", label: "English" },
  he: { flag: "🇮🇱", label: "עברית" },
  ru: { flag: "🇷🇺", label: "Русский" },
  fr: { flag: "🇫🇷", label: "Français" },
  es: { flag: "🇪🇸", label: "Español" },
  ar: { flag: "🇸🇦", label: "العربية" },
};

export interface Translations {
  nav: {
    gallery: string;
    residence: string;
    contact: string;
    bookNow: string;
    reviews?: string;
  };
  hero: {
    overline: string;
    title: string;
    tagline: string;
  };
  signature: {
    headline: string;
    subtitle: string;
  };
  quote: string;
  details: {
    bedrooms: string;
    location: string;
    sea: string;
    vibe: string;
  };
  // Amenities / property highlights section
  amenities: {
    title: string;
    subtitle: string;
    size: string;
    beds: string;
    bathrooms: string;
    guests: string;
    renovated: string;
    checkin: string;
    checkout: string;
    wifi: string;
    ac: string;
    tv: string;
    streaming: string;
    kitchen: string;
    nespresso: string;
    washer: string;
    parking: string;
    workspace: string;
    elevator: string;
    pets: string;
    iron: string;
    hairdryer: string;
    crib: string;
    selfCheckin: string;
    garden: string;
    shelter: string;
    beach: string;
  };
  cta: {
    overline: string;
    headline: string;
    description: string;
    bookNow: string;
    contactUs: string;
  };
  slider: {
    title: string;
    subtitle: string;
    rooms: {
      livingRoom: string;
      kitchen: string;
      bedroom1: string;
      bedroom2: string;
      entryway: string;
    };
    prev: string;
    next: string;
  };
  contactModal: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    message: string;
    send: string;
    sending: string;
    thanks: string;
    thanksMessage: string;
    error: string;
    whatsappCta: string;
    close: string;
  };
  book: {
    overline: string;
    title: string;
    subtitle: string;
    step1: string;
    step1Title: string;
    step2: string;
    step2Title: string;
    cancellation: string;
    checkIn: string;
    checkOut: string;
    nights: string;
    guests: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    guestCount: string;
    continue: string;
    back: string;
    payNow: string;
    perNight: string;
    cleaning: string;
    subtotal: string;
    vat: string;
    total: string;
    inclVat?: string;
    discount?: string;
    agreeRules?: string;
    /** Shown under the email field, since an unfinished enquiry may be followed up. */
    enquiryFollowUpNotice?: string;
    promo?: string;
    apply?: string;
    promoApplied?: string;
    promoInvalid?: string;
    requestBook?: string;
    inquiryNote?: string;
    /* Required on purpose: these render on the booking page in every language.
       As optional keys they were defined in no locale at all, so every visitor
       — including Hebrew ones — saw the English fallback. Keeping them required
       makes `tsc` fail the build if a locale is ever missing one. */
    datesUnavailable: string;
    pickDates: string;
    pickCheckout: string;
    night: string;
    /** "{month} is fully booked." — {month} is substituted at render. */
    monthFull: string;
    /** "Try {month}" — jump to the next month with availability. */
    tryMonth: string;
  };
  /** Reassurance strip on the booking page. */
  securityBadges: {
    ssl: string;
    payment: string;
    verified: string;
    data: string;
  };
  // WhatsApp
  whatsapp?: {
    message: string;
  };
  // Reviews
  reviews?: {
    title: string;
    subtitle: string;
    reviewCount: string;
    viewAll: string;
    seeAll?: string;
    verified?: string;
  };
  // Social proof bar
  socialProof?: {
    booked: string;
    rating: string;
    save: string;
    superhost: string;
  };
  // Footer
  footer?: {
    tagline: string;
    terms: string;
    privacy: string;
    cancellation: string;
    rights: string;
  };
  // Sleeping arrangements
  sleeping?: {
    overline: string;
    title: string;
    bedroom: string;
    doubleBed: string;
    living: string;
    livingBeds: string;
    cot: string;
    parking: string;
  };
  // About the apartment
  apartment?: {
    overline: string;
    title: string;
    paragraphs?: string[];
  };
  // House rules
  houseRules?: {
    title: string;
    intro: string;
    rules: string[];
  };
  // Trust badges
  trustBadges?: {
    superhost: string;
    secure: string;
    save: string;
  };
  // Photo gallery
  gallery?: {
    viewAll: string;
    photoOf: string;
  };
  // Map
  map?: {
    title: string;
    subtitle: string;
  };
  // Why Book Direct
  whyDirect?: {
    overline: string;
    title: string;
    price: string;
    priceDesc: string;
    contact: string;
    contactDesc: string;
    flexible: string;
    flexibleDesc: string;
    local: string;
    localDesc: string;
  };
  // Host section
  host?: {
    overline: string;
    title: string;
    superhost: string;
    bio: string;
    yearsHosting: string;
    responseTime: string;
  };
  // Perfect For section
  perfectFor?: {
    overline: string;
    title: string;
    couples: string;
    couplesDesc: string;
    families: string;
    familiesDesc: string;
    remote: string;
    remoteDesc: string;
    travelers: string;
    travelersDesc: string;
  };
}

const en: Translations = {
  nav: {
    gallery: "Gallery",
    reviews: "Reviews",
    residence: "The Apartment",
    contact: "Contact",
    bookNow: "Book Now",
  },
  hero: {
    overline: "Jaffa, Tel Aviv",
    title: "YaffoTLV",
    tagline: "Your home in Jaffa",
  },
  signature: {
    headline: "80 sqm of light, comfort and everything you need",
    subtitle: "Newly renovated 3-room apartment in a quiet Jaffa neighborhood. Two bedrooms, a fully equipped kitchen, AC in every room, and a 10-minute walk to the beach. Designed for guests who want to feel at home.",
  },
  quote: "A quiet street in Jaffa, ten minutes' walk from the sea — and the whole apartment is yours.",
  details: {
    bedrooms: "3 Rooms · 80 sqm",
    location: "Jaffa, Tel Aviv",
    sea: "10 min to the beach",
    vibe: "Quiet & Bright",
  },
  amenities: {
    title: "What's included",
    subtitle: "Everything you need for a comfortable stay",
    size: "80 sqm",
    beds: "3 rooms · 5 beds",
    bathrooms: "1.5 bathrooms",
    guests: "Up to 8 guests",
    renovated: "Renovated 2024",
    checkin: "Self check-in",
    checkout: "Check-out 11:00",
    wifi: "1 Gbps WiFi",
    ac: "AC in every room",
    tv: "TV in every room",
    streaming: "Netflix · Selcom TV",
    kitchen: "Full kitchen",
    nespresso: "Nespresso machine",
    washer: "Washer & dryer",
    parking: "Free parking nearby",
    workspace: "Perfect for WFH",
    elevator: "Elevator",
    pets: "Pet friendly",
    iron: "Iron",
    hairdryer: "Hair dryer",
    crib: "Crib available",
    selfCheckin: "Lockbox entry",
    garden: "Garden view",
    shelter: "Bomb shelter below",
    beach: "Near the beach",
  },
  cta: {
    overline: "Reserve your stay",
    headline: "Book Your Stay",
    description: "Check availability and book directly. Flexible cancellation included.",
    bookNow: "Book Now",
    contactUs: "Contact Us",
  },
  slider: {
    title: "The Apartment",
    subtitle: "Take a look inside",
    rooms: {
      livingRoom: "Living Room",
      kitchen: "Kitchen",
      bedroom1: "Bedroom 1",
      bedroom2: "Bedroom 2",
      entryway: "Entryway",
    },
    prev: "Previous photo",
    next: "Next photo",
  },
  contactModal: {
    title: "Get in Touch",
    subtitle: "Questions about the apartment? We typically respond within an hour.",
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send Message",
    sending: "Sending...",
    thanks: "Thank you",
    thanksMessage: "We've received your message and will be in touch soon.",
    error: "Something went wrong. Please try again.",
    whatsappCta: "Or message us on WhatsApp",
    close: "Close",
  },
  book: {
    overline: "Reserve your stay",
    title: "Book Now",
    subtitle: "Select your dates and complete your reservation instantly.",
    step1: "Step 1 of 2",
    step1Title: "Select Your Dates",
    step2: "Step 2 of 2",
    step2Title: "Guest Details",
    cancellation: "Free cancellation up to 5 days before check-in (50% within 5 days).",
    discount: "Discount",
    agreeRules: "I have read and agree to the House Rules, Terms and Cancellation Policy.",
    enquiryFollowUpNotice:
      "If you don't finish, we may email you about this enquiry. Unsubscribe anytime.",
    promo: "Promo code",
    apply: "Apply",
    promoApplied: "Promo code applied!",
    promoInvalid: "That code isn't valid.",
    requestBook: "Request to book on WhatsApp",
    inquiryNote: "Online payment is launching soon — reserve your dates on WhatsApp and we'll confirm availability right away.",
    checkIn: "Check-in",
    checkOut: "Check-out",
    nights: "nights",
    guests: "Guests",
    guestName: "Full Name",
    guestEmail: "Email",
    guestPhone: "Phone (optional)",
    guestCount: "Number of Guests",
    continue: "Continue",
    back: "Back",
    payNow: "Pay Now",
    perNight: "/ night",
    cleaning: "Cleaning fee",
    subtotal: "Subtotal",
    vat: "VAT (18%)",
    total: "Total",
    datesUnavailable: "Those nights are already booked. Please pick different dates.",
    pickDates: "Tap your check-in date, then your check-out date. One night = two dates.",
    pickCheckout: "Now pick your check-out date (the morning you leave).",
    night: "night",
    monthFull: "{month} is fully booked.",
    tryMonth: "Try {month}",
    inclVat: "Price includes VAT",
  },
  whatsapp: {
    message: "Hi, I'm interested in booking YaffoTLV 🏡",
  },
  reviews: {
    title: "Guest Reviews",
    subtitle: "What our guests say",
    reviewCount: "reviews",
    viewAll: "View all reviews on Airbnb",
    seeAll: "See all reviews",
    verified: "Verified on Airbnb",
  },
  socialProof: {
    booked: "",
    rating: "",
    save: "💰 Save 10% when you book direct",
    superhost: "",
  },
  footer: {
    tagline: "A 2-bedroom apartment in Jaffa, Tel Aviv · short-term rental.",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    cancellation: "Cancellation Policy",
    rights: "All rights reserved.",
  },
  apartment: {
    overline: "The Apartment",
    title: "A home in the heart of Jaffa",
    paragraphs: [
      "Renovated in 2024, this bright 3-room apartment sits on a quiet street in Jaffa — two bedrooms, a comfortable living room, a fully equipped kitchen, and air conditioning in every room.",
      "It's meant to feel like a home rather than a hotel: about 80 sqm, plenty of natural light, and room for up to 8 people. A baby cot is available on request.",
      "The beach is a 10-minute walk. The Jaffa flea market, Abu Hasan and a lot of good cafés are all within a few minutes on foot.",
    ],
  },
  sleeping: {
    overline: "The Space",
    title: "Comfortably sleeps up to 8",
    bedroom: "Bedroom",
    doubleBed: "Double bed",
    living: "Living room",
    livingBeds: "Double sofa-bed, a sofa & a folding single bed",
    cot: "Baby cot available on request",
    parking: "Free street parking 19:00–09:00; paid during the day (~₪6/hr via the Cello app).",
  },
  houseRules: {
    title: "House Rules",
    intro: "By booking, you agree to the following house rules:",
    rules: [
      "No smoking inside the apartment ($200 fine per booked day).",
      "No parties and no loud events.",
      "Quiet hours are 21:00–08:00. Please respect the neighbors.",
      "A fine of $100 per booked day, per guest, applies for exceeding the number of guests booked. Any change in the guest count must be updated in advance.",
      "You must have a valid, active phone number before booking.",
      "If the apartment is left excessively dirty (beyond what a considerate guest would leave), a $100 additional cleaning charge applies.",
      "Breaking any house rule is grounds for immediate termination of the stay with no refund.",
    ],
  },
  trustBadges: {
    superhost: "Superhost",
    secure: "Secure Payment",
    save: "10% Cheaper",
  },
  gallery: {
    viewAll: "View all photos",
    photoOf: "Photo",
  },
  map: {
    title: "The Neighborhood",
    subtitle: "Explore Jaffa",
  },
  whyDirect: {
    overline: "Why Book Direct",
    title: "Skip the platforms. Book here.",
    price: "Best Price Guaranteed",
    priceDesc: "Always 10% cheaper than Airbnb or Booking.com. No middleman, no extra fees.",
    contact: "Direct Communication",
    contactDesc: "Chat directly with your host on WhatsApp. Faster answers, personal recommendations.",
    flexible: "Flexible & Easy",
    flexibleDesc: "Free cancellation up to 5 days before check-in, 50% refund after that. No hidden charges.",
    local: "Local Expertise",
    localDesc: "Get insider tips, restaurant picks, and a digital guide from someone who knows Jaffa best.",
  },
  host: {
    overline: "Your Host",
    title: "Meet Eitan",
    superhost: "Superhost",
    bio: "I grew up in Jaffa and I look after this apartment myself. I renovated it in 2024 with one aim: that it feels like a home rather than a hotel. If you need anything during your stay — a restaurant worth walking to, directions, or just a tip — I'm a WhatsApp message away.",
    yearsHosting: "years hosting",
    responseTime: "Usually replies within an hour",
  },
  perfectFor: {
    overline: "Perfect For",
    title: "Who stays here",
    couples: "Couples",
    couplesDesc: "Romantic sunsets from Old Jaffa Port, candlelit dinners at The Container, and morning walks on the beach.",
    families: "Families",
    familiesDesc: "Spacious 3 rooms, crib available, pet-friendly, elevator, and the Flea Market is a 4-minute walk.",
    remote: "Remote Workers",
    remoteDesc: "Fast WiFi, a proper desk, a coffee machine, and a quiet street to work from.",
    travelers: "Explorers",
    travelersDesc: "Walk to Old Jaffa, light rail to Tel Aviv center in 15 min, Abu Hasan hummus 3 minutes away.",
  },
  securityBadges: {
    ssl: "Encrypted connection",
    payment: "Secure payment",
    verified: "Book direct with the owner",
    data: "Your details are never shared",
  },
};

// ── Hebrew — warm, natural Israeli tone ────────────────────────────
const he: Translations = {
  nav: {
    gallery: "גלריה",
    reviews: "ביקורות",
    residence: "הדירה",
    contact: "דברו איתנו",
    bookNow: "הזמינו עכשיו",
  },
  hero: {
    overline: "יפו, תל אביב",
    title: "YaffoTLV",
    tagline: "הבית שלכם ביפו",
  },
  signature: {
    headline: "80 מ״ר של אור, נוחות, ושקט — ממש ביפו",
    subtitle: "דירת 3 חדרים שעברה שיפוץ מלא, בשכונה שקטה עם אופי. שני חדרי שינה נוחים, מטבח מאובזר לגמרי, מיזוג בכל חדר, ו-10 דקות ברגל מהים. המקום הזה נבנה בשביל אנשים שרוצים לחוות את יפו — ולהרגיש בבית.",
  },
  quote: "רחוב שקט ביפו, עשר דקות הליכה מהים — והדירה כולה שלכם.",
  details: {
    bedrooms: "3 חדרים · 80 מ״ר",
    location: "יפו, תל אביב",
    sea: "10 דק׳ מהים",
    vibe: "שקט ומואר",
  },
  amenities: {
    title: "מה יש בדירה",
    subtitle: "הכל כאן, אפשר פשוט להגיע",
    size: "80 מ״ר",
    beds: "3 חדרים · 5 מיטות",
    bathrooms: "חדר רחצה וחצי",
    guests: "עד 8 אורחים",
    renovated: "שיפוץ 2024",
    checkin: "כניסה עצמאית",
    checkout: "עזיבה עד 11:00",
    wifi: "אינטרנט 1 ג׳יגה",
    ac: "מיזוג בכל חדר",
    tv: "טלוויזיה בכל חדר",
    streaming: "Netflix · סלקום TV",
    kitchen: "מטבח מאובזר",
    nespresso: "מכונת נספרסו",
    washer: "מכונת כביסה ומייבש",
    parking: "חניה חינם ברחוב",
    workspace: "מושלם לעבודה מהבית",
    elevator: "מעלית בבניין",
    pets: "אפשר עם חיות מחמד",
    iron: "מגהץ",
    hairdryer: "מייבש שיער",
    crib: "עריסה לתינוק",
    selfCheckin: "כניסה עם קודן",
    garden: "נוף לגינה",
    shelter: "מקלט ענק מתחת לבניין",
    beach: "דקות מהחוף",
  },
  cta: {
    overline: "מוכנים?",
    headline: "הזמינו את המקום",
    description: "תבדקו מתי פנוי ותסגרו ישירות. ביטול גמיש, בלי הפתעות.",
    bookNow: "להזמנה",
    contactUs: "יש שאלה? כתבו לנו",
  },
  slider: {
    title: "הדירה מבפנים",
    subtitle: "בואו תראו",
    rooms: {
      livingRoom: "סלון",
      kitchen: "מטבח",
      bedroom1: "חדר שינה ראשי",
      bedroom2: "חדר שינה שני",
      entryway: "כניסה",
    },
    prev: "תמונה קודמת",
    next: "תמונה הבאה",
  },
  contactModal: {
    title: "דברו איתנו",
    subtitle: "שאלות? תכתבו, בדרך כלל חוזרים תוך שעה.",
    name: "שם",
    email: "אימייל",
    message: "מה תרצו לדעת?",
    send: "שלחו",
    sending: "שולח...",
    thanks: "תודה רבה!",
    thanksMessage: "קיבלנו את ההודעה, נחזור אליכם בהקדם.",
    error: "משהו השתבש. נסו שוב.",
    whatsappCta: "או שלחו לנו הודעה בוואטסאפ",
    close: "סגירה",
  },
  book: {
    overline: "בואו נסגור",
    title: "הזמנה",
    subtitle: "בחרו תאריכים וסיימו ברגע.",
    step1: "שלב 1 מתוך 2",
    step1Title: "מתי אתם מגיעים?",
    step2: "שלב 2 מתוך 2",
    step2Title: "ספרו לנו קצת על עצמכם",
    cancellation: "ביטול חינם עד 5 ימים לפני הצ׳ק-אין (50% בתוך 5 ימים).",
    discount: "הנחה",
    agreeRules: "קראתי ואני מאשר/ת את כללי הבית, תנאי השימוש ומדיניות הביטולים.",
    enquiryFollowUpNotice:
      "אם לא תשלימו את ההזמנה, ייתכן שנשלח לכם מייל בנוגע לפנייה. אפשר להסיר את עצמכם בכל עת.",
    promo: "קוד קופון",
    apply: "החל",
    promoApplied: "הקוד הופעל!",
    promoInvalid: "הקוד אינו תקף.",
    requestBook: "בקשת הזמנה בוואטסאפ",
    inquiryNote: "תשלום מקוון מגיע בקרוב — שריינו את התאריכים בוואטסאפ ונאשר זמינות מיד.",
    checkIn: "הגעה",
    checkOut: "עזיבה",
    nights: "לילות",
    guests: "אורחים",
    guestName: "שם מלא",
    guestEmail: "אימייל",
    guestPhone: "טלפון (לא חובה)",
    guestCount: "כמה אתם?",
    continue: "קדימה",
    back: "חזרה",
    payNow: "לתשלום",
    perNight: "/ לילה",
    cleaning: "ניקיון",
    subtotal: "סיכום ביניים",
    vat: "מע״מ (18%)",
    total: "סה״כ",
    datesUnavailable: "הלילות האלה כבר תפוסים. אנא בחרו תאריכים אחרים.",
    pickDates: "בחרו תאריך כניסה ואז תאריך יציאה. לילה אחד = שני תאריכים.",
    pickCheckout: "עכשיו בחרו תאריך יציאה (הבוקר שבו אתם עוזבים).",
    night: "לילה",
    monthFull: "{month} תפוס במלואו.",
    tryMonth: "נסו {month}",
    inclVat: "המחיר כולל מע״מ",
  },
  whatsapp: {
    message: "היי, רציתי לשמוע על הדירה ביפו 🏡",
  },
  reviews: {
    title: "מה אורחים כותבים",
    subtitle: "מה שאורחים כתבו",
    reviewCount: "ביקורות",
    viewAll: "כל הביקורות ב-Airbnb →",
    seeAll: "לכל הביקורות",
    verified: "מאומת ב-Airbnb",
  },
  socialProof: {
    booked: "",
    rating: "",
    save: "💰 חוסכים 10% בהזמנה ישירה",
    superhost: "",
  },
  footer: {
    tagline: "דירת 2 חדרי שינה ביפו, תל אביב · השכרה לטווח קצר.",
    terms: "תנאי שימוש",
    privacy: "מדיניות פרטיות",
    cancellation: "מדיניות ביטולים",
    rights: "כל הזכויות שמורות.",
  },
  apartment: {
    overline: "הדירה",
    title: "בית בלב יפו",
    paragraphs: [
      "הדירה שופצה ב-2024 ויושבת ברחוב שקט ביפו — שלושה חדרים, שני חדרי שינה, סלון נוח, מטבח מאובזר לגמרי ומיזוג בכל חדר.",
      "היא נועדה להרגיש כמו בית ולא כמו מלון: כ-80 מ״ר, הרבה אור טבעי, ומקום לעד 8 אנשים. אפשר לבקש מיטת תינוק.",
      "הים במרחק 10 דקות הליכה. שוק הפשפשים, אבו חסן והמון בתי קפה טובים — הכול כמה דקות ברגל.",
    ],
  },
  sleeping: {
    overline: "החלל",
    title: "מתאים בנוחות עד 8 אורחים",
    bedroom: "חדר שינה",
    doubleBed: "מיטה זוגית",
    living: "סלון",
    livingBeds: "ספה זוגית נפתחת, ספה ומיטת יחיד מתקפלת",
    cot: "מיטת תינוק זמינה לפי בקשה",
    parking: "חניה חופשית ברחוב 19:00–09:00; בתשלום במהלך היום (~6₪ לשעה, אפליקציית Cello).",
  },
  houseRules: {
    title: "כללי הבית",
    intro: "בהזמנתכם אתם מאשרים את כללי הבית הבאים:",
    rules: [
      "אסור לעשן בדירה (קנס של 200 דולר לכל יום שהוזמן).",
      "אין מסיבות ואין אירועים רועשים.",
      "שעות השקט הן בין 21:00 ל-08:00. אנא כבדו את השכנים.",
      "קנס של 100 דולר ליום שהוזמן, לכל אורח, עבור חריגה ממספר האורחים שהוזמן. כל שינוי במספר האורחים יש לעדכן מראש.",
      "עליכם להיות בעלי מספר טלפון תקף ופעיל לפני ביצוע ההזמנה.",
      "אם הדירה מלוכלכת במיוחד (מעבר למה שאורח אדיב היה משאיר), יחול חיוב ניקיון נוסף של 100 דולר.",
      "הפרה של אחד מכללי הבית מהווה עילה לסיום מיידי של ההזמנה ללא החזר כספי.",
    ],
  },
  trustBadges: {
    superhost: "סופרהוסט",
    secure: "תשלום מאובטח",
    save: "זול ב-10%",
  },
  gallery: {
    viewAll: "לכל התמונות",
    photoOf: "תמונה",
  },
  map: {
    title: "השכונה שלנו",
    subtitle: "הכירו את יפו",
  },
  whyDirect: {
    overline: "למה ישירות",
    title: "בלי פלטפורמות. ישר מאיתנו.",
    price: "המחיר הכי טוב",
    priceDesc: "תמיד 10% פחות מ-Airbnb או Booking. בלי עמלות, בלי מתווכים.",
    contact: "קשר ישיר עם המארח",
    contactDesc: "כתבו לנו בוואטסאפ. תשובה מהירה, המלצות אישיות, ואיתן תמיד זמין.",
    flexible: "גמיש ופשוט",
    flexibleDesc: "ביטול חינם עד 5 ימים לפני הצ׳ק-אין, 50% החזר אחר כך. בלי אותיות קטנות.",
    local: "טיפים של מקומי",
    localDesc: "מסעדות, חופים, מקומות שרק יפואי אמיתי מכיר — הכל בשבילכם.",
  },
  host: {
    overline: "המארח שלכם",
    title: "הכירו את איתן",
    superhost: "סופרהוסט",
    bio: "גדלתי ביפו ואני מטפל בדירה הזאת בעצמי. שיפצתי אותה ב-2024 עם מטרה אחת: שתרגישו בבית, לא במלון. אם תצטרכו משהו במהלך השהות — המלצה על מסעדה, עזרה עם ניווט או סתם טיפ טוב — אני זמין בוואטסאפ.",
    yearsHosting: "שנים של אירוח",
    responseTime: "בדרך כלל עונה תוך שעה",
  },
  perfectFor: {
    overline: "למי זה מתאים",
    title: "הדירה מושלמת בשביל",
    couples: "זוגות",
    couplesDesc: "שקיעות מנמל יפו, ארוחת ערב רומנטית ב-The Container, וטיול בוקר על חוף הים.",
    families: "משפחות",
    familiesDesc: "דירת 3 חדרים מרווחת, עריסה, מותר עם חיות, מעלית, ושוק הפשפשים 4 דקות ברגל.",
    remote: "עובדים מרחוק",
    remoteDesc: "WiFi מהיר, פינת עבודה שקטה, נספרסו, ושכונה רגועה. תעבדו טוב, תחיו יפה.",
    travelers: "מטיילים",
    travelersDesc: "יפו העתיקה ברגל, רכבת קלה למרכז ת״א ב-15 דקות, והחומוס של אבו חסן 3 דקות מפה.",
  },
  securityBadges: {
    ssl: "חיבור מאובטח",
    payment: "תשלום מאובטח",
    verified: "הזמנה ישירה מול בעל הדירה",
    data: "הפרטים שלכם לא מועברים לאף אחד",
  },
};

const ru: Translations = {
  nav: {
    gallery: "Фото",
    residence: "Квартира",
    contact: "Контакт",
    bookNow: "Бронировать",
  },
  hero: {
    overline: "Яффа, Тель-Авив",
    title: "YaffoTLV",
    tagline: "Ваш дом в Яффе",
  },
  signature: {
    headline: "80 кв.м света, комфорта и всего необходимого",
    subtitle: "Отремонтированная 3-комнатная квартира в тихом районе Яффы. Две спальни, полностью оборудованная кухня, кондиционер в каждой комнате и 10 минут пешком до пляжа.",
  },
  quote: "Тихая улица в Яффо, десять минут пешком до моря — и вся квартира ваша.",
  details: {
    bedrooms: "3 комнаты · 80 м²",
    location: "Яффа, Тель-Авив",
    sea: "10 мин до пляжа",
    vibe: "Тихо и светло",
  },
  amenities: {
    title: "Что включено",
    subtitle: "Всё для комфортного проживания",
    size: "80 м²",
    beds: "3 комнаты · 5 кроватей",
    bathrooms: "1.5 ванных",
    guests: "До 8 гостей",
    renovated: "Ремонт 2024",
    checkin: "Самостоятельный заезд",
    checkout: "Выезд 11:00",
    wifi: "WiFi 1 Гбит/с",
    ac: "Кондиционер везде",
    tv: "ТВ в каждой комнате",
    streaming: "Netflix · Selcom TV",
    kitchen: "Полная кухня",
    nespresso: "Кофемашина Nespresso",
    washer: "Стиральная и сушильная машины",
    parking: "Бесплатная парковка рядом",
    workspace: "Идеально для удалёнки",
    elevator: "Лифт",
    pets: "Можно с питомцами",
    iron: "Утюг",
    hairdryer: "Фен",
    crib: "Детская кроватка",
    selfCheckin: "Вход по коду",
    garden: "Вид на сад",
    shelter: "Бомбоубежище в доме",
    beach: "Рядом с пляжем",
  },
  cta: {
    overline: "Забронируйте",
    headline: "Бронирование",
    description: "Проверьте наличие и забронируйте напрямую. Гибкая отмена включена.",
    bookNow: "Бронировать",
    contactUs: "Связаться",
  },
  slider: {
    title: "Квартира",
    subtitle: "Загляните внутрь",
    rooms: {
      livingRoom: "Гостиная",
      kitchen: "Кухня",
      bedroom1: "Спальня 1",
      bedroom2: "Спальня 2",
      entryway: "Прихожая",
    },
    prev: "Предыдущее фото",
    next: "Следующее фото",
  },
  contactModal: {
    title: "Свяжитесь с нами",
    subtitle: "Вопросы о квартире? Обычно отвечаем в течение часа.",
    name: "Имя",
    email: "Эл. почта",
    message: "Сообщение",
    send: "Отправить",
    sending: "Отправка...",
    thanks: "Спасибо",
    thanksMessage: "Мы получили ваше сообщение и скоро свяжемся с вами.",
    error: "Что-то пошло не так. Попробуйте ещё раз.",
    whatsappCta: "Или напишите нам в WhatsApp",
    close: "Закрыть",
  },
  book: {
    overline: "Забронируйте",
    title: "Бронирование",
    subtitle: "Выберите даты и завершите бронирование.",
    step1: "Шаг 1 из 2",
    step1Title: "Выберите даты",
    step2: "Шаг 2 из 2",
    step2Title: "Данные гостя",
    cancellation: "Бесплатная отмена за 5 дней до заезда (50% в течение 5 дней).",
    checkIn: "Заезд",
    checkOut: "Выезд",
    nights: "ночей",
    guests: "Гости",
    guestName: "Полное имя",
    guestEmail: "Эл. почта",
    guestPhone: "Телефон (необязательно)",
    guestCount: "Количество гостей",
    continue: "Продолжить",
    back: "Назад",
    payNow: "Оплатить",
    perNight: "/ ночь",
    cleaning: "Уборка",
    subtotal: "Промежуточный итог",
    vat: "НДС (18%)",
    total: "Итого",
    datesUnavailable: "Эти ночи уже заняты. Пожалуйста, выберите другие даты.",
    pickDates: "Выберите дату заезда, затем дату выезда. Одна ночь = две даты.",
    pickCheckout: "Теперь выберите дату выезда (утро вашего отъезда).",
    night: "ночь",
    monthFull: "{month} полностью занят.",
    tryMonth: "Попробуйте {month}",
    inclVat: "Цена включает НДС",
  },
  whatsapp: {
    message: "Здравствуйте, меня интересует YaffoTLV 🏡",
  },
  reviews: {
    title: "Отзывы гостей",
    subtitle: "Что говорят наши гости",
    reviewCount: "отзывов",
    viewAll: "Все отзывы на Airbnb",
  },
  socialProof: {
    booked: "",
    rating: "",
    save: "💰 Экономьте 10% при прямом бронировании",
    superhost: "",
  },
  trustBadges: {
    superhost: "Суперхозяин",
    secure: "Безопасная оплата",
    save: "На 10% дешевле",
  },
  gallery: {
    viewAll: "Все фото",
    photoOf: "Фото",
  },
  map: {
    title: "Район",
    subtitle: "Исследуйте Яффу",
  },
  whyDirect: {
    overline: "Почему напрямую",
    title: "Без платформ. Бронируйте здесь.",
    price: "Лучшая цена гарантирована",
    priceDesc: "Всегда на 10% дешевле, чем на Airbnb или Booking.com. Без посредников, без комиссий.",
    contact: "Прямая связь",
    contactDesc: "Пишите хозяину в WhatsApp. Быстрые ответы, личные рекомендации.",
    flexible: "Гибко и просто",
    flexibleDesc: "Бесплатная отмена за 5 дней до заезда, далее возврат 50%. Без скрытых платежей.",
    local: "Местная экспертиза",
    localDesc: "Советы инсайдера, лучшие рестораны и цифровой гид от того, кто знает Яффу лучше всех.",
  },
  host: {
    overline: "Ваш хозяин",
    title: "Знакомьтесь — Эйтан",
    superhost: "Суперхозяин",
    bio: "Родился и вырос в Яффе, принимаю гостей уже больше 12 лет. Отремонтировал эту квартиру в 2024 году с одной целью: чтобы вы чувствовали себя как дома, а не в отеле. Я всегда на связи в WhatsApp — подскажу ресторан, маршрут или просто дам хороший совет.",
    yearsHosting: "12 лет опыта",
    responseTime: "Отвечает за 1 час",
  },
  perfectFor: {
    overline: "Идеально для",
    title: "Для кого эта квартира",
    couples: "Пары",
    couplesDesc: "Романтические закаты в старом порту Яффы, ужин при свечах в The Container и утренние прогулки по пляжу.",
    families: "Семьи",
    familiesDesc: "Просторные 3 комнаты, детская кроватка, можно с питомцами, лифт — и блошиный рынок в 4 минутах.",
    remote: "Удалённые работники",
    remoteDesc: "Быстрый WiFi, рабочее место, кофемашина Nespresso и тихий район. Работайте продуктивно, живите красиво.",
    travelers: "Путешественники",
    travelersDesc: "Старая Яффа пешком, трамвай до центра Тель-Авива за 15 мин, хумус Абу-Хасана в 3 минутах.",
  },
  apartment: {
    overline: "Квартира",
    title: "Дом в сердце Яффо",
    paragraphs: [
      "Квартира отремонтирована в 2024 году и находится на тихой улице в Яффо: три комнаты, две спальни, гостиная, полностью оборудованная кухня и кондиционер в каждой комнате.",
      "Здесь ощущается дом, а не отель: около 80 кв. м, много естественного света и место для 8 человек. Детская кроватка — по запросу.",
      "До пляжа 10 минут пешком. Блошиный рынок Яффо, Abu Hasan и много хороших кафе — в нескольких минутах ходьбы.",
    ],
  },
  securityBadges: {
    ssl: "Защищённое соединение",
    payment: "Безопасная оплата",
    verified: "Бронирование напрямую у владельца",
    data: "Ваши данные не передаются третьим лицам",
  },
};

const fr: Translations = {
  nav: {
    gallery: "Photos",
    residence: "L'Appartement",
    contact: "Contact",
    bookNow: "Réserver",
  },
  hero: {
    overline: "Jaffa, Tel-Aviv",
    title: "YaffoTLV",
    tagline: "Votre chez-vous à Jaffa",
  },
  signature: {
    headline: "80 m² de lumière, de confort et de tout le nécessaire",
    subtitle: "Appartement de 3 pièces rénové dans un quartier calme de Jaffa. Deux chambres, cuisine entièrement équipée, climatisation dans chaque pièce et 10 minutes à pied de la plage.",
  },
  quote: "Une rue calme à Jaffa, dix minutes à pied de la mer — et tout l'appartement est à vous.",
  details: {
    bedrooms: "3 pièces · 80 m²",
    location: "Jaffa, Tel-Aviv",
    sea: "10 min de la plage",
    vibe: "Calme & Lumineux",
  },
  amenities: {
    title: "Ce qui est inclus",
    subtitle: "Tout pour un séjour confortable",
    size: "80 m²",
    beds: "3 pièces · 5 lits",
    bathrooms: "1.5 salles de bain",
    guests: "Jusqu'à 8 personnes",
    renovated: "Rénové en 2024",
    checkin: "Arrivée autonome",
    checkout: "Départ 11h00",
    wifi: "WiFi 1 Gbps",
    ac: "Clim dans chaque pièce",
    tv: "TV dans chaque pièce",
    streaming: "Netflix · Selcom TV",
    kitchen: "Cuisine complète",
    nespresso: "Machine Nespresso",
    washer: "Lave-linge & sèche-linge",
    parking: "Parking gratuit à proximité",
    workspace: "Idéal pour le télétravail",
    elevator: "Ascenseur",
    pets: "Animaux acceptés",
    iron: "Fer à repasser",
    hairdryer: "Sèche-cheveux",
    crib: "Lit bébé disponible",
    selfCheckin: "Entrée par boîte à clé",
    garden: "Vue sur jardin",
    shelter: "Abri sous l'immeuble",
    beach: "Proche de la plage",
  },
  cta: {
    overline: "Réservez votre séjour",
    headline: "Réservation",
    description: "Vérifiez la disponibilité et réservez directement. Annulation flexible incluse.",
    bookNow: "Réserver",
    contactUs: "Nous contacter",
  },
  slider: {
    title: "L'Appartement",
    subtitle: "Jetez un œil à l'intérieur",
    rooms: {
      livingRoom: "Salon",
      kitchen: "Cuisine",
      bedroom1: "Chambre 1",
      bedroom2: "Chambre 2",
      entryway: "Entrée",
    },
    prev: "Photo précédente",
    next: "Photo suivante",
  },
  contactModal: {
    title: "Contactez-nous",
    subtitle: "Des questions sur l'appartement ? Nous répondons généralement en une heure.",
    name: "Nom",
    email: "E-mail",
    message: "Message",
    send: "Envoyer",
    sending: "Envoi en cours...",
    thanks: "Merci",
    thanksMessage: "Nous avons bien reçu votre message et vous contacterons bientôt.",
    error: "Une erreur est survenue. Veuillez réessayer.",
    whatsappCta: "Ou contactez-nous sur WhatsApp",
    close: "Fermer",
  },
  book: {
    overline: "Réservez votre séjour",
    title: "Réservation",
    subtitle: "Sélectionnez vos dates et finalisez votre réservation.",
    step1: "Étape 1 sur 2",
    step1Title: "Choisissez vos dates",
    step2: "Étape 2 sur 2",
    step2Title: "Détails de l'invité",
    cancellation: "Annulation gratuite jusqu'à 5 jours avant l'arrivée (50% ensuite).",
    checkIn: "Arrivée",
    checkOut: "Départ",
    nights: "nuits",
    guests: "Invités",
    guestName: "Nom complet",
    guestEmail: "E-mail",
    guestPhone: "Téléphone (optionnel)",
    guestCount: "Nombre d'invités",
    continue: "Continuer",
    back: "Retour",
    payNow: "Payer",
    perNight: "/ nuit",
    cleaning: "Frais de ménage",
    subtotal: "Sous-total",
    vat: "TVA (18%)",
    total: "Total",
    datesUnavailable: "Ces nuits sont déjà réservées. Veuillez choisir d'autres dates.",
    pickDates: "Choisissez votre date d'arrivée, puis celle de départ. Une nuit = deux dates.",
    pickCheckout: "Choisissez maintenant votre date de départ (le matin où vous partez).",
    night: "nuit",
    monthFull: "{month} est complet.",
    tryMonth: "Essayez {month}",
    inclVat: "Prix TTC",
  },
  whatsapp: {
    message: "Bonjour, je suis intéressé(e) par YaffoTLV 🏡",
  },
  reviews: {
    title: "Avis des voyageurs",
    subtitle: "Ce que disent nos hôtes",
    reviewCount: "avis",
    viewAll: "Voir tous les avis sur Airbnb",
  },
  socialProof: {
    booked: "",
    rating: "",
    save: "💰 Économisez 10% en réservant directement",
    superhost: "",
  },
  trustBadges: {
    superhost: "Superhôte",
    secure: "Paiement sécurisé",
    save: "10% moins cher",
  },
  gallery: {
    viewAll: "Toutes les photos",
    photoOf: "Photo",
  },
  map: {
    title: "Le Quartier",
    subtitle: "Explorez Jaffa",
  },
  whyDirect: {
    overline: "Pourquoi réserver ici",
    title: "Sans intermédiaire. Réservez ici.",
    price: "Meilleur prix garanti",
    priceDesc: "Toujours 10% moins cher qu'Airbnb ou Booking.com. Sans intermédiaire, sans frais cachés.",
    contact: "Communication directe",
    contactDesc: "Échangez directement avec votre hôte sur WhatsApp. Réponses rapides, recommandations personnalisées.",
    flexible: "Flexible et simple",
    flexibleDesc: "Annulation gratuite jusqu'à 5 jours avant l'arrivée, puis remboursement de 50%. Sans frais cachés.",
    local: "Expertise locale",
    localDesc: "Conseils d'initié, restaurants préférés et guide numérique par quelqu'un qui connaît Jaffa par cœur.",
  },
  host: {
    overline: "Votre hôte",
    title: "Rencontrez Eitan",
    superhost: "Superhôte",
    bio: "Né et élevé à Jaffa, j'accueille des voyageurs depuis plus de 12 ans. J'ai rénové cet appartement en 2024 avec un seul objectif : que vous vous sentiez chez vous, pas à l'hôtel. Je suis toujours disponible sur WhatsApp — pour un conseil restaurant, des directions, ou simplement une bonne recommandation.",
    yearsHosting: "12 ans d'accueil",
    responseTime: "Répond en 1 heure",
  },
  perfectFor: {
    overline: "Idéal pour",
    title: "Pour qui est cet appartement",
    couples: "Couples",
    couplesDesc: "Couchers de soleil romantiques depuis le vieux port de Jaffa, dîners aux chandelles au Container, et promenades matinales sur la plage.",
    families: "Familles",
    familiesDesc: "3 pièces spacieuses, lit bébé disponible, animaux acceptés, ascenseur, et le marché aux puces à 4 minutes.",
    remote: "Travailleurs nomades",
    remoteDesc: "WiFi rapide, espace de travail dédié, machine Nespresso et quartier calme. Productif et inspirant.",
    travelers: "Explorateurs",
    travelersDesc: "La vieille Jaffa à pied, tramway vers le centre de Tel-Aviv en 15 min, le houmous d'Abu Hassan à 3 minutes.",
  },
  apartment: {
    overline: "L'appartement",
    title: "Un chez-soi au cœur de Jaffa",
    paragraphs: [
      "Rénové en 2024, cet appartement lumineux de 3 pièces se trouve dans une rue calme de Jaffa : deux chambres, un salon confortable, une cuisine entièrement équipée et la climatisation dans chaque pièce.",
      "Il est pensé comme une maison, pas comme un hôtel : environ 80 m², beaucoup de lumière naturelle et de la place pour 8 personnes. Lit bébé sur demande.",
      "La plage est à 10 minutes à pied. Le marché aux puces de Jaffa, Abu Hasan et de nombreux bons cafés sont à quelques minutes.",
    ],
  },
  securityBadges: {
    ssl: "Connexion sécurisée",
    payment: "Paiement sécurisé",
    verified: "Réservez directement auprès du propriétaire",
    data: "Vos données ne sont jamais partagées",
  },
};

const es: Translations = {
  nav: {
    gallery: "Fotos",
    residence: "El Apartamento",
    contact: "Contacto",
    bookNow: "Reservar",
  },
  hero: {
    overline: "Jaffa, Tel Aviv",
    title: "YaffoTLV",
    tagline: "Tu hogar en Jaffa",
  },
  signature: {
    headline: "80 m² de luz, confort y todo lo que necesitas",
    subtitle: "Apartamento de 3 habitaciones renovado en un barrio tranquilo de Jaffa. Dos dormitorios, cocina totalmente equipada, aire acondicionado en cada habitación y 10 minutos a pie de la playa.",
  },
  quote: "Una calle tranquila en Jaffa, a diez minutos a pie del mar — y todo el apartamento es tuyo.",
  details: {
    bedrooms: "3 hab. · 80 m²",
    location: "Jaffa, Tel Aviv",
    sea: "10 min a la playa",
    vibe: "Tranquilo y Luminoso",
  },
  amenities: {
    title: "Qué incluye",
    subtitle: "Todo para una estancia cómoda",
    size: "80 m²",
    beds: "3 habitaciones · 5 camas",
    bathrooms: "1.5 baños",
    guests: "Hasta 8 huéspedes",
    renovated: "Renovado 2024",
    checkin: "Auto check-in",
    checkout: "Check-out 11:00",
    wifi: "WiFi 1 Gbps",
    ac: "Aire acondicionado en todo",
    tv: "TV en cada habitación",
    streaming: "Netflix · Selcom TV",
    kitchen: "Cocina completa",
    nespresso: "Cafetera Nespresso",
    washer: "Lavadora y secadora",
    parking: "Aparcamiento gratis cerca",
    workspace: "Ideal para teletrabajo",
    elevator: "Ascensor",
    pets: "Se admiten mascotas",
    iron: "Plancha",
    hairdryer: "Secador de pelo",
    crib: "Cuna disponible",
    selfCheckin: "Entrada con caja de llaves",
    garden: "Vista al jardín",
    shelter: "Refugio bajo el edificio",
    beach: "Cerca de la playa",
  },
  cta: {
    overline: "Reserva tu estancia",
    headline: "Reserva",
    description: "Consulta disponibilidad y reserva directamente. Cancelación flexible incluida.",
    bookNow: "Reservar",
    contactUs: "Contáctanos",
  },
  slider: {
    title: "El Apartamento",
    subtitle: "Echa un vistazo",
    rooms: {
      livingRoom: "Salón",
      kitchen: "Cocina",
      bedroom1: "Dormitorio 1",
      bedroom2: "Dormitorio 2",
      entryway: "Entrada",
    },
    prev: "Foto anterior",
    next: "Foto siguiente",
  },
  contactModal: {
    title: "Contacto",
    subtitle: "¿Preguntas sobre el apartamento? Normalmente respondemos en una hora.",
    name: "Nombre",
    email: "Correo",
    message: "Mensaje",
    send: "Enviar",
    sending: "Enviando...",
    thanks: "Gracias",
    thanksMessage: "Hemos recibido tu mensaje y te contactaremos pronto.",
    error: "Algo salió mal. Por favor, inténtalo de nuevo.",
    whatsappCta: "O escríbenos por WhatsApp",
    close: "Cerrar",
  },
  book: {
    overline: "Reserva tu estancia",
    title: "Reserva",
    subtitle: "Selecciona tus fechas y completa tu reserva.",
    step1: "Paso 1 de 2",
    step1Title: "Elige tus fechas",
    step2: "Paso 2 de 2",
    step2Title: "Datos del huésped",
    cancellation: "Cancelación gratis hasta 5 días antes del check-in (50% después).",
    checkIn: "Llegada",
    checkOut: "Salida",
    nights: "noches",
    guests: "Huéspedes",
    guestName: "Nombre completo",
    guestEmail: "Correo",
    guestPhone: "Teléfono (opcional)",
    guestCount: "Número de huéspedes",
    continue: "Continuar",
    back: "Volver",
    payNow: "Pagar",
    perNight: "/ noche",
    cleaning: "Limpieza",
    subtotal: "Subtotal",
    vat: "IVA (18%)",
    total: "Total",
    datesUnavailable: "Esas noches ya están reservadas. Por favor elige otras fechas.",
    pickDates: "Elige tu fecha de entrada y luego la de salida. Una noche = dos fechas.",
    pickCheckout: "Ahora elige tu fecha de salida (la mañana en que te vas).",
    night: "noche",
    monthFull: "{month} está completo.",
    tryMonth: "Prueba {month}",
    inclVat: "Precio incluye IVA",
  },
  whatsapp: {
    message: "Hola, me interesa YaffoTLV 🏡",
  },
  reviews: {
    title: "Opiniones de huéspedes",
    subtitle: "Lo que dicen nuestros huéspedes",
    reviewCount: "opiniones",
    viewAll: "Ver todas las opiniones en Airbnb",
  },
  socialProof: {
    booked: "",
    rating: "",
    save: "💰 Ahorra 10% reservando directo",
    superhost: "",
  },
  trustBadges: {
    superhost: "Superhost",
    secure: "Pago seguro",
    save: "10% más barato",
  },
  gallery: {
    viewAll: "Todas las fotos",
    photoOf: "Foto",
  },
  map: {
    title: "El Barrio",
    subtitle: "Explora Jaffa",
  },
  whyDirect: {
    overline: "Por qué directo",
    title: "Sin plataformas. Reserva aquí.",
    price: "Mejor precio garantizado",
    priceDesc: "Siempre 10% más barato que Airbnb o Booking.com. Sin intermediarios, sin comisiones.",
    contact: "Comunicación directa",
    contactDesc: "Habla directamente con tu anfitrión por WhatsApp. Respuestas rápidas, recomendaciones personales.",
    flexible: "Flexible y fácil",
    flexibleDesc: "Cancelación gratuita hasta 5 días antes del check-in, después 50%. Sin cargos ocultos.",
    local: "Experiencia local",
    localDesc: "Consejos de experto, mejores restaurantes y una guía digital de alguien que conoce Jaffa de verdad.",
  },
  host: {
    overline: "Tu anfitrión",
    title: "Conoce a Eitan",
    superhost: "Superhost",
    bio: "Nacido y criado en Jaffa, llevo más de 12 años recibiendo huéspedes. Renové este apartamento en 2024 con un objetivo: que te sientas en casa, no en un hotel. Siempre estoy disponible por WhatsApp — para recomendaciones de restaurantes, direcciones, o cualquier consejo.",
    yearsHosting: "12 años de experiencia",
    responseTime: "Responde en 1 hora",
  },
  perfectFor: {
    overline: "Perfecto para",
    title: "Para quién es este apartamento",
    couples: "Parejas",
    couplesDesc: "Atardeceres románticos desde el puerto de Jaffa, cenas con velas en The Container y paseos matutinos por la playa.",
    families: "Familias",
    familiesDesc: "3 habitaciones amplias, cuna disponible, se admiten mascotas, ascensor, y el mercado de pulgas a 4 minutos.",
    remote: "Nómadas digitales",
    remoteDesc: "WiFi rápido, espacio de trabajo, cafetera Nespresso y barrio tranquilo. Productividad con estilo de vida.",
    travelers: "Exploradores",
    travelersDesc: "Jaffa antigua a pie, tranvía al centro de Tel Aviv en 15 min, el hummus de Abu Hassan a 3 minutos.",
  },
  apartment: {
    overline: "El apartamento",
    title: "Un hogar en el corazón de Jaffa",
    paragraphs: [
      "Renovado en 2024, este luminoso apartamento de 3 habitaciones está en una calle tranquila de Jaffa: dos dormitorios, un salón cómodo, una cocina totalmente equipada y aire acondicionado en cada habitación.",
      "Está pensado para sentirse como una casa, no como un hotel: unos 80 m², mucha luz natural y sitio para 8 personas. Cuna disponible bajo petición.",
      "La playa está a 10 minutos a pie. El mercadillo de Jaffa, Abu Hasan y muchos buenos cafés quedan a pocos minutos.",
    ],
  },
  securityBadges: {
    ssl: "Conexión cifrada",
    payment: "Pago seguro",
    verified: "Reserva directa con el propietario",
    data: "Tus datos nunca se comparten",
  },
};

const ar: Translations = {
  nav: {
    gallery: "صور",
    reviews: "تقييمات",
    residence: "الشقة",
    contact: "اتصل بنا",
    bookNow: "احجز الآن",
  },
  hero: {
    overline: "يافا، تل أبيب",
    title: "YaffoTLV",
    tagline: "بيتكم في يافا",
  },
  signature: {
    headline: "80 متر مربع من الضوء والراحة وكل ما تحتاجون",
    subtitle: "شقة من 3 غرف مجددة في حي هادئ في يافا. غرفتا نوم، مطبخ مجهز بالكامل، تكييف في كل غرفة، و10 دقائق سيراً من الشاطئ.",
  },
  quote: "شارع هادئ في يافا، عشر دقائق سيراً عن البحر — والشقة كلها لكم.",
  details: {
    bedrooms: "3 غرف · 80 م²",
    location: "يافا، تل أبيب",
    sea: "10 دقائق من الشاطئ",
    vibe: "هادئ ومشرق",
  },
  amenities: {
    title: "ماذا يشمل",
    subtitle: "كل ما تحتاجه لإقامة مريحة",
    size: "80 م²",
    beds: "3 غرف · 5 أسرّة",
    bathrooms: "حمام ونصف",
    guests: "حتى 8 ضيوف",
    renovated: "تم التجديد 2024",
    checkin: "تسجيل وصول ذاتي",
    checkout: "المغادرة 11:00",
    wifi: "واي فاي 1 جيجابت",
    ac: "تكييف في كل غرفة",
    tv: "تلفزيون في كل غرفة",
    streaming: "نتفليكس · Selcom TV",
    kitchen: "مطبخ كامل",
    nespresso: "ماكينة نسبريسو",
    washer: "غسالة ومجفف",
    parking: "موقف مجاني قريب",
    workspace: "مثالي للعمل عن بُعد",
    elevator: "مصعد",
    pets: "يُسمح بالحيوانات الأليفة",
    iron: "مكواة",
    hairdryer: "مجفف شعر",
    crib: "سرير أطفال متوفر",
    selfCheckin: "دخول بصندوق مفاتيح",
    garden: "إطلالة على الحديقة",
    shelter: "ملجأ تحت المبنى",
    beach: "قريب من الشاطئ",
  },
  cta: {
    overline: "احجز إقامتك",
    headline: "احجز الآن",
    description: "تحقق من التوفر واحجز مباشرة. إلغاء مرن مشمول.",
    bookNow: "احجز الآن",
    contactUs: "اتصل بنا",
  },
  slider: {
    title: "الشقة",
    subtitle: "ألقِ نظرة من الداخل",
    rooms: {
      livingRoom: "غرفة المعيشة",
      kitchen: "المطبخ",
      bedroom1: "غرفة نوم 1",
      bedroom2: "غرفة نوم 2",
      entryway: "المدخل",
    },
    prev: "الصورة السابقة",
    next: "الصورة التالية",
  },
  contactModal: {
    title: "تواصل معنا",
    subtitle: "أسئلة عن الشقة؟ عادةً نرد خلال ساعة.",
    name: "الاسم",
    email: "البريد الإلكتروني",
    message: "الرسالة",
    send: "إرسال",
    sending: "جارٍ الإرسال...",
    thanks: "شكراً",
    thanksMessage: "لقد تلقينا رسالتك وسنتواصل معك قريباً.",
    error: "حدث خطأ. يرجى المحاولة مرة أخرى.",
    whatsappCta: "أو راسلنا عبر واتساب",
    close: "إغلاق",
  },
  book: {
    overline: "احجز إقامتك",
    title: "الحجز",
    subtitle: "اختر تواريخك وأكمل حجزك.",
    step1: "الخطوة 1 من 2",
    step1Title: "اختر التواريخ",
    step2: "الخطوة 2 من 2",
    step2Title: "بيانات الضيف",
    cancellation: "إلغاء مجاني حتى 5 أيام قبل الوصول (50% خلال 5 أيام).",
    discount: "خصم",
    agreeRules: "لقد قرأت وأوافق على قواعد المنزل وشروط الخدمة وسياسة الإلغاء.",
    promo: "رمز ترويجي",
    apply: "تطبيق",
    promoApplied: "تم تطبيق الرمز!",
    promoInvalid: "الرمز غير صالح.",
    requestBook: "اطلب الحجز عبر واتساب",
    inquiryNote: "الدفع الإلكتروني قريبًا — احجز تواريخك عبر واتساب وسنؤكد التوفر فورًا.",
    checkIn: "الوصول",
    checkOut: "المغادرة",
    nights: "ليالٍ",
    guests: "الضيوف",
    guestName: "الاسم الكامل",
    guestEmail: "البريد الإلكتروني",
    guestPhone: "الهاتف (اختياري)",
    guestCount: "عدد الضيوف",
    continue: "متابعة",
    back: "رجوع",
    payNow: "ادفع الآن",
    perNight: "/ ليلة",
    cleaning: "رسوم التنظيف",
    subtotal: "المجموع الفرعي",
    vat: "ضريبة القيمة المضافة (18%)",
    total: "المجموع",
    datesUnavailable: "هذه الليالي محجوزة بالفعل. يرجى اختيار تواريخ أخرى.",
    pickDates: "اختر تاريخ الوصول ثم تاريخ المغادرة. ليلة واحدة = تاريخان.",
    pickCheckout: "الآن اختر تاريخ المغادرة (صباح يوم رحيلك).",
    night: "ليلة",
    monthFull: "{month} محجوز بالكامل.",
    tryMonth: "جرب {month}",
    inclVat: "السعر شامل الضريبة",
  },
  whatsapp: {
    message: "مرحباً، أنا مهتم بـ YaffoTLV 🏡",
  },
  reviews: {
    title: "آراء الضيوف",
    subtitle: "ماذا يقول ضيوفنا",
    reviewCount: "تقييم",
    viewAll: "جميع التقييمات على Airbnb",
    seeAll: "كل التقييمات",
    verified: "موثّق على Airbnb",
  },
  socialProof: {
    booked: "",
    rating: "",
    save: "💰 وفر 10% عند الحجز المباشر",
    superhost: "",
  },
  footer: {
    tagline: "شقة بغرفتي نوم في يافا، تل أبيب · إيجار قصير الأمد.",
    terms: "شروط الخدمة",
    privacy: "سياسة الخصوصية",
    cancellation: "سياسة الإلغاء",
    rights: "جميع الحقوق محفوظة.",
  },
  apartment: {
    overline: "الشقة",
    title: "بيت في قلب يافا",
    paragraphs: [
      "تم تجديد الشقة في 2024 وتقع في شارع هادئ في يافا: ثلاث غرف، غرفتا نوم، صالة مريحة، مطبخ مجهز بالكامل وتكييف في كل غرفة.",
      "صُممت لتشعر وكأنها بيت لا فندق: نحو 80 م²، إضاءة طبيعية وفيرة، وتتسع لثمانية أشخاص. يتوفر سرير أطفال عند الطلب.",
      "الشاطئ على بعد 10 دقائق سيراً. سوق البراغيث وأبو حسن والكثير من المقاهي الجيدة على بعد دقائق.",
    ],
  },
  sleeping: {
    overline: "المكان",
    title: "يتسع بشكل مريح حتى 8 ضيوف",
    bedroom: "غرفة نوم",
    doubleBed: "سرير مزدوج",
    living: "غرفة المعيشة",
    livingBeds: "أريكة سرير مزدوجة، وأريكة، وسرير مفرد قابل للطي",
    cot: "سرير أطفال متوفر عند الطلب",
    parking: "وقوف مجاني في الشارع 19:00–09:00؛ مدفوع نهارًا (~6₪/ساعة عبر تطبيق Cello).",
  },
  houseRules: {
    title: "قواعد المنزل",
    intro: "بحجزك، فإنك توافق على قواعد المنزل التالية:",
    rules: [
      "ممنوع التدخين داخل الشقة (غرامة 200 دولار عن كل يوم محجوز).",
      "ممنوع الحفلات والفعاليات الصاخبة.",
      "ساعات الهدوء من 21:00 إلى 08:00. يرجى احترام الجيران.",
      "غرامة 100 دولار عن كل يوم محجوز ولكل ضيف عند تجاوز عدد الضيوف المحجوز. يجب تحديث أي تغيير في عدد الضيوف مسبقًا.",
      "يجب أن يكون لديك رقم هاتف صالح وفعّال قبل الحجز.",
      "إذا تُركت الشقة متسخة بشكل مفرط (أكثر مما يتركه ضيف مراعٍ)، تُطبّق رسوم تنظيف إضافية قدرها 100 دولار.",
      "مخالفة أي من قواعد المنزل تُعد سببًا لإنهاء الإقامة فورًا دون استرداد.",
    ],
  },
  trustBadges: {
    superhost: "مضيف متميز",
    secure: "دفع آمن",
    save: "أرخص بـ 10%",
  },
  gallery: {
    viewAll: "جميع الصور",
    photoOf: "صورة",
  },
  map: {
    title: "الحي",
    subtitle: "اكتشف يافا",
  },
  whyDirect: {
    overline: "لماذا الحجز المباشر",
    title: "بدون منصات. احجز هنا.",
    price: "أفضل سعر مضمون",
    priceDesc: "دائماً أرخص بـ 10% من Airbnb أو Booking.com. بدون وسيط، بدون رسوم إضافية.",
    contact: "تواصل مباشر",
    contactDesc: "تحدث مباشرة مع المضيف عبر واتساب. إجابات سريعة وتوصيات شخصية.",
    flexible: "مرن وسهل",
    flexibleDesc: "إلغاء مجاني حتى 5 أيام قبل الوصول، وبعدها استرداد 50%. بدون رسوم خفية.",
    local: "خبرة محلية",
    localDesc: "نصائح من الداخل، أفضل المطاعم، ودليل رقمي من شخص يعرف يافا أفضل من الجميع.",
  },
  host: {
    overline: "مضيفكم",
    title: "تعرفوا على إيتان",
    superhost: "مضيف متميز",
    bio: "ولدت وترعرعت في يافا، وأستضيف ضيوفاً منذ أكثر من 12 عاماً. جددت هذه الشقة عام 2024 بهدف واحد: أن تشعروا كأنكم في بيتكم، وليس في فندق. أنا دائماً متاح على واتساب — للتوصية بمطعم، للمساعدة في التنقل، أو لأي نصيحة.",
    yearsHosting: "12 سنة استضافة",
    responseTime: "يرد خلال ساعة",
  },
  perfectFor: {
    overline: "مثالي لـ",
    title: "لمن هذه الشقة",
    couples: "الأزواج",
    couplesDesc: "غروب رومانسي من ميناء يافا القديم، عشاء على ضوء الشموع في The Container، ومشي صباحي على الشاطئ.",
    families: "العائلات",
    familiesDesc: "3 غرف واسعة، سرير أطفال، يُسمح بالحيوانات الأليفة، مصعد، وسوق البراغيث على بعد 4 دقائق.",
    remote: "العمل عن بُعد",
    remoteDesc: "واي فاي سريع، مساحة عمل، ماكينة نسبريسو وحي هادئ. إنتاجية مع أسلوب حياة.",
    travelers: "المستكشفون",
    travelersDesc: "يافا القديمة سيراً، قطار خفيف لوسط تل أبيب في 15 دقيقة، حمص أبو حسن على بعد 3 دقائق.",
  },
  securityBadges: {
    ssl: "اتصال مشفّر",
    payment: "دفع آمن",
    verified: "احجز مباشرة مع المالك",
    data: "بياناتك لا تُشارك أبدًا",
  },
};

export const translations: Record<Locale, Translations> = { en, he, ru, fr, es, ar };
