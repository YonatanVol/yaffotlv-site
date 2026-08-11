import { HomeContent } from "@/components/sections/home-content";
import { getGalleryPhotos, getHeroPhoto } from "@/lib/photos";
import { getSiteReviews } from "@/lib/google-reviews";

export default async function Home() {
  // Photos are chosen by the owner in admin → Photos. Both helpers fall back to
  // the bundled images in `public/images`, so the page renders either way.
  const [heroPhoto, galleryPhotos, siteReviews] = await Promise.all([
    getHeroPhoto(),
    getGalleryPhotos(),
    getSiteReviews(),
  ]);

  return <HomeContent heroPhoto={heroPhoto} galleryPhotos={galleryPhotos} siteReviews={siteReviews} />;
}
