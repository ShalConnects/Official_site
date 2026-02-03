/**
 * Shared testimonials data used across the site. Add or edit testimonials here and
 * they appear everywhere: landing page (featured carousel), /testimonials page (full list + search),
 * individual service pages (grid), and the floating widget.
 */
export interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
  verified?: boolean;
  linkedin?: string;
  website?: string;
  quora?: string;
  projectImage?: string;
  projectTitle?: string;
  projectDescription?: string;
  projectLink?: string;
}

export const testimonials: Testimonial[] = [
  {
    name: 'James Michaelson',
    role: 'Founder of Phoenix Projectors AV',
    content: 'Salauddin is a very good & skilled freelancer and I enjoy working with him. He has overall experience with every sector you might need. He created an eBay template and store for me and I loved it. He is good at Website Design & WordPress. That will be our next project. Communication is splendid. I thank him for being helpful and patient. It was a pleasure working with him. Thank you, Salauddin!',
    rating: 5,
    image: '/images/testimonials/james-michaelson.png',
    verified: true,
    linkedin: 'https://www.linkedin.com/in/james-michaelson-bornagaineco',
    website: 'https://pp-av.com/',
    projectImage: '/images/images/work/Banner_1.jpg',
    projectTitle: 'eBay Store & Template Design',
    projectDescription: 'Custom eBay store design and template creation',
    projectLink: 'https://pp-av.com/'
  },
  {
    name: 'John Hishchak',
    role: 'Founder of Spymods',
    content: "I've been working with Sal for 6 years now and he's an Amazing Talented friend that get's what is promised and if not we will go the extra mile to do what is needed to get the Job completed. 5 Star is not Enough - I would give 10 Stars if there was an option. Thank you for the Best Work!",
    rating: 5,
    image: '/images/testimonials/john-hishchak.jpeg',
    verified: true,
    website: 'https://www.spymods.com/',
    quora: 'https://www.quora.com/profile/John-Williams-2168'
  },
  {
    name: 'Martin Evenson',
    role: 'Owner of Bonterra Home',
    content: "I hired Shalauddin K. to assist with our company's rebranding effort. He was reliable, flexible, and responsive throughout the project, highly recommend!",
    rating: 5,
    image: '/images/testimonials/martin-evenson.jpg',
    verified: true,
    linkedin: 'https://www.linkedin.com/in/martin-evenson-dallas-tx/',
    website: 'https://bonterrahome.com/'
  },
  {
    name: 'Avi Wolfson',
    role: 'Author',
    content: 'Working with Shalauddin was a great experience. Very detail-oriented and paid close attention to job requirements and completed the project ahead of time. Looking forward to working together on future projects together!',
    rating: 5,
    image: '/images/testimonials/avi-wolfson.jpg',
    verified: true,
    linkedin: 'https://www.linkedin.com/in/aviwolfson/',
    website: 'https://aviwolfson.com/'
  },
  {
    name: 'Pella Tsanousidou',
    role: 'Product Expert and Ops Lead',
    content: "Shalauddin created our eBay store's template. He did an excellent and inspiring job, in no time. We are grateful for the collaboration and we strongly recommend him!",
    rating: 5,
    image: '/images/testimonials/pella-tsanousidou.jpg',
    verified: true,
    linkedin: 'https://www.linkedin.com/in/pella-tsanousidou-25955650/'
  }
];

/** Number of testimonials to feature in the landing carousel (first N). */
export const FEATURED_TESTIMONIALS_COUNT = 6;
