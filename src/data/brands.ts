// Brand images data - Auto-categorizes brands by filename prefix
// 
// NAMING CONVENTION (Case-insensitive):
//   - Files starting with "left-" or "L-" → Left marquee (scrolling left to right)
//   - Files starting with "right-" or "R-" → Right marquee (scrolling right to left)
//   - All other files → Split evenly between left and right
//
// HOW TO ADD NEW BRANDS:
//   1. Add your brand image to: public/images/brands/
//   2. Rename the file with prefix:
//      - For left marquee: "left-logo-N.png" (where N is the next number)
//      - For right marquee: "right-logo-N.png" (where N is the next number)
//      - For auto-assignment: Just add the file (will be split evenly)
//   3. Add the filename to the allBrandImages array below
//   4. The system will automatically categorize it based on the prefix
//
// All images should be placed in public/images/brands/

const allBrandImages = [
  'left-logo-1.avif',
  'left-logo-2.png',
  'left-logo-3.png',
  'left-logo-4.png',
  'left-logo-5.png',
  'left-logo-6.png',
  'left-logo-7.png',
  'left-logo-8.jpg',
  'left-logo-9.jpg',
  'left-logo-10.png',
  'left-logo-11.jpg',
  'left-logo-12.png',
  'left-logo-13.png',
  'left-logo-14.png',
  'left-logo-15.png',
  'left-logo-16.jpg',
  'left-logo-17.png',
  'left-logo-18.png',
  'left-logo-19.jpg',
  'left-logo-20.png',
  'left-logo-21.png',
  'left-logo-22.jpg',
  'left-logo-23.png',
  'left-logo-24.png',
  'left-logo-25.jpg',
  'left-logo-26.jpg',
  'left-logo-27.png',
  'left-logo-28.png',
  'left-logo-29.png',
  'left-logo-30.png',
  'left-logo-31.jpg',
  'left-logo-32.png',
  'left-logo-33.png',
  'left-logo-34.png',
  'left-logo-35.png',
  'left-logo-36.png',
  'left-logo-38.png',
  'left-logo-39.png',
  'left-logo-40.png',
  'left-logo-41.png',
  'left-logo-42.png',
  'left-logo-43.png',
  'left-logo-44.png',
  'left-logo-45.png',
  'left-logo-46.png',
  'left-logo-47.png',
  'left-logo-48.png',
  'left-logo-49.png',
  'left-logo-50.jpg',
  'left-logo-51.png',
  'left-logo-52.png',
  'left-logo-53.png',
  'left-logo-54.png',
  'left-logo-55.png',
  'left-logo-56.png',
  'left-logo-57.png',
  'left-logo-58.png',
  'left-logo-59.png',
  'left-logo-60.jpg',
  'left-logo-61.png',
  'left-logo-62.jpg',
  'left-logo-63.png',
  'left-logo-64.jpg',
  'left-logo-65.png',
  'left-logo-66.jpg',
  'left-logo-67.png',
  'right-logo-1.jpg',
  'right-logo-2.png',
  'right-logo-3.jpg',
  'right-logo-4.png',
  'right-logo-5.jpg',
  'right-logo-6.png',
  'right-logo-7.jpg',
  'right-logo-8.png',
  'right-logo-9.jpg',
  'right-logo-10.png',
  'right-logo-11.jpeg',
  'right-logo-12.jpg',
  'right-logo-13.png',
  'right-logo-14.png',
  'right-logo-15.jpeg',
  'right-logo-16.png',
  'right-logo-17.jpg',
  'right-logo-18.png',
  'right-logo-19.png',
  'right-logo-20.png',
  'right-logo-21.png',
  'right-logo-22.jpg',
  'right-logo-23.jpeg',
  'right-logo-24.png',
  'right-logo-25.png',
  'right-logo-26.jpeg',
  'right-logo-27.png',
  'right-logo-28.png',
  'right-logo-29.png',
  'right-logo-30.png',
  'right-logo-31.png',
  'right-logo-32.png',
  'right-logo-33.png',
  'right-logo-34.png',
  'right-logo-35.png',
  'right-logo-36.jpg',
  'right-logo-37.png',
  'right-logo-38.png',
  'right-logo-39.png',
  'right-logo-40.png',
  'right-logo-41.webp',
  'right-logo-42.png',
  'right-logo-43.png',
  'right-logo-44.png',
  'right-logo-45.jpg',
  'right-logo-46.png',
  'right-logo-47.png',
  'right-logo-48.png',
  'right-logo-49.png',
  'right-logo-50.png',
  'right-logo-51.png',
  'right-logo-52.jpeg',
  'right-logo-53.png',
  'right-logo-54.png',
  'right-logo-55.png',
  'right-logo-56.png',
  'right-logo-57.jpg',
  'right-logo-58.png',
  'right-logo-59.png',
  'right-logo-60.png',
  'right-logo-61.png',
  'right-logo-62.png',
  'right-logo-63.jpg',
  'right-logo-64.jpg',
  'right-logo-65.png',
  'right-logo-66.png',
  'right-logo-67.png'
];

// Auto-categorize brands by filename prefix
const categorizeBrands = (images: string[]) => {
  const leftBrands: string[] = [];
  const rightBrands: string[] = [];
  const unassigned: string[] = [];

  images.forEach((image) => {
    const lowerName = image.toLowerCase();
    if (lowerName.startsWith('left-') || lowerName.startsWith('l-')) {
      leftBrands.push(image);
    } else if (lowerName.startsWith('right-') || lowerName.startsWith('r-')) {
      rightBrands.push(image);
    } else {
      unassigned.push(image);
    }
  });

  // Split unassigned brands evenly between left and right
  const midPoint = Math.ceil(unassigned.length / 2);
  leftBrands.push(...unassigned.slice(0, midPoint));
  rightBrands.push(...unassigned.slice(midPoint));

  return { leftBrands, rightBrands };
};

const { leftBrands, rightBrands } = categorizeBrands(allBrandImages);

// Export categorized brands
export const brandImagesFirstHalf = leftBrands;
export const brandImagesSecondHalf = rightBrands;

// Export all brands for reference
export const brandImages = allBrandImages;
