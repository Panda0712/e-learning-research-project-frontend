import React, { useState } from 'react';
import { ChevronDown, Menu, Mail, ChevronLeft, ChevronRight } from 'lucide-react'; 

// Dữ liệu giả lập
const STUDENT_DATA = [
    { id: 1, name: "Saron Mekonnen", email: "saronmekonnen@gmail.com", course: "Introduction to Python Programming", progress: 100, lastActivity: "June 15, 2025", status: "Completed" },
    { id: 2, name: "Dawit Todesse", email: "dawittodesse@gmail.com", course: "Figma for Beginners", progress: 85, lastActivity: "June 12, 2025", status: "Active" },
    { id: 3, name: "Helen Yilma", email: "helenyilma@gmail.com", course: "Responsive Web Design", progress: 42, lastActivity: "June 15, 2025", status: "Active" },
    { id: 4, name: "Abel Getachew", email: "abelgetachew@gmail.com", course: "UI Design Basics", progress: 0, lastActivity: "June 10, 2025", status: "Inactive" },
    { id: 5, name: "Bethlehem Gashaw", email: "bethlehemgashaw@gmail.com", course: "Figma for Beginners", progress: 76, lastActivity: "June 11, 2025", status: "Active" },
    { id: 6, name: "Nahom Abebe", email: "nahomabebe@gmail.com", course: "HTML & CSS for Designers", progress: 25, lastActivity: "June 19, 2025", status: "Active" },
    { id: 7, name: "Mastewal Asfaw", email: "mastewalasfaw@gmail.com", course: "Typography Fundamentals", progress: 58, lastActivity: "June 14, 2025", status: "Active" },
    { id: 8, name: "Samuel Tefera", email: "samueltefera@gmail.com", course: "Advanced UX Research", progress: 0, lastActivity: "June 6, 2025", status: "Inactive" },
    { id: 9, name: "Liya Habte", email: "liyabte@gmail.com", course: "Designing for Mobile Apps", progress: 63, lastActivity: "April 18, 2025", status: "Active" },
    { id: 10, name: "Robel Demissie", email: "robeldemissie@gmail.com", course: "Design Systems 101", progress: 100, lastActivity: "June 7, 2025", status: "Completed" },
];

// Trạng thái (Active/Inactive/Completed)
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    let bgColor = '';
    let textColor = '';
    
    switch (status) {
        case 'Completed':
            bgColor = 'bg-green-100';
            textColor = 'text-green-600';
            break;
        case 'Active':
            bgColor = 'bg-blue-100';
            textColor = 'text-blue-600';
            break;
        case 'Inactive':
        default:
            bgColor = 'bg-red-100';
            textColor = 'text-red-600';
            break;
    }

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor} font-poppins`}>
            {status}
        </span>
    );
};


// --- MAIN CONTENT COMPONENT ---

const DashboardMyStudents: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 10;
    const totalPages = Math.ceil(STUDENT_DATA.length / studentsPerPage);
    const lastIndex = currentPage * studentsPerPage;
    const firstIndex = lastIndex - studentsPerPage;
    const currentStudents = STUDENT_DATA.slice(firstIndex, lastIndex);

    const paginate = (pageNumber: number) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        
        <div className="p-4 sm:p-6 lg:p-8 w-full">
            <style>
                {/* Đảm bảo font Poppins đã được tải trong index.css */}
                {`
                .font-poppins { font-family: 'Poppins', sans-serif; }
                .shadow-custom { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03); }
                `}
            </style>
            
            {/* Header (Phần này nên nằm trong layout chung) */}
            <header className="flex justify-between items-center mb-6 border-b pb-4">
                <div className="flex items-center">
                    {/* Nút menu cho mobile (Gọi hàm từ prop) */}
                    <button className="md:hidden mr-4 text-gray-800" onClick={onMenuClick}>
                        <Menu className="w-6 h-6" />
                    </button>
                    <h2 className="text-3xl font-bold text-black font-poppins">My Student</h2>
                </div>
            </header>

            {/* Main Table Card */}
            <div className="bg-white p-6 rounded-xl shadow-custom">
                
                {/* Filter and Sort Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
                    {/* Course Filter */}
                    <div className="relative w-full sm:w-auto">
                        <select className="appearance-none bg-white border border-gray-300 text-black py-2 pl-3 pr-8 rounded-lg leading-tight focus:outline-none focus:border-blue-500 font-poppins text-sm">
                            <option>Course</option>
                            <option>Figma for Beginners</option>
                            <option>Responsive Web Design</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>

                    {/* Sort By Filter */}
                    <div className="relative w-full sm:w-auto">
                        <select className="appearance-none bg-white border border-gray-300 text-black py-2 pl-3 pr-8 rounded-lg leading-tight focus:outline-none focus:border-blue-500 font-poppins text-sm">
                            <option>Sort by</option>
                            <option>Progress (Highest)</option>
                            <option>Progress (Lowest)</option>
                            <option>Last Activity</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Student Data Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50 text-left text-xs font-medium text-black uppercase tracking-wider font-poppins">
                                <th className="px-3 py-3 w-10">#</th>
                                <th className="px-6 py-3">Student Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Enrolled Course</th>
                                <th className="px-6 py-3">Progress</th>
                                <th className="px-6 py-3">Last Activity</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentStudents.map((student, index) => (
                                <tr key={student.id} className="text-sm text-gray-900 font-poppins">
                                    <td className="px-3 py-4 whitespace-nowrap text-gray-500">{(currentPage - 1) * studentsPerPage + index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{student.course}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-20 bg-gray-200 rounded-full h-1.5 mr-2">
                                                <div 
                                                    className={`h-1.5 rounded-full ${student.progress === 100 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                                    style={{ width: `${student.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-text-gray-medium">{student.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{student.lastActivity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={student.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-gray-500 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100">
                                            <Mail className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex flex-col sm:flex-row sm:justify-center items-center space-y-4 sm:space-y-0">
                    
                    {/* Thanh Phân trang */}
                    <nav 
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px w-full sm:w-auto justify-center" 
                        aria-label="Pagination"
                    >
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => paginate(page)}
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                                    currentPage === page
                                        ? 'z-10 bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <ChevronRight className="w-5 h-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default DashboardMyStudents;