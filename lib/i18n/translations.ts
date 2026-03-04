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
  // Nav
  nav: {
    gallery: string;
    residence: string;
    contact: string;
    bookNow: string;
  };
  // Hero
  hero: {
    overline: string;
    title: string;
    tagline: string;
  };
  // Signature
  signature: {
    headline: string;
    subtitle: string;
  };
  // Quote
  quote: string;
  // Details bar
  details: {
    bedrooms: string;
    location: string;
    sea: string;
    vibe: string;
  };
  // CTA
  cta: {
    overline: string;
    headline: string;
    description: string;
    bookNow: string;
    contactUs: string;
  };
  // Photo slider
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
  // Contact modal
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
  // Book page
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
}

const en: Translations = {
  nav: {
    gallery: "Gallery",
    residence: "The Residence",
    contact: "Contact",
    bookNow: "Book Now",
  },
  hero: {
    overline: "Jaffa, Tel Aviv",
    title: "YaffoTLV",
    tagline: "Where heritage meets horizon",
  },
  signature: {
    headline: "A private residence in the heart of Jaffa",
    subtitle: "Every detail considered. Every surface intentional. A home that belongs completely to this place.",
  },
  quote: "In the oldest port city on the Mediterranean, where every stone holds a story — a private stay, available by request.",
  details: {
    bedrooms: "2 Bedrooms",
    location: "Jaffa",
    sea: "8 min to the sea",
    vibe: "Quiet & Bright",
  },
  cta: {
    overline: "Reserve your stay",
    headline: "Book Your Stay",
    description: "Availability shared upon inquiry. Flexible cancellation included.",
    bookNow: "Book Now",
    contactUs: "Contact Us",
  },
  slider: {
    title: "The Collection",
    subtitle: "Spaces that speak softly",
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
    subtitle: "We'll get back to you shortly.",
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
};

const he: Translations = {
  nav: {
    gallery: "גלריה",
    residence: "הדירה",
    contact: "צור קשר",
    bookNow: "הזמן עכשיו",
  },
  hero: {
    overline: "יפו, תל אביב",
    title: "YaffoTLV",
    tagline: "היכן שמורשת פוגשת אופק",
  },
  signature: {
    headline: "דירת נופש פרטית בלב יפו",
    subtitle: "כל פרט נבחר בקפידה. כל משטח מכוון. בית ששייך לחלוטין למקום הזה.",
  },
  quote: "בעיר הנמל העתיקה בים התיכון, שם כל אבן מספרת סיפור — שהייה פרטית, בהזמנה מראש.",
  details: {
    bedrooms: "2 חדרי שינה",
    location: "יפו",
    sea: "8 דק' מהים",
    vibe: "שקט ומואר",
  },
  cta: {
    overline: "הזמינו את השהייה שלכם",
    headline: "הזמינו שהייה",
    description: "זמינות לפי בקשה. ביטול גמיש כלול.",
    bookNow: "הזמן עכשיו",
    contactUs: "צור קשר",
  },
  slider: {
    title: "הקולקציה",
    subtitle: "חללים שמדברים בשקט",
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
    title: "צרו קשר",
    subtitle: "נחזור אליכם בהקדם.",
    name: "שם",
    email: "אימייל",
    message: "הודעה",
    send: "שלח הודעה",
    thanks: "תודה",
    thanksMessage: "ניצור קשר בקרוב.",
    close: "סגור",
  },
  book: {
    overline: "הזמינו את השהייה שלכם",
    title: "הזמנה",
    subtitle: "בחרו תאריכים והשלימו את ההזמנה.",
    step1: "שלב 1 מתוך 2",
    step1Title: "בחרו תאריכים",
    step2: "שלב 2 מתוך 2",
    step2Title: "פרטי האורח",
    cancellation: "ביטול גמיש: החזר מלא עד 24 שעות לפני הצ'ק-אין.",
    checkIn: "צ'ק-אין",
    checkOut: "צ'ק-אאוט",
    nights: "לילות",
    guests: "אורחים",
    guestName: "שם מלא",
    guestEmail: "אימייל",
    guestPhone: "טלפון (אופציונלי)",
    guestCount: "מספר אורחים",
    continue: "המשך",
    back: "חזור",
    payNow: "שלם עכשיו",
    perNight: "/ לילה",
    cleaning: "דמי ניקיון",
    total: "סה״כ",
  },
};

const ru: Translations = {
  nav: {
    gallery: "Галерея",
    residence: "Резиденция",
    contact: "Контакт",
    bookNow: "Бронировать",
  },
  hero: {
    overline: "Яффа, Тель-Авив",
    title: "YaffoTLV",
    tagline: "Где наследие встречает горизонт",
  },
  signature: {
    headline: "Частная резиденция в сердце Яффы",
    subtitle: "Каждая деталь продумана. Каждая поверхность выверена. Дом, который полностью принадлежит этому месту.",
  },
  quote: "В древнейшем портовом городе Средиземноморья, где каждый камень хранит историю — частное пребывание по запросу.",
  details: {
    bedrooms: "2 спальни",
    location: "Яффа",
    sea: "8 мин до моря",
    vibe: "Тихо и светло",
  },
  cta: {
    overline: "Забронируйте проживание",
    headline: "Бронирование",
    description: "Наличие по запросу. Гибкая отмена включена.",
    bookNow: "Бронировать",
    contactUs: "Связаться",
  },
  slider: {
    title: "Коллекция",
    subtitle: "Пространства, которые говорят тихо",
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
    subtitle: "Мы ответим вам в ближайшее время.",
    name: "Имя",
    email: "Эл. почта",
    message: "Сообщение",
    send: "Отправить",
    thanks: "Спасибо",
    thanksMessage: "Мы скоро свяжемся с вами.",
    close: "Закрыть",
  },
  book: {
    overline: "Забронируйте проживание",
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
};

const fr: Translations = {
  nav: {
    gallery: "Galerie",
    residence: "La Résidence",
    contact: "Contact",
    bookNow: "Réserver",
  },
  hero: {
    overline: "Jaffa, Tel-Aviv",
    title: "YaffoTLV",
    tagline: "Là où patrimoine rencontre horizon",
  },
  signature: {
    headline: "Une résidence privée au cœur de Jaffa",
    subtitle: "Chaque détail réfléchi. Chaque surface intentionnelle. Un lieu qui appartient entièrement à cet endroit.",
  },
  quote: "Dans le plus ancien port de la Méditerranée, où chaque pierre raconte une histoire — un séjour privé, sur demande.",
  details: {
    bedrooms: "2 Chambres",
    location: "Jaffa",
    sea: "8 min de la mer",
    vibe: "Calme & Lumineux",
  },
  cta: {
    overline: "Réservez votre séjour",
    headline: "Réservation",
    description: "Disponibilité sur demande. Annulation flexible incluse.",
    bookNow: "Réserver",
    contactUs: "Nous contacter",
  },
  slider: {
    title: "La Collection",
    subtitle: "Des espaces qui parlent doucement",
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
    subtitle: "Nous vous répondrons rapidement.",
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
};

const es: Translations = {
  nav: {
    gallery: "Galería",
    residence: "La Residencia",
    contact: "Contacto",
    bookNow: "Reservar",
  },
  hero: {
    overline: "Jaffa, Tel Aviv",
    title: "YaffoTLV",
    tagline: "Donde el patrimonio encuentra el horizonte",
  },
  signature: {
    headline: "Una residencia privada en el corazón de Jaffa",
    subtitle: "Cada detalle considerado. Cada superficie intencional. Un hogar que pertenece completamente a este lugar.",
  },
  quote: "En la ciudad portuaria más antigua del Mediterráneo, donde cada piedra guarda una historia — una estancia privada, disponible bajo petición.",
  details: {
    bedrooms: "2 Habitaciones",
    location: "Jaffa",
    sea: "8 min al mar",
    vibe: "Tranquilo y Luminoso",
  },
  cta: {
    overline: "Reserva tu estancia",
    headline: "Reserva tu Estancia",
    description: "Disponibilidad bajo consulta. Cancelación flexible incluida.",
    bookNow: "Reservar",
    contactUs: "Contáctanos",
  },
  slider: {
    title: "La Colección",
    subtitle: "Espacios que hablan suavemente",
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
    subtitle: "Le responderemos pronto.",
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
};

const ar: Translations = {
  nav: {
    gallery: "معرض",
    residence: "الإقامة",
    contact: "اتصل بنا",
    bookNow: "احجز الآن",
  },
  hero: {
    overline: "يافا، تل أبيب",
    title: "YaffoTLV",
    tagline: "حيث يلتقي التراث بالأفق",
  },
  signature: {
    headline: "إقامة خاصة في قلب يافا",
    subtitle: "كل تفصيل مدروس. كل سطح مقصود. منزل ينتمي بالكامل لهذا المكان.",
  },
  quote: "في أقدم مدينة ميناء على البحر الأبيض المتوسط، حيث كل حجر يحكي قصة — إقامة خاصة، متاحة عند الطلب.",
  details: {
    bedrooms: "غرفتا نوم",
    location: "يافا",
    sea: "8 دقائق من البحر",
    vibe: "هادئ ومشرق",
  },
  cta: {
    overline: "احجز إقامتك",
    headline: "احجز إقامتك",
    description: "التوفر عند الاستفسار. إلغاء مرن مشمول.",
    bookNow: "احجز الآن",
    contactUs: "اتصل بنا",
  },
  slider: {
    title: "المجموعة",
    subtitle: "مساحات تتحدث بهدوء",
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
    subtitle: "سنعود إليك قريباً.",
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
    cancellation: "إلغاء مرن: استرداد كامل حتى 24 ساعة قبل تسجيل الوصول.",
    checkIn: "تسجيل الوصول",
    checkOut: "تسجيل المغادرة",
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
};

export const translations: Record<Locale, Translations> = { en, he, ru, fr, es, ar };
