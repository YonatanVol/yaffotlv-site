import { PROPERTY } from "@/lib/facts";
import { getSiteReviews } from "@/lib/google-reviews";

/**
 * Schema.org data for search engines.
 *
 * `aggregateRating` and `starRating` used to be hardcoded to 4.71 / 140 reviews.
 * Google requires review markup to reflect real reviews shown on the page;
 * inventing it risks a manual action, which costs far more than the star
 * snippet is worth. The block is now emitted only once `HOST_STATS` holds a
 * genuine rating and review count.
 */
export async function StructuredData() {
  const { rating, total } = await getSiteReviews();
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "YaffoTLV",
    description: `${PROPERTY.rooms}-room apartment in Jaffa, Tel Aviv. ${PROPERTY.sizeSqm} sqm, renovated ${PROPERTY.renovatedYear}, ${PROPERTY.beachWalkMinutes} minutes' walk to the beach. Book direct and save 10%.`,
    url: "https://yaffotlv.com",
    image: "https://yaffotlv.com/images/livingroom-hero.jpg",
    address: {
      "@type": "PostalAddress",
      streetAddress: PROPERTY.street,
      addressLocality: "Jaffa",
      addressRegion: "Tel Aviv",
      addressCountry: "IL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 32.0485,
      longitude: 34.7545,
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
    checkinTime: PROPERTY.checkInFrom,
    checkoutTime: PROPERTY.checkOutBy,
    numberOfRooms: PROPERTY.rooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: PROPERTY.sizeSqm,
      unitCode: "MTK",
    },
    petsAllowed: true,
  };

  // Published only with real, externally verifiable numbers behind it — the
  // rating and review count come straight from the Google Business Profile.
  if (rating && total) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: String(rating),
      reviewCount: String(total),
      bestRating: "5",
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
