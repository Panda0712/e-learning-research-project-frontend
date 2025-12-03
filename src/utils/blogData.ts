export interface Blog {
  id: number;
  title: string;
  author: string;
  date: string;
  image: string;
  description: string;
  content: string;
  category: string;
}

export const blogs: Blog[] = [
  {
    id: 1,
    title: "Social skills for teens 15 to 20 years old",
    author: "Tuan Andy",
    date: "April 21, 2025",
    image: "/public/ImgBlog/BlogCard_1.jpg",
    description: "Brief description about social skills...",
    content: "Full content of the article goes here...",
    category: "Soft Skill"
  },
  {
    id: 2,
    title: "Most used technologies in 2025",
    author: "Khoa rafelson",
    date: "April 21, 2025",
    image: "/public/ImgBlog/BlogCard_2.jpg",
    description: "Tech trends analysis...",
    content: "Full content about technology...",
    category: "Technology"
  }
];