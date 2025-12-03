import { Reply } from 'lucide-react';

const commentsData = [
  {
    id: 1,
    name: "Ngu Tuan",
    date: "October 30, 2025",
    content: "This was exactly what I was looking for! I had zero coding knowledge before this. Tuan Andy explains everything with extreme clarity.",
    avatar: "/public/ImgBlog/avartar_4.jpg",
  },
  {
    id: 2,
    name: "Khai",
    date: "October 30, 2025",
    content: "Starting from the absolute basics. His 'learning by doing' approach helped me code along and build my first website. Highly recommended!",
    avatar: "/public/avatar3.png",
  }
];

const CommentList = () => {
  return (
    <div className="bg-[#F5F5F5] p-8 rounded-xl mb-12">
      <h3 className="text-xl font-bold mb-8">Comments</h3>

      <div className="flex flex-col gap-8">
        {commentsData.map((comment, index) => (
          <div key={comment.id} className={`flex gap-4 md:gap-6 ${index !== 0 ? 'border-t border-gray-200 pt-8' : ''}`}>
            
            <div className="flex-shrink-0">
              <img 
                src={comment.avatar} 
                alt={comment.name} 
                className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-white shadow-sm"
              />
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-gray-900 text-lg">{comment.name}</h4>
                <span className="text-gray-500 text-sm">{comment.date}</span>
              </div>
              
              <p className="text-gray-600 leading-relaxed mb-3 text-sm md:text-base">
                {comment.content}
              </p>

              <button className="flex items-center gap-1 text-[#FF6B6B] font-bold text-sm hover:underline">
                <Reply size={16} /> Reply
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-10">
         <button className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center text-gray-500">
            {'<'}
         </button>
         <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
            1
         </button>
         <button className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center text-gray-500">
            2
         </button>
         <button className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center text-gray-500">
            3
         </button>
         <button className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center text-gray-500">
            {'>'}
         </button>
      </div>
    </div>
  );
};

export default CommentList;