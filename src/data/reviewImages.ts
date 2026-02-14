/** Single source for review screenshots: review_1–225 in public/images/reviews/ */
export const REVIEW_IMAGE_IDS = Array.from({ length: 225 }, (_, i) => i + 1);
const REVIEW_IMAGE_FILE = (n: number) => `/images/reviews/review_${n}.png`;

/** Marquee: landing uses 10 items/column @ 40s; scale duration to match scroll feel */
export const LANDING_MARQUEE_DURATION_SEC = 40;
export const LANDING_IMAGES_PER_COLUMN = 10;
export const LANDING_REVIEW_COUNT = LANDING_IMAGES_PER_COLUMN * 3;
export const getScrollDurationSec = (imagesPerColumn: number) =>
  LANDING_MARQUEE_DURATION_SEC * (imagesPerColumn / LANDING_IMAGES_PER_COLUMN);

export interface ReviewImage {
  id: string;
  src: string;
  alt: string;
}

const toReviewImage = (n: number): ReviewImage => ({
  id: `review-${n}`,
  src: REVIEW_IMAGE_FILE(n),
  alt: `Client Review ${n}`,
});

export function getAllReviewImages(): ReviewImage[] {
  return REVIEW_IMAGE_IDS.map(toReviewImage);
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function getRandomReviewImages(count: number): ReviewImage[] {
  return shuffle(REVIEW_IMAGE_IDS).slice(0, count).map(toReviewImage);
}
