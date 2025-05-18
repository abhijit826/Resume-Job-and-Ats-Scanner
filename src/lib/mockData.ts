// This file contains mock job openings.
// In a real application, this data would be scraped or fetched from company career pages or APIs.

export interface JobOpening {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string; // Full job description
  companyLogo?: string; // Optional URL for company logo
}

export const mockJobOpenings: JobOpening[] = [
  {
    id: 'swe-google-1',
    title: 'Software Engineer Intern',
    company: 'Google',
    location: 'Mountain View, CA',
    description: 'Join Google as a Software Engineer Intern and work on cutting-edge projects. Responsibilities include coding, testing, and collaborating with senior engineers. Strong CS fundamentals required.',
    companyLogo: 'https://placehold.co/50x50.png',
  },
  {
    id: 'pm-microsoft-1',
    title: 'Product Manager, Cloud Services',
    company: 'Microsoft',
    location: 'Redmond, WA',
    description: 'Define and drive the product strategy for Microsoft Azure services. Requires experience in product management, cloud technologies, and excellent communication skills.',
    companyLogo: 'https://placehold.co/50x50.png',
  },
  {
    id: 'ds-amazon-1',
    title: 'Data Scientist, eCommerce',
    company: 'Amazon',
    location: 'Seattle, WA',
    description: 'Leverage machine learning and statistical analysis to optimize Amazon\'s eCommerce platform. PhD or MS in a quantitative field preferred, along with proficiency in Python/R.',
    companyLogo: 'https://placehold.co/50x50.png',
  },
  {
    id: 'uxd-apple-1',
    title: 'UX Designer Internship',
    company: 'Apple',
    location: 'Cupertino, CA',
    description: 'Intern with Apple\'s design team to create intuitive and beautiful user experiences for Apple products. Portfolio showcasing design process and solutions is required.',
    companyLogo: 'https://placehold.co/50x50.png',
  },
  {
    id: 'mke-facebook-1',
    title: 'Marketing Specialist, Growth',
    company: 'Meta',
    location: 'Menlo Park, CA',
    description: 'Develop and execute marketing campaigns to drive user acquisition and engagement for Meta platforms. Experience in digital marketing and data analysis is a plus.',
    companyLogo: 'https://placehold.co/50x50.png',
  },
  {
    id: 'swe-startup-1',
    title: 'Full Stack Developer',
    company: 'Innovatech Solutions',
    location: 'Remote',
    description: 'Fast-growing startup seeks a versatile Full Stack Developer to build and maintain web applications. Experience with React, Node.js, and cloud platforms is essential.',
    companyLogo: 'https://placehold.co/50x50.png',
  },
];
