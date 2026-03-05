export interface Review {
  id: string;
  guestName: string;
  country: string;
  countryFlag: string;
  date: string;
  rating: number;
  source: "airbnb" | "booking";
  text: {
    en: string;
    he: string;
    ru: string;
    fr: string;
    es: string;
    ar: string;
  };
}

export const reviews: Review[] = [
  {
    id: "r1",
    guestName: "Sarah",
    country: "UK",
    countryFlag: "🇬🇧",
    date: "2024-11",
    rating: 5,
    source: "airbnb",
    text: {
      en: "Absolutely stunning apartment in the heart of Jaffa. Everything was spotless and the location is perfect — walking distance to amazing restaurants and the beach.",
      he: "דירה מדהימה בלב יפו. הכל היה נקי מאוד והמיקום מושלם — מרחק הליכה ממסעדות מעולות ומהחוף.",
      ru: "Потрясающая квартира в самом сердце Яффы. Всё безупречно чисто, расположение идеальное — рестораны и пляж в пешей доступности.",
      fr: "Un appartement absolument magnifique au cœur de Jaffa. Tout était impeccable et l'emplacement est parfait — restaurants et plage à distance de marche.",
      es: "Apartamento absolutamente impresionante en el corazón de Jaffa. Todo estaba impecable y la ubicación es perfecta — restaurantes y playa a poca distancia.",
      ar: "شقة رائعة في قلب يافا. كل شيء كان نظيفاً والموقع مثالي — المطاعم والشاطئ على مسافة قريبة.",
    },
  },
  {
    id: "r2",
    guestName: "Marco",
    country: "Italy",
    countryFlag: "🇮🇹",
    date: "2024-10",
    rating: 5,
    source: "airbnb",
    text: {
      en: "Eitan is a fantastic host. The apartment is modern, clean, and has everything you need. The Nespresso machine was a great touch. Will definitely come back!",
      he: "איתן מארח פנטסטי. הדירה מודרנית, נקייה ויש בה כל מה שצריך. מכונת הנספרסו הייתה בונוס מעולה. בהחלט נחזור!",
      ru: "Эйтан — фантастический хозяин. Квартира современная, чистая и есть всё необходимое. Кофемашина Nespresso — отличный бонус. Обязательно вернёмся!",
      fr: "Eitan est un hôte fantastique. L'appartement est moderne, propre et a tout ce qu'il faut. La machine Nespresso était un plus. On reviendra !",
      es: "Eitan es un anfitrión fantástico. El apartamento es moderno, limpio y tiene todo lo necesario. La máquina Nespresso fue un gran detalle. ¡Volveremos!",
      ar: "إيتان مضيف رائع. الشقة حديثة ونظيفة وفيها كل ما تحتاج. ماكينة النسبريسو كانت لمسة جميلة. سنعود بالتأكيد!",
    },
  },
  {
    id: "r3",
    guestName: "Anna",
    country: "Germany",
    countryFlag: "🇩🇪",
    date: "2024-09",
    rating: 5,
    source: "booking",
    text: {
      en: "Perfect location in Old Jaffa. Quiet neighborhood but close to everything. The apartment was recently renovated and looks even better than the photos.",
      he: "מיקום מושלם ביפו העתיקה. שכונה שקטה אבל קרובה לכל מה שצריך. הדירה שופצה לאחרונה ונראית אפילו טוב יותר מהתמונות.",
      ru: "Идеальное расположение в Старой Яффе. Тихий район, но рядом со всем. Квартира недавно отремонтирована и выглядит даже лучше, чем на фото.",
      fr: "Emplacement parfait dans le vieux Jaffa. Quartier calme mais proche de tout. L'appartement est récemment rénové et encore mieux qu'en photos.",
      es: "Ubicación perfecta en el viejo Jaffa. Barrio tranquilo pero cerca de todo. El apartamento fue recientemente renovado y se ve incluso mejor que en las fotos.",
      ar: "موقع مثالي في يافا القديمة. حي هادئ لكنه قريب من كل شيء. الشقة مجددة حديثاً وتبدو أفضل من الصور.",
    },
  },
  {
    id: "r4",
    guestName: "David",
    country: "USA",
    countryFlag: "🇺🇸",
    date: "2024-08",
    rating: 5,
    source: "airbnb",
    text: {
      en: "We stayed here for a week with our family and loved every minute. The apartment is spacious, the AC works great, and the self check-in was super easy.",
      he: "שהינו כאן שבוע עם המשפחה ונהנינו מכל רגע. הדירה מרווחת, המיזוג עובד מעולה, וההגעה העצמאית הייתה פשוטה מאוד.",
      ru: "Мы провели здесь неделю с семьёй и наслаждались каждой минутой. Квартира просторная, кондиционер отлично работает, самостоятельный заезд очень удобный.",
      fr: "Nous avons séjourné une semaine en famille et nous avons adoré chaque instant. L'appartement est spacieux, la clim fonctionne bien, et l'arrivée autonome est très simple.",
      es: "Estuvimos una semana con la familia y disfrutamos cada minuto. El apartamento es espacioso, el aire acondicionado funciona perfecto y el check-in fue facilísimo.",
      ar: "أقمنا هنا أسبوعاً مع العائلة واستمتعنا بكل لحظة. الشقة واسعة والتكييف ممتاز وتسجيل الوصول الذاتي كان سهلاً جداً.",
    },
  },
  {
    id: "r5",
    guestName: "Marie",
    country: "France",
    countryFlag: "🇫🇷",
    date: "2024-07",
    rating: 5,
    source: "airbnb",
    text: {
      en: "The best Airbnb we've stayed at in Israel. Beautifully designed, incredibly clean, and the neighborhood has the best food in Tel Aviv. Abu Hasan is 3 minutes away!",
      he: "ה-Airbnb הכי טוב ששהינו בו בישראל. מעוצב יפה, נקי ברמה גבוהה, והשכונה עם האוכל הכי טוב בתל אביב. אבו חסן 3 דקות משם!",
      ru: "Лучший Airbnb, в котором мы останавливались в Израиле. Красиво оформлен, невероятно чистый, а в районе лучшая еда в Тель-Авиве. Абу Хасан в 3 минутах!",
      fr: "Le meilleur Airbnb où nous avons séjourné en Israël. Magnifiquement aménagé, incroyablement propre, et le quartier a la meilleure cuisine de Tel-Aviv. Abu Hasan est à 3 minutes !",
      es: "El mejor Airbnb en el que nos hemos alojado en Israel. Bellamente diseñado, increíblemente limpio, y el barrio tiene la mejor comida de Tel Aviv. ¡Abu Hasan está a 3 minutos!",
      ar: "أفضل Airbnb أقمنا فيه في إسرائيل. تصميم جميل ونظافة لا تصدق والحي فيه أفضل أكل في تل أبيب. أبو حسن على بعد 3 دقائق!",
    },
  },
  {
    id: "r6",
    guestName: "Alex",
    country: "Canada",
    countryFlag: "🇨🇦",
    date: "2024-06",
    rating: 4,
    source: "booking",
    text: {
      en: "Great apartment with a lovely garden view. Eitan was very responsive and helpful. The only thing I'd note is that parking isn't right at the building, but it's a short walk.",
      he: "דירה נהדרת עם נוף יפה לגינה. איתן היה מגיב ונותן מענה מעולה. הדבר היחיד שאציין הוא שהחניה לא ליד הבניין, אבל היא קרובה.",
      ru: "Отличная квартира с прекрасным видом на сад. Эйтан был очень отзывчивым. Единственное — парковка не у самого здания, но в нескольких минутах ходьбы.",
      fr: "Super appartement avec une belle vue sur le jardin. Eitan était très réactif et serviable. Seul bémol : le parking n'est pas juste devant, mais à quelques minutes à pied.",
      es: "Gran apartamento con una bonita vista al jardín. Eitan fue muy atento y servicial. Lo único que mencionaría es que el estacionamiento no está justo en el edificio, pero está cerca.",
      ar: "شقة رائعة مع إطلالة جميلة على الحديقة. إيتان كان متجاوباً ومساعداً جداً. الملاحظة الوحيدة أن الموقف ليس بجانب المبنى لكنه قريب.",
    },
  },
  {
    id: "r7",
    guestName: "Yuki",
    country: "Japan",
    countryFlag: "🇯🇵",
    date: "2024-05",
    rating: 5,
    source: "airbnb",
    text: {
      en: "Such a peaceful stay. The apartment is quiet despite being in the city, the bed was extremely comfortable, and the kitchen had everything we needed to cook.",
      he: "שהייה כל כך שלווה. הדירה שקטה למרות שהיא בעיר, המיטה הייתה נוחה מאוד, והמטבח היה מצויד בכל מה שצריך לבישול.",
      ru: "Такой спокойный отдых. Квартира тихая, несмотря на центральное расположение, кровать очень удобная, а кухня полностью оборудована для готовки.",
      fr: "Un séjour tellement paisible. L'appartement est calme malgré la ville, le lit était extrêmement confortable, et la cuisine avait tout le nécessaire.",
      es: "Una estancia tan tranquila. El apartamento es silencioso a pesar de estar en la ciudad, la cama era muy cómoda y la cocina tenía todo lo necesario para cocinar.",
      ar: "إقامة هادئة جداً. الشقة هادئة رغم أنها في المدينة والسرير كان مريحاً جداً والمطبخ فيه كل ما نحتاج للطبخ.",
    },
  },
  {
    id: "r8",
    guestName: "Liam",
    country: "Australia",
    countryFlag: "🇦🇺",
    date: "2024-12",
    rating: 5,
    source: "airbnb",
    text: {
      en: "Hands down the best place to stay in Jaffa. Modern, clean, great location. The flea market is walking distance, and the beach sunset views are incredible.",
      he: "ללא ספק המקום הכי טוב לשהות ביפו. מודרני, נקי, מיקום מעולה. שוק הפשפשים במרחק הליכה, ושקיעות החוף פשוט מדהימות.",
      ru: "Однозначно лучшее место для проживания в Яффе. Современная, чистая, отличное расположение. Блошиный рынок рядом, а закаты на пляже невероятные.",
      fr: "Sans conteste le meilleur endroit pour séjourner à Jaffa. Moderne, propre, super emplacement. Le marché aux puces est à pied, et les couchers de soleil sur la plage sont incroyables.",
      es: "Sin duda el mejor lugar para alojarse en Jaffa. Moderno, limpio, excelente ubicación. El mercado de pulgas está a poca distancia y las puestas de sol en la playa son increíbles.",
      ar: "بلا شك أفضل مكان للإقامة في يافا. حديث ونظيف وموقع ممتاز. سوق البرغوث على مسافة مشي وغروب الشمس على الشاطئ لا يصدق.",
    },
  },
];
