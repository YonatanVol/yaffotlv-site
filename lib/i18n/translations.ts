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
    thanks: string;
    thanksMessage: string;
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
    total: string;
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
    wifi: "Fast WiFi",
    ac: "AC in every room",
    tv: "Smart TV · Netflix",
    kitchen: "Full kitchen",
    nespresso: "Nespresso machine",
    washer: "Washer & dryer",
    parking: "Free parking nearby",
    workspace: "Dedicated workspace",
    elevator: "Elevator",
    pets: "Pet friendly",
    iron: "Iron",
    hairdryer: "Hair dryer",
    crib: "Crib available",
    selfCheckin: "Lockbox entry",
    garden: "Garden view",
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
    thanks: "Thank you",
    thanksMessage: "We'll be in touch soon.",
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
    cancellation: "Flexible cancellation: full refund up to 24 hours before check-in.",
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
    total: "Total",
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
    rating: "⭐ Rated 4.71/5 by 140+ guests",
    save: "💰 Save 10% when you book direct",
    superhost: "🏆 Superhost · 12 years hosting",
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
};

// ── Hebrew — fresh, direct, no clichés ────────────────────────────
const he: Translations = {
  nav: {
    gallery: "תמונות",
    residence: "על הדירה",
    contact: "יצירת קשר",
    bookNow: "להזמנה",
  },
  hero: {
    overline: "יפו, תל אביב",
    title: "YaffoTLV",
    tagline: "הבית שלכם ביפו",
  },
  signature: {
    headline: "80 מ״ר של אור, נוחות וכל מה שצריך",
    subtitle: "דירת 3 חדרים משופצת בשכונה שקטה ביפו. שני חדרי שינה, מטבח מאובזר, מיזוג בכל חדר, ו-10 דקות הליכה מהחוף. תוכננה לאורחים שרוצים להרגיש בבית.",
  },
  quote: "בעיר הנמל הכי עתיקה בים התיכון, שם כל אבן מספרת משהו — דירה פרטית, מוכנה בשבילכם.",
  details: {
    bedrooms: "3 חדרים · 80 מ״ר",
    location: "יפו, תל אביב",
    sea: "10 דק׳ מהחוף",
    vibe: "שקט ומואר",
  },
  amenities: {
    title: "מה כלול",
    subtitle: "כל מה שצריך לשהייה נוחה",
    size: "80 מ״ר",
    beds: "3 חדרים · 5 מיטות",
    bathrooms: "חדר רחצה וחצי",
    guests: "עד 6 אורחים",
    renovated: "שופצה ב-2024",
    checkin: "צ׳ק-אין עצמאי",
    checkout: "צ׳ק-אאוט 11:00",
    wifi: "WiFi מהיר",
    ac: "מיזוג בכל חדר",
    tv: "טלוויזיה · נטפליקס",
    kitchen: "מטבח מלא",
    nespresso: "מכונת נספרסו",
    washer: "מכונת כביסה ומייבש",
    parking: "חניה חינם בסביבה",
    workspace: "פינת עבודה",
    elevator: "מעלית",
    pets: "מותר עם חיות מחמד",
    iron: "מגהץ",
    hairdryer: "מייבש שיער",
    crib: "עריסה לתינוק",
    selfCheckin: "כניסה עם קודן",
    garden: "נוף לגינה",
    beach: "קרוב לחוף",
  },
  cta: {
    overline: "הזמינו מקום",
    headline: "להזמנה",
    description: "בדקו זמינות והזמינו ישירות. ביטול גמיש כלול.",
    bookNow: "להזמנה",
    contactUs: "שאלות? דברו איתנו",
  },
  slider: {
    title: "הדירה",
    subtitle: "הציצו פנימה",
    rooms: {
      livingRoom: "סלון",
      kitchen: "מטבח",
      bedroom1: "חדר שינה 1",
      bedroom2: "חדר שינה 2",
      entryway: "כניסה",
    },
    prev: "תמונה קודמת",
    next: "תמונה הבאה",
  },
  contactModal: {
    title: "דברו איתנו",
    subtitle: "שאלות על הדירה? בדרך כלל חוזרים תוך שעה.",
    name: "שם",
    email: "אימייל",
    message: "הודעה",
    send: "שליחה",
    thanks: "תודה",
    thanksMessage: "נחזור אליכם בהקדם.",
    close: "סגירה",
  },
  book: {
    overline: "הזמינו מקום",
    title: "הזמנה",
    subtitle: "בחרו תאריכים וסגרו הזמנה.",
    step1: "שלב 1 מתוך 2",
    step1Title: "בחרו תאריכים",
    step2: "שלב 2 מתוך 2",
    step2Title: "פרטי האורח",
    cancellation: "ביטול גמיש: החזר מלא עד 24 שעות לפני הגעה.",
    checkIn: "הגעה",
    checkOut: "עזיבה",
    nights: "לילות",
    guests: "אורחים",
    guestName: "שם מלא",
    guestEmail: "אימייל",
    guestPhone: "טלפון (לא חובה)",
    guestCount: "מספר אורחים",
    continue: "המשך",
    back: "חזרה",
    payNow: "לתשלום",
    perNight: "/ לילה",
    cleaning: "דמי ניקיון",
    total: "סה״כ",
  },
  whatsapp: {
    message: "היי, אשמח לשמוע על YaffoTLV 🏡",
  },
  reviews: {
    title: "ביקורות אורחים",
    subtitle: "מה אורחים אומרים",
    reviewCount: "ביקורות",
    viewAll: "לכל הביקורות ב-Airbnb",
  },
  socialProof: {
    booked: "🔥 3 אורחים הזמינו השבוע",
    rating: "⭐ דירוג 4.71/5 מ-140+ ביקורות",
    save: "💰 חסכו 10% בהזמנה ישירה",
    superhost: "🏆 סופרהוסט · 12 שנות אירוח",
  },
  trustBadges: {
    superhost: "סופרהוסט",
    secure: "תשלום מאובטח",
    save: "10% זול יותר",
  },
  gallery: {
    viewAll: "כל התמונות",
    photoOf: "תמונה",
  },
  map: {
    title: "השכונה",
    subtitle: "גלו את יפו",
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
    wifi: "Быстрый WiFi",
    ac: "Кондиционер везде",
    tv: "Smart TV · Netflix",
    kitchen: "Полная кухня",
    nespresso: "Кофемашина Nespresso",
    washer: "Стиральная и сушильная машины",
    parking: "Бесплатная парковка рядом",
    workspace: "Рабочее место",
    elevator: "Лифт",
    pets: "Можно с питомцами",
    iron: "Утюг",
    hairdryer: "Фен",
    crib: "Детская кроватка",
    selfCheckin: "Вход по коду",
    garden: "Вид на сад",
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
    thanks: "Спасибо",
    thanksMessage: "Мы скоро свяжемся с вами.",
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
    cancellation: "Гибкая отмена: полный возврат до 24 часов до заезда.",
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
    total: "Итого",
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
    rating: "⭐ Рейтинг 4.71/5 от 140+ гостей",
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
    wifi: "WiFi rapide",
    ac: "Clim dans chaque pièce",
    tv: "Smart TV · Netflix",
    kitchen: "Cuisine complète",
    nespresso: "Machine Nespresso",
    washer: "Lave-linge & sèche-linge",
    parking: "Parking gratuit à proximité",
    workspace: "Espace de travail",
    elevator: "Ascenseur",
    pets: "Animaux acceptés",
    iron: "Fer à repasser",
    hairdryer: "Sèche-cheveux",
    crib: "Lit bébé disponible",
    selfCheckin: "Entrée par boîte à clé",
    garden: "Vue sur jardin",
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
    thanks: "Merci",
    thanksMessage: "Nous vous contacterons bientôt.",
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
    cancellation: "Annulation flexible : remboursement intégral jusqu'à 24h avant l'arrivée.",
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
    total: "Total",
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
    rating: "⭐ Noté 4.71/5 par 140+ voyageurs",
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
    wifi: "WiFi rápido",
    ac: "Aire acondicionado en todo",
    tv: "Smart TV · Netflix",
    kitchen: "Cocina completa",
    nespresso: "Cafetera Nespresso",
    washer: "Lavadora y secadora",
    parking: "Aparcamiento gratis cerca",
    workspace: "Espacio de trabajo",
    elevator: "Ascensor",
    pets: "Se admiten mascotas",
    iron: "Plancha",
    hairdryer: "Secador de pelo",
    crib: "Cuna disponible",
    selfCheckin: "Entrada con caja de llaves",
    garden: "Vista al jardín",
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
    thanks: "Gracias",
    thanksMessage: "Nos pondremos en contacto pronto.",
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
    cancellation: "Cancelación flexible: reembolso completo hasta 24 horas antes del check-in.",
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
    total: "Total",
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
    rating: "⭐ Calificación 4.71/5 de 140+ huéspedes",
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
    wifi: "واي فاي سريع",
    ac: "تكييف في كل غرفة",
    tv: "تلفزيون ذكي · نتفليكس",
    kitchen: "مطبخ كامل",
    nespresso: "ماكينة نسبريسو",
    washer: "غسالة ومجفف",
    parking: "موقف مجاني قريب",
    workspace: "مساحة عمل",
    elevator: "مصعد",
    pets: "يُسمح بالحيوانات الأليفة",
    iron: "مكواة",
    hairdryer: "مجفف شعر",
    crib: "سرير أطفال متوفر",
    selfCheckin: "دخول بصندوق مفاتيح",
    garden: "إطلالة على الحديقة",
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
    thanks: "شكراً",
    thanksMessage: "سنتواصل معك قريباً.",
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
    cancellation: "إلغاء مرن: استرداد كامل حتى 24 ساعة قبل الوصول.",
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
    total: "المجموع",
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
    rating: "⭐ تقييم 4.71/5 من 140+ ضيف",
    save: "💰 وفر 10% عند الحجز المباشر",
    superhost: "🏆 مضيف متميز · 12 سنة خبرة",
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
};

export const translations: Record<Locale, Translations> = { en, he, ru, fr, es, ar };
