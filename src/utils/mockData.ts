import type { Course, Student } from "../types/course.type";

// ========================================================================
// 1. DANH SÁCH HỌC VIÊN
// ========================================================================
export const MOCK_STUDENTS: Student[] = [
  { id: "u1", name: "Minh Khoa", avatar: "/avatar1.png" },
  { id: "u2", name: "Minh Khoa", avatar: "/avatar1.png" },
  { id: "u3", name: "Minh Khoa", avatar: "/avatar1.png" },
  { id: "u4", name: "Minh Khoa", avatar: "/avatar1.png" },
  { id: "u5", name: "Minh Khoa", avatar: "/avatar1.png" },
  { id: "u6", name: "Minh Khoa", avatar: "/avatar1.png" },
  { id: "u7", name: "Minh Khoa", avatar: "/avatar1.png" },
  { id: "u8", name: "Minh Khoa", avatar: "/avatar1.png" },
];

// ========================================================================
// 2. DANH SÁCH KHÓA HỌC
// ========================================================================
export const MOCK_COURSES: Course[] = [
  // --- COURSE 1: WEB DEVELOPMENT ---
  {
    id: 1,
    category: "Lập Trình Web",
    title: "Lập trình Web cho người mới bắt đầu: HTML, CSS",
    author: "Minh Khoa",
    lessons: 25,
    hours: "11h 20m",
    students: 22,
    viewers: MOCK_STUDENTS.slice(0, 5),
    price: 29.0,
    isFree: false,
    rating: 4.8,
    ratingCount: 1450,
    image: "/example-course1.png",
    description:
      "Đây là điểm khởi đầu hoàn hảo để xây dựng trang web đầu tiên của bạn. Khóa học bao gồm hai ngôn ngữ thiết yếu của web: HTML và CSS.",
    whatYouWillLearn: [
      "Hiểu các nguyên lý cơ bản của Lập trình Web",
      "Làm chủ HTML5 & CSS3 từ con số 0",
      "Xây dựng giao diện Responsive đẹp trên mọi thiết bị",
      "Đưa website của bạn lên internet (Deploy)",
      "Làm việc với Flexbox và Grid layout",
    ],
    instructorInfo: {
      id: "inst_1",
      name: "Minh Khoa",
      avatar: "/avatar1.png",
      job: "Lập trình viên Frontend Cao cấp",
      bio: "Chào bạn, mình là Tuấn! Mình là Lập trình viên Frontend với hơn 5 năm kinh nghiệm chuyên về HTML, CSS và JavaScript.",
      students: 156,
      courses: 20,
      socials: { facebook: "#", twitter: "#", youtube: "#" },
    },
    lectureNotes: `
      <h4 class="font-bold mb-2">1. Giới thiệu HTML</h4>
      <p class="mb-4">HTML (HyperText Markup Language) là ngôn ngữ đánh dấu siêu văn bản, dùng để tạo nên cấu trúc cơ bản của một trang web.</p>
      
      <h4 class="font-bold mb-2">2. Cấu trúc cơ bản</h4>
      <pre class="bg-gray-100 p-3 rounded text-xs mb-4">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;Tiêu đề trang&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Xin chào!&lt;/h1&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>

      <h4 class="font-bold mb-2">3. Các thẻ thông dụng</h4>
      <ul class="list-disc pl-5 space-y-1">
        <li><code>&lt;h1&gt;</code> - <code>&lt;h6&gt;</code>: Tiêu đề</li>
        <li><code>&lt;p&gt;</code>: Đoạn văn</li>
        <li><code>&lt;img /&gt;</code>: Hình ảnh</li>
        <li><code>&lt;a&gt;</code>: Liên kết</li>
      </ul>
    `,
    curriculum: [
      {
        title: "Làm quen với HTML",
        lessonsCount: 3,
        duration: 45,
        items: [
          {
            title: "Giới thiệu về HTML",
            duration: "12:30",
            type: "video",
            isPreview: true,
          },
          {
            title: "Cấu trúc HTML & Các thẻ Tags",
            duration: "10:05",
            type: "video",
            isPreview: true,
          },
          {
            title: "Tạo danh sách và liên kết",
            duration: "08:15",
            type: "video",
            isPreview: false,
          },
        ],
      },
      {
        title: "Làm chủ CSS Styling",
        lessonsCount: 5,
        duration: 90,
        items: [
          {
            title: "CSS Selectors",
            duration: "15:00",
            type: "video",
            isPreview: false,
          },
          {
            title: "Màu sắc và Hình nền",
            duration: "20:00",
            type: "video",
            isPreview: false,
          },
          {
            title: "Giải thích về Box Model",
            duration: "18:30",
            type: "video",
            isPreview: false,
          },
        ],
      },
    ],
    reviews: [
      {
        id: 1,
        user: "Minh Khoa",
        avatar: "/avatar1.png",
        date: "30 Tháng 10, 2025",
        rating: 5,
        content:
          "Đây chính xác là những gì tôi tìm kiếm! Tôi không biết gì về code trước đây. Tuấn giải thích mọi thứ cực kỳ rõ ràng.",
      },
      {
        id: 2,
        user: "Minh Khoa",
        avatar: "/avatar1.png",
        date: "02 Tháng 11, 2025",
        rating: 4,
        content:
          "Khóa học tuyệt vời cho người mới. Tốc độ giảng dạy rất vừa phải.",
      },
    ],
    faqs: [
      {
        q: "Tôi có cần kinh nghiệm trước đó không?",
        a: "Không, khóa học này dành cho người mới bắt đầu hoàn toàn.",
      },
      {
        q: "Phần mềm học có miễn phí không?",
        a: "Có, chúng ta sử dụng VS Code hoàn toàn miễn phí.",
      },
    ],
  },

  // --- COURSE 2: FLUTTER ---
  {
    id: 2,
    category: "Ứng dụng Di động",
    title: "Flutter & Dart - Hướng dẫn toàn tập [Phiên bản 2024]",
    author: "Khoa Minh",
    lessons: 60,
    hours: "70h 45m",
    students: 202,
    viewers: MOCK_STUDENTS.slice(2, 7),
    price: 0,
    isFree: true,
    rating: 4.9,
    ratingCount: 2300,
    image: "/example-course2.png",
    description:
      "Học Flutter và Dart từ con số 0. Xây dựng ứng dụng iOS và Android chỉ với một mã nguồn duy nhất.",
    whatYouWillLearn: [
      "Xây dựng ứng dụng native cho Android và iOS",
      "Học ngôn ngữ Dart từ cơ bản đến nâng cao",
      "Hiểu về Flutter State Management",
      "Kết nối ứng dụng với REST APIs và Firebase",
    ],
    instructorInfo: {
      id: "inst_2",
      name: "Khoa Minh",
      avatar: "/avatar1.png",
      job: "Chuyên gia Ứng dụng Di động",
      bio: "Tôi đã xuất bản hơn 10 ứng dụng trên App Store và Play Store. Flutter là đam mê của tôi.",
      students: 2000,
      courses: 5,
      socials: { twitter: "#", youtube: "#" },
    },
    lectureNotes: `
      <h4 class="font-bold mb-2">Cài đặt môi trường Flutter</h4>
      <p class="mb-4">Để bắt đầu, bạn cần cài đặt Flutter SDK và một trình biên tập mã nguồn (VS Code hoặc Android Studio).</p>
      
      <h4 class="font-bold mb-2">Các lệnh cơ bản trong Terminal:</h4>
      <ul class="list-disc pl-5 space-y-1 mb-4">
        <li><code>flutter create my_app</code>: Tạo dự án mới</li>
        <li><code>flutter run</code>: Chạy ứng dụng trên máy ảo/thiết bị thật</li>
        <li><code>flutter doctor</code>: Kiểm tra lỗi cài đặt môi trường</li>
      </ul>
      
      <p><strong>Lưu ý:</strong> Hãy chắc chắn rằng bạn đã cài đặt biến môi trường PATH chính xác.</p>
    `,
    curriculum: [
      {
        title: "Giới thiệu về Dart",
        lessonsCount: 4,
        duration: 60,
        items: [
          {
            title: "Biến & Kiểu dữ liệu trong Dart",
            duration: "10:00",
            type: "video",
            isPreview: true,
          },
          {
            title: "Hàm trong Dart",
            duration: "15:00",
            type: "video",
            isPreview: true,
          },
        ],
      },
      {
        title: "Cơ bản về Flutter",
        lessonsCount: 5,
        duration: 120,
        items: [
          {
            title: "Hiểu về Widgets",
            duration: "25:00",
            type: "video",
            isPreview: false,
          },
          {
            title: "Xây dựng bố cục (Layouts)",
            duration: "30:00",
            type: "video",
            isPreview: false,
          },
        ],
      },
    ],
    reviews: [
      {
        id: 1,
        user: "Minh Khoa",
        avatar: "/avatar1.png",
        date: "12 Tháng 9, 2025",
        rating: 5,
        content: "Khóa học Flutter tốt nhất trên internet. Rất đáng học!",
      },
    ],
    faqs: [
      {
        q: "Dùng Mac hay Windows?",
        a: "Bạn có thể dùng cả hai, nhưng cần Mac để giả lập iOS.",
      },
    ],
  },

  // --- COURSE 3: UI/UX DESIGN ---
  {
    id: 3,
    category: "Thiết kế UI/UX",
    title: "Làm chủ Thiết kế Sản phẩm Số: UX Research & UI Design",
    author: "Minh Khoa",
    lessons: 8,
    hours: "18h 20m",
    students: 66,
    viewers: [MOCK_STUDENTS[0], MOCK_STUDENTS[2], MOCK_STUDENTS[4]],
    price: 39.0,
    isFree: false,
    rating: 4.5,
    ratingCount: 50,
    image: "/example-course3.png",
    description:
      "Hướng dẫn trọn bộ về Thiết kế UI/UX. Học cách thiết kế giao diện đẹp mắt bằng Figma.",
    whatYouWillLearn: [
      "Thành thạo Figma cho thiết kế UI",
      "Hiểu các phương pháp Nghiên cứu Người dùng",
      "Tạo nguyên mẫu tương tác (Interactive Prototypes)",
      "Xây dựng hệ thống thiết kế (Design System)",
    ],
    instructorInfo: {
      id: "inst_3",
      name: "Minh Khoa",
      avatar: "/avatar1.png",
      job: "Nhà thiết kế Sản phẩm",
      bio: "Designer tại Google. Tôi yêu sự tối giản và giải quyết các vấn đề phức tạp của người dùng thông qua thiết kế.",
      students: 500,
      courses: 2,
      socials: { instagram: "#", twitter: "#" },
    },
    lectureNotes: `
      <h4 class="font-bold mb-2">Quy trình Design Thinking</h4>
      <ol class="list-decimal pl-5 space-y-1 mb-4">
        <li>Empathize (Thấu cảm): Hiểu người dùng cần gì.</li>
        <li>Define (Xác định): Tìm ra vấn đề cốt lõi.</li>
        <li>Ideate (Lên ý tưởng): Brainstorm giải pháp.</li>
        <li>Prototype (Làm mẫu): Tạo bản nháp.</li>
        <li>Test (Kiểm thử): Thử nghiệm với người dùng thật.</li>
      </ol>
      <p><strong>Công cụ sử dụng:</strong> Figma, FigJam, Notion.</p>
    `,
    curriculum: [
      {
        title: "Nguyên lý Thiết kế",
        lessonsCount: 3,
        duration: 45,
        items: [
          {
            title: "Lý thuyết màu sắc",
            duration: "15:00",
            type: "video",
            isPreview: true,
          },
          {
            title: "Quy tắc Typography",
            duration: "12:00",
            type: "video",
            isPreview: true,
          },
        ],
      },
      {
        title: "Figma Masterclass",
        lessonsCount: 10,
        duration: 200,
        items: [
          {
            title: "Auto Layout",
            duration: "25:00",
            type: "video",
            isPreview: false,
          },
          {
            title: "Components & Variants",
            duration: "30:00",
            type: "video",
            isPreview: false,
          },
        ],
      },
    ],
    reviews: [
      {
        id: 1,
        user: "Minh Khoa",
        avatar: "/avatar1.png",
        date: "10 Tháng 8, 2025",
        rating: 5,
        content: "Các tính năng của Figma được giải thích rất rõ ràng.",
      },
    ],
    faqs: [
      {
        q: "Figma có miễn phí không?",
        a: "Có, Figma có gói miễn phí đủ dùng cho khóa học này.",
      },
    ],
  },

  // --- COURSE 4: DATA SCIENCE ---
  {
    id: 4,
    category: "Khoa học Dữ liệu",
    title: "Python cho Khoa học Dữ liệu và Machine Learning Bootcamp",
    author: "Minh Khoa",
    lessons: 40,
    hours: "32h 15m",
    students: 150,
    viewers: MOCK_STUDENTS.slice(1, 4),
    price: 29.0,
    isFree: false,
    rating: 4.7,
    ratingCount: 890,
    image: "/example-course3.png",
    description:
      "Học cách sử dụng NumPy, Pandas, Seaborn, Matplotlib, Plotly, Scikit-Learn, Machine Learning.",
    whatYouWillLearn: [
      "Sử dụng Python cho Khoa học Dữ liệu và Học máy",
      "Triển khai các thuật toán Machine Learning",
      "Học cách sử dụng NumPy, Pandas, Matplotlib",
      "Sử dụng Plotly cho trực quan hóa dữ liệu động",
    ],
    instructorInfo: {
      id: "inst_4",
      name: "Minh Khoa",
      avatar: "/avatar1.png",
      job: "Nhà khoa học Dữ liệu",
      bio: "Biến dữ liệu thành thông tin chi tiết là siêu năng lực của tôi.",
      students: 1200,
      courses: 8,
      socials: { facebook: "#", twitter: "#" },
    },
    lectureNotes: `
      <h4 class="font-bold mb-2">Thư viện Pandas</h4>
      <p class="mb-2">Pandas là thư viện mạnh mẽ nhất để thao tác dữ liệu dạng bảng (DataFrame).</p>
      <ul class="list-disc pl-5 space-y-1">
        <li><code>pd.read_csv()</code>: Đọc file CSV</li>
        <li><code>df.head()</code>: Xem 5 dòng đầu tiên</li>
        <li><code>df.describe()</code>: Thống kê mô tả (mean, min, max...)</li>
      </ul>
    `,
    curriculum: [
      {
        title: "Python Cấp tốc",
        lessonsCount: 5,
        duration: 60,
        items: [
          {
            title: "Các kiểu dữ liệu Python",
            duration: "10:00",
            type: "video",
            isPreview: true,
          },
          {
            title: "Vòng lặp và Hàm",
            duration: "15:00",
            type: "video",
            isPreview: false,
          },
        ],
      },
      {
        title: "Phân tích dữ liệu với Pandas",
        lessonsCount: 8,
        duration: 120,
        items: [
          {
            title: "DataFrames",
            duration: "20:00",
            type: "video",
            isPreview: false,
          },
          {
            title: "Làm sạch dữ liệu",
            duration: "25:00",
            type: "video",
            isPreview: false,
          },
        ],
      },
    ],
    reviews: [
      {
        id: 1,
        user: "Minh Khoa",
        avatar: "/avatar1.png",
        date: "20 Tháng 7, 2025",
        rating: 4,
        content: "Nội dung tốt nhưng phần toán học hơi khó một chút.",
      },
    ],
    faqs: [
      {
        q: "Tôi có cần biết toán không?",
        a: "Đại số cơ bản được khuyến khích nhưng không bắt buộc.",
      },
    ],
  },

  // --- COURSE 5: CYBERSECURITY ---
  {
    id: 5,
    category: "An ninh mạng",
    title: "Khóa học An ninh mạng toàn diện: Hackers Exposed!",
    author: "Minh Khoa",
    lessons: 120,
    hours: "12h",
    students: 5000,
    viewers: MOCK_STUDENTS.slice(3, 8),
    price: 0,
    isFree: true,
    rating: 4.6,
    ratingCount: 3400,
    image: "/example-course5.png",
    description:
      "Tập 1: Trở thành Chuyên gia An ninh mạng, Học cách ngăn chặn Hacker, Phòng chống tấn công.",
    whatYouWillLearn: [
      "Hiểu bối cảnh các mối đe dọa an ninh",
      "Ẩn danh và Quyền riêng tư trực tuyến",
      "An ninh mạng & Tường lửa",
      "Mối đe dọa phần mềm độc hại và cách bảo vệ",
    ],
    instructorInfo: {
      id: "inst_5",
      name: "Minh Khoa",
      avatar: "/avatar1.png",
      job: "Chuyên gia Bảo mật",
      bio: "CEO của StationX. Chuyên gia về An ninh mạng với hơn 25 năm kinh nghiệm.",
      students: 50000,
      courses: 4,
      socials: { twitter: "#" },
    },
    lectureNotes: `
      <h4 class="font-bold mb-2">Quy tắc 3-2-1 Backup</h4>
      <p class="mb-4">Để đảm bảo an toàn dữ liệu, hãy tuân thủ quy tắc:</p>
      <ul class="list-disc pl-5 space-y-1">
        <li><strong>3</strong> bản sao dữ liệu (1 chính, 2 phụ).</li>
        <li><strong>2</strong> loại phương tiện lưu trữ khác nhau (ổ cứng, cloud...).</li>
        <li><strong>1</strong> bản sao được lưu ở nơi khác (off-site).</li>
      </ul>
    `,
    curriculum: [
      {
        title: "Giới thiệu về Bảo mật",
        lessonsCount: 4,
        duration: 40,
        items: [
          {
            title: "Hacker là gì?",
            duration: "08:00",
            type: "video",
            isPreview: true,
          },
        ],
      },
      {
        title: "An ninh mạng lưới",
        lessonsCount: 10,
        duration: 150,
        items: [
          {
            title: "Địa chỉ IP",
            duration: "15:00",
            type: "video",
            isPreview: false,
          },
          {
            title: "Tường lửa (Firewalls)",
            duration: "20:00",
            type: "video",
            isPreview: false,
          },
        ],
      },
    ],
    reviews: [
      {
        id: 1,
        user: "Minh Khoa",
        avatar: "/avatar1.png",
        date: "15 Tháng 6, 2025",
        rating: 5,
        content: "Khóa học mở mang tầm mắt về quyền riêng tư.",
      },
    ],
    faqs: [
      {
        q: "Khóa học này có hợp pháp không?",
        a: "Có, chúng tôi dạy ethical hacking (hack mũ trắng) cho mục đích phòng thủ.",
      },
    ],
  },

  // --- COURSE 6: GAME DEVELOPMENT ---
  {
    id: 6,
    category: "Phát triển Game",
    title: "Lập trình viên Unreal Engine 5 C++: Làm game từ A-Z",
    author: "Khoa Minh",
    lessons: 90,
    hours: "29h 30m",
    students: 80,
    viewers: MOCK_STUDENTS.slice(0, 4),
    price: 19.0,
    isFree: false,
    rating: 4.9,
    ratingCount: 200,
    image: "/example-course6.png",
    description:
      "Được tạo ra với sự hợp tác của Epic Games. Học C++ từ đầu và xây dựng trò chơi video đầu tiên của bạn trong Unreal Engine 5.",
    whatYouWillLearn: [
      "Kiến thức cơ bản về C++ cho Game Dev",
      "Làm chủ Editor Unreal Engine 5",
      "Kịch bản Blueprint",
      "AI và Vật lý trong Game",
    ],
    instructorInfo: {
      id: "inst_2",
      name: "Khoa Minh",
      avatar: "/avatar1.png",
      job: "Nhà phát triển Game & App",
      bio: "Tôi làm game vì niềm vui và làm app để kiếm sống. Hãy cùng nhau xây dựng những thế giới ảo.",
      students: 2000,
      courses: 5,
      socials: { twitter: "#", youtube: "#" },
    },
    lectureNotes: `
      <h4 class="font-bold mb-2">Unreal Engine 5 (UE5)</h4>
      <p class="mb-4">UE5 giới thiệu hai công nghệ đột phá: <strong>Nanite</strong> (hình học ảo hóa) và <strong>Lumen</strong> (ánh sáng động toàn cục).</p>
      
      <h4 class="font-bold mb-2">Macro trong C++ UE5:</h4>
      <ul class="list-disc pl-5 space-y-1">
        <li><code>UPROPERTY()</code>: Giúp biến hiển thị trong Editor.</li>
        <li><code>UFUNCTION()</code>: Giúp hàm có thể gọi từ Blueprint.</li>
      </ul>
    `,
    curriculum: [
      {
        title: "Cơ bản về Unreal Engine",
        lessonsCount: 5,
        duration: 60,
        items: [
          {
            title: "Cài đặt UE5",
            duration: "10:00",
            type: "video",
            isPreview: true,
          },
          {
            title: "Giao diện Viewport",
            duration: "15:00",
            type: "video",
            isPreview: true,
          },
        ],
      },
      {
        title: "C++ cho Game",
        lessonsCount: 15,
        duration: 300,
        items: [
          {
            title: "Biến và Hàm",
            duration: "20:00",
            type: "video",
            isPreview: false,
          },
          {
            title: "Con trỏ và Tham chiếu",
            duration: "25:00",
            type: "video",
            isPreview: false,
          },
        ],
      },
    ],
    reviews: [
      {
        id: 1,
        user: "Minh Khoa",
        avatar: "/avatar1.png",
        date: "20 Tháng 5, 2025",
        rating: 5,
        content: "Cuối cùng tôi cũng hiểu C++ nhờ khóa học này.",
      },
    ],
    faqs: [
      {
        q: "UE5 có miễn phí không?",
        a: "Có, cho đến khi bạn kiếm được hơn 1 triệu đô doanh thu.",
      },
    ],
  },
];
