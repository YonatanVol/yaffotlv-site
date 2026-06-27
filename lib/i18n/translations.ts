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
    promo?: string;
    apply?: string;
    promoApplied?: string;
    promoInvalid?: string;
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
    residence: "The Apartment",
    contact: "Contact",
    bookNow: "Book Now",
  },
  hero: {
    overline: "Jaffa, Tel Aviv",
    title: "YaffoTLV",
    tagline: "Where heritage meets horizon",
  },
  signature: {
    headline: "80 sqm of light, comfort and everything you need",
    subtitle: "Newly renovated 3-room apartment in a quiet Jaffa neighborhood. Two bedrooms, a fully equipped kitchen, AC in every room, and a 10-minute walk to the beach. Designed for guests who want to feel at home.",
  },
  quote: "In the oldest port city on the Mediterranean, where every stone holds a story — a private stay, designed for you.",
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
    guests: "Up to 6 guests",
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
    promo: "Promo code",
    apply: "Apply",
    promoApplied: "Promo code applied!",
    promoInvalid: "That code isn't valid.",
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
  },
  socialProof: {
    booked: "🔥 3 guests booked this week",
    rating: "★★★★★ Rated by 140+ guests",
    save: "💰 Save 10% when you book direct",
    superhost: "🏆 Superhost · 12 years hosting",
  },
  footer: {
    tagline: "Luxury 2-bedroom apartment · short-term rental in Jaffa, Tel Aviv.",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    cancellation: "Cancellation Policy",
    rights: "All rights reserved.",
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
    flexibleDesc: "Free cancellation up to 3 days before check-in. No hidden charges, no surprises.",
    local: "Local Expertise",
    localDesc: "Get insider tips, restaurant picks, and a digital guide from someone who knows Jaffa best.",
  },
  host: {
    overline: "Your Host",
    title: "Meet Eitan",
    superhost: "Superhost",
    bio: "Born and raised in Jaffa, I've been hosting guests for over 12 years. I renovated this apartment in 2024 with one goal: to make you feel at home, not in a hotel. I'm always a WhatsApp message away if you need anything — restaurant tips, directions, or just a friendly recommendation.",
    yearsHosting: "12 years hosting",
    responseTime: "Responds in 1 hour",
  },
  perfectFor: {
    overline: "Perfect For",
    title: "Who stays here",
    couples: "Couples",
    couplesDesc: "Romantic sunsets from Old Jaffa Port, candlelit dinners at The Container, and morning walks on the beach.",
    families: "Families",
    familiesDesc: "Spacious 3 rooms, crib available, pet-friendly, elevator, and the Flea Market is a 4-minute walk.",
    remote: "Remote Workers",
    remoteDesc: "Fast WiFi, dedicated workspace, Nespresso machine, and quiet neighborhood. Stay productive, live beautifully.",
    travelers: "Explorers",
    travelersDesc: "Walk to Old Jaffa, light rail to Tel Aviv center in 15 min, Abu Hasan hummus 3 minutes away.",
  },
};

// ── Hebrew — warm, natural Israeli tone ────────────────────────────
const he: Translations = {
  nav: {
    gallery: "גלריה",
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
  quote: "בעיר הנמל הכי עתיקה בים התיכון, בין סמטאות אבן ושקיעות על המים — דירה פרטית שמחכה רק לכם.",
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
    guests: "עד 6 אורחים",
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
    promo: "קוד קופון",
    apply: "החל",
    promoApplied: "הקוד הופעל!",
    promoInvalid: "הקוד אינו תקף.",
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
    inclVat: "המחיר כולל מע״מ",
  },
  whatsapp: {
    message: "היי, רציתי לשמוע על הדירה ביפו 🏡",
  },
  reviews: {
    title: "מה אורחים כותבים",
    subtitle: "מתוך 140+ ביקורות",
    reviewCount: "ביקורות",
    viewAll: "כל הביקורות ב-Airbnb →",
  },
  socialProof: {
    booked: "🔥 3 אורחים הזמינו השבוע",
    rating: "★★★★★ מדורג ע״י 140+ אורחים",
    save: "💰 חוסכים 10% בהזמנה ישירה",
    superhost: "🏆 סופרהוסט · 12 שנים של אירוח",
  },
  footer: {
    tagline: "דירת יוקרה בת 2 חדרי שינה · השכרה לטווח קצר ביפו, תל אביב.",
    terms: "תנאי שימוש",
    privacy: "מדיניות פרטיות",
    cancellation: "מדיניות ביטולים",
    rights: "כל הזכויות שמורות.",
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
    flexibleDesc: "ביטול חינם עד 24 שעות לפני. בלי אותיות קטנות, בלי הפתעות.",
    local: "טיפים של מקומי",
    localDesc: "מסעדות, חופים, מקומות שרק יפואי אמיתי מכיר — הכל בשבילכם.",
  },
  host: {
    overline: "המארח שלכם",
    title: "הכירו את איתן",
    superhost: "סופרהוסט",
    bio: "נולדתי וגדלתי ביפו, ומארח אורחים כבר יותר מ-12 שנה. שיפצתי את הדירה ב-2024 עם מטרה אחת: שתרגישו בבית, לא במלון. אני תמיד זמין בוואטסאפ — בשביל המלצה על מסעדה, עזרה עם ניווט, או סתם טיפ טוב.",
    yearsHosting: "12 שנים של אירוח",
    responseTime: "עונה תוך שעה",
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
  quote: "В древнейшем портовом городе Средиземноморья, где каждый камень хранит историю — частная квартира, подготовленная для вас.",
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
    guests: "До 6 гостей",
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
    booked: "🔥 3 гостя забронировали на этой неделе",
    rating: "★★★★★ Оценка 140+ гостей",
    save: "💰 Экономьте 10% при прямом бронировании",
    superhost: "🏆 Суперхозяин · 12 лет опыта",
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
    flexibleDesc: "Бесплатная отмена за 3 дня до заезда. Без скрытых платежей, без сюрпризов.",
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
  quote: "Dans le plus ancien port de la Méditerranée, où chaque pierre raconte une histoire — un appartement privé, préparé pour vous.",
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
    guests: "Jusqu'à 6 personnes",
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
    booked: "🔥 3 voyageurs ont réservé cette semaine",
    rating: "★★★★★ Noté par 140+ voyageurs",
    save: "💰 Économisez 10% en réservant directement",
    superhost: "🏆 Superhôte · 12 ans d'expérience",
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
    flexibleDesc: "Annulation gratuite jusqu'à 3 jours avant l'arrivée. Sans surprises, sans frais cachés.",
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
  quote: "En la ciudad portuaria más antigua del Mediterráneo, donde cada piedra guarda una historia — un apartamento privado, preparado para ti.",
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
    guests: "Hasta 6 huéspedes",
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
    booked: "🔥 3 huéspedes reservaron esta semana",
    rating: "★★★★★ Valorado por 140+ huéspedes",
    save: "💰 Ahorra 10% reservando directo",
    superhost: "🏆 Superhost · 12 años de experiencia",
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
    flexibleDesc: "Cancelación gratuita hasta 3 días antes del check-in. Sin cargos ocultos, sin sorpresas.",
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
};

const ar: Translations = {
  nav: {
    gallery: "صور",
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
  quote: "في أقدم مدينة ميناء على البحر المتوسط، حيث كل حجر يحكي قصة — شقة خاصة، جاهزة من أجلكم.",
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
    guests: "حتى 6 ضيوف",
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
  },
  socialProof: {
    booked: "🔥 3 ضيوف حجزوا هذا الأسبوع",
    rating: "★★★★★ تقييم من 140+ ضيف",
    save: "💰 وفر 10% عند الحجز المباشر",
    superhost: "🏆 مضيف متميز · 12 سنة خبرة",
  },
  footer: {
    tagline: "شقة فاخرة بغرفتي نوم · إيجار قصير الأمد في يافا، تل أبيب.",
    terms: "شروط الخدمة",
    privacy: "سياسة الخصوصية",
    cancellation: "سياسة الإلغاء",
    rights: "جميع الحقوق محفوظة.",
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
    flexibleDesc: "إلغاء مجاني حتى 3 أيام قبل الوصول. بدون رسوم خفية، بدون مفاجآت.",
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
};

export const translations: Record<Locale, Translations> = { en, he, ru, fr, es, ar };
