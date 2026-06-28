export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "YaffoTLV",
    description:
      "Luxury 3-room apartment in Jaffa, Tel Aviv. 80 sqm, renovated 2024, 10 min walk to beach. Book direct and save 10%.",
    url: "https://yaffotlv.com",
    image: "https://yaffotlv.com/images/livingroom1.jpg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Baruch Karo 24",
      addressLocality: "Jaffa",
      addressRegion: "Tel Aviv",
      addressCountry: "IL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 32.0485,
      longitude: 34.7545,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.71",
      reviewCount: "140",
      bestRating: "5",
    },
    priceRange: "₪550-₪1000/night",
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "WiFi", value: true },
      { "@type": "LocationFeatureSpecification", name: "Air Conditioning", value: true },
      { "@type": "LocationFeatureSpecification", name: "Kitchen", value: true },
      { "@type": "LocationFeatureSpecification", name: "Parking", value: true },
      { "@type": "LocationFeatureSpecification", name: "Elevator", value: true },
      { "@type": "LocationFeatureSpecification", name: "Pet Friendly", value: true },
      { "@type": "LocationFeatureSpecification", name: "Washer/Dryer", value: true },
    ],
    checkinTime: "14:00",
    checkoutTime: "11:00",
    numberOfRooms: 3,
    floorSize: {
      "@type": "QuantitativeValue",
      value: 80,
      unitCode: "MTK",
    },
    petsAllowed: true,
    starRating: {
      "@type": "Rating",
      ratingValue: "4.71",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
