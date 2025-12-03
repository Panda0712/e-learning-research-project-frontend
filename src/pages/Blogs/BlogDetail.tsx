import { useParams } from 'react-router-dom';
import Sidebar from '../../components/SideBar/SideBar';
import { Calendar, User, Quote } from 'lucide-react';
import { blogs } from '../../utils/blogData';
import AuthorBox from '../../components/AuthorBox/AuthorBox';
import CommentList from '../../components/CommentList/CommentList';

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const blog = blogs.find(b => b.id === Number(id));

  if (!blog) return <div className="text-center py-10">Post not found!</div>;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      <div className="w-full h-[50px] bg-[#F5F5F5] flex items-center mb-8">
        <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-[#555555] cursor-pointer hover:underline">Home</span>
                <span className="text-[#9D9D9D] mx-1">{'>'}</span>
                <span className="text-[#9D9D9D]">Blog</span>
                <span className="text-[#9D9D9D] mx-1">{'>'}</span>
                <span className="text-[#9D9D9D]">Blog Detail</span>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16 flex flex-col lg:flex-row gap-10 max-w-7xl">
        <div className="w-full lg:w-3/4">
           <div className="w-full h-[300px] rounded-2xl overflow-hidden shadow-sm mb-8 relative">
             <img 
                src={blog.image} 
                alt={blog.title} 
                className="w-full h-full object-cover" 
             />
           </div>
           <div className="flex items-center gap-6 text-gray-500 text-sm font-medium mb-4">
                <div className="flex items-center gap-2 ">
                    <Calendar size={18} className='text-[#FF6B6B]' />
                    <span className='font-medium font-poppins text-[#333931] text-[10px]'>{blog.date}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-500">
                    <User size={18} className='text-[#FF6B6B]' />
                    <span className='font-medium font-poppins text-[#333931] text-[10px]'>{blog.author}</span>
                </div>
           </div>

           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
             {blog.title}
           </h1>

           <div className="prose max-w-none text-gray-700 leading-relaxed text-[16px]">
             <p className="mb-4">{blog.content}</p>
             <p className="mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vulputate vestibulum Phasellus rhoncus, 
                dolor eget viverra pretium, dolor tellus aliquet nunc, vitae ultricies erat elit eu lacus.
             </p>
             
             <div className="bg-[#F9F9F9] p-8 my-8 text-center rounded-lg">
                <div className="flex justify-center mb-4">
                    <Quote size={48} className="text-[#5B5CEB] fill-[#5B5CEB]" />
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 leading-snug">
                    Smashing Podcast Episode With Paul Boag What Is Conversion Optimization
                </h3>
                
                <p className="text-gray-500 font-bold text-sm italic">
                    John Mirnsdo
                </p>
             </div>

             <p className="mb-4">
                Vestibulum non justo consectetur, cursus ante tincidunt sapien. Nulla quis diam sit amet turpis interdum accumsan quis nec enim.
             </p>
           </div>
           
            <AuthorBox 
            authorName={blog.author} 
            authorImage="/public/avatar1.png" 
            />

            <CommentList />

           {/* Comment */}
        <div className="pt-8 border-t border-gray-100">
             <h3 className="text-xl font-bold mb-4 text-black">Leave A Comment</h3>

             <p className="text-[#555555] mb-6 text-sm">
                Your email address will not be published. Required fields are marked *
             </p>

             <form className="space-y-5">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <input 
                    type="text" 
                    placeholder="Name*" 
                    className="border border-[#9D9D9D] p-3 rounded-md w-full focus:outline-none focus:border-[#FF782D] placeholder-[#9D9D9D] text-[#555555]" 
                 />
                 
                 <input 
                    type="email" 
                    placeholder="Email*" 
                    className="border border-[#9D9D9D] p-3 rounded-md w-full focus:outline-none focus:border-[#FF782D] placeholder-[#9D9D9D] text-[#555555]" 
                 />
               </div>

               <textarea 
                  placeholder="Comment" 
                  rows={5} 
                  className="border border-[#9D9D9D] p-3 rounded-md w-full focus:outline-none focus:border-[#FF782D] placeholder-[#9D9D9D] text-[#555555]"
               >
               </textarea>
               <div className="flex items-center gap-2 mb-4">
                  <input type="checkbox" id="save-info" className="accent-[#FF782D]" />
                  <label htmlFor="save-info" className="text-[#555555] text-sm">
                      Save My Name, Email In This Browser For The Next Time I Comment
                  </label>
               </div>

               <button className="bg-[#FF782D] text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity shadow-sm">
                 Posts Comment
               </button>
             </form>
        </div>
        </div>

        <Sidebar />
      </div>

    </div>
  );
};

export default BlogDetail;