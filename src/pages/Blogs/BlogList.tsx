import Sidebar from '../../components/SideBar/SideBar';
import BlogCard from '../../components/BlogCard/BlogCard';
import { blogs } from '../../utils/blogData';

const BlogList = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="w-full h-[50px] bg-[#F5F5F5] flex items-center">
        <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-[#555555] cursor-pointer hover:underline">
                    Home
                </span>
                <span className="text-[#9D9D9D] mx-1">{'>'}</span>

                <span className="text-[#9D9D9D]">
                    Blog
                </span>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 max-w-7xl">
        {/* list bìa viết */}
        <div className="w-full lg:w-3/4">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} data={blog} />
          ))}
          
          <div className="flex gap-2 mt-8 ml-20">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">1</button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100">2</button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100">3</button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100">→</button>
          </div>
        </div>

        <Sidebar />
      </div>

    </div>
  );
};

export default BlogList;