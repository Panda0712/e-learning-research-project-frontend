import { useState, useEffect, useMemo } from 'react';
import { 
    ChevronDown, ChevronLeft, ChevronRight, 
    CheckCircle, Mail, Trash2, 
    SquareArrowOutUpRight, ArrowLeft, Send,
    PlayCircle, FileText
} from 'lucide-react';

import { MOCK_COURSES, STUDENT_DATA } from '../../../../utils/mockData';
import type { DashboardStudent } from '../../../../types/course.type';

// --- CONFIG COLORS ---
const COLORS = {
    yellowBtn: '#FFD900',      
    greenBadgeBg: '#D7FFE7',   
    greenBadgeText: '#087B2E', 
    redBadgeBg: '#FFE5E5',     
    redBadgeText: '#FF0000',   
};

// --- SUB-COMPONENT ---
const StatusBadge = ({ status }: { status: string }) => {
    const isInactive = status === 'Inactive';
    const bg = isInactive ? COLORS.redBadgeBg : COLORS.greenBadgeBg;
    const text = isInactive ? COLORS.redBadgeText : COLORS.greenBadgeText;
    const dotColor = isInactive ? 'bg-red-500' : 'bg-green-500';

    return (
        <span style={{ backgroundColor: bg, color: text }} className="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
            {status}
        </span>
    );
};

// --- MAIN COMPONENT ---
const DashboardMyStudents = () => {
    // State dùng DashboardStudent
    const [selectedStudent, setSelectedStudent] = useState<DashboardStudent | null>(null);
    const [openModule, setOpenModule] = useState<string | null>(null);
    
    const [filterCourse, setFilterCourse] = useState<string>("Course");
    const [sortOption, setSortOption] = useState<string>("Sort by");
    const [activeDropdown, setActiveDropdown] = useState<'course' | 'sort' | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 8;

    const [isMessageMode, setIsMessageMode] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [sendingStatus, setSendingStatus] = useState<'idle' | 'sending' | 'success'>('idle');

    useEffect(() => {
        if (!selectedStudent) {
            setIsMessageMode(false);
            setMessageText("");
            setSendingStatus('idle');
            setOpenModule(null);
        }
    }, [selectedStudent]);

    // Unique Courses từ STUDENT_DATA
    const UNIQUE_COURSES = useMemo(() => Array.from(new Set(STUDENT_DATA.map(s => s.course))), []);
    const SORT_OPTIONS = ['Newest First', 'Oldest First', 'Progress (High to Low)', 'Progress (Low to High)'];

    // Logic lọc và sắp xếp
    const processedData = useMemo(() => {
        let data = [...STUDENT_DATA];
        
        if (filterCourse !== "Course" && filterCourse !== "All Courses") {
            data = data.filter(student => student.course === filterCourse);
        }

        data.sort((a, b) => {
            const dateA = new Date(a.lastActivity).getTime();
            const dateB = new Date(b.lastActivity).getTime();
            switch (sortOption) {
                case 'Newest First': return dateB - dateA;
                case 'Oldest First': return dateA - dateB;
                case 'Progress (High to Low)': return b.progress - a.progress;
                case 'Progress (Low to High)': return a.progress - b.progress;
                default: return 0;
            }
        });
        return data;
    }, [filterCourse, sortOption]);

    const totalPages = Math.ceil(processedData.length / itemsPerPage);
    const currentStudents = processedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSelectCourse = (course: string) => {
        setFilterCourse(course);
        setCurrentPage(1);
        setActiveDropdown(null);
    };

    const handleSelectSort = (option: string) => {
        setSortOption(option);
        setCurrentPage(1);
        setActiveDropdown(null);
    };

    const handleSendMessage = () => {
        if (!messageText.trim()) return;
        setSendingStatus('sending');
        setTimeout(() => setSendingStatus('success'), 1000);
    };

    // --- LOGIC CHI TIẾT KHÓA HỌC ---
    const getStudentCourseDetails = (student: DashboardStudent) => {
        // Tìm khóa học trong MOCK_COURSES
        const course = MOCK_COURSES.find(c => c.title === student.course);
        
        if (!course || !course.curriculum) return null;

        let totalLessons = 0;
        course.curriculum.forEach(mod => totalLessons += mod.items.length);

        const completedLessonsCount = Math.floor((student.progress / 100) * totalLessons);
        let counter = 0;

        const modulesWithStatus = course.curriculum.map(mod => {
            const itemsWithStatus = mod.items.map(item => {
                counter++;
                return {
                    ...item,
                    completed: counter <= completedLessonsCount
                };
            });

            const isModuleComplete = itemsWithStatus.length > 0 && itemsWithStatus.every(i => i.completed);

            return {
                ...mod,
                complete: isModuleComplete,
                items: itemsWithStatus
            };
        });

        return modulesWithStatus;
    };

    const currentCourseModules = selectedStudent ? getStudentCourseDetails(selectedStudent) : null;
    
    useEffect(() => {
        if (currentCourseModules && currentCourseModules.length > 0 && !openModule) {
            setOpenModule(currentCourseModules[0].title);
        }
    }, [currentCourseModules, openModule]);

    return (
        <div className="w-full h-full bg-slate-50 p-6 md:p-8 font-sans">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">My Student</h1>

            {/* Filter & Sort */}
            <div className="flex gap-4 mb-6 relative z-20">
                {/* Course Select */}
                <div className="relative">
                    <button 
                        onClick={() => setActiveDropdown(activeDropdown === 'course' ? null : 'course')}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition min-w-[120px] justify-between max-w-[300px]"
                    >
                        <span className="truncate">{filterCourse}</span> 
                        <ChevronDown size={16} className={`transition-transform flex-shrink-0 ${activeDropdown === 'course' ? 'rotate-180' : ''}`} />
                    </button>
                    {activeDropdown === 'course' && (
                        <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-100 rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-100 overflow-hidden max-h-80 overflow-y-auto">
                            <ul className="py-1 text-sm text-gray-700">
                                <li onClick={() => handleSelectCourse("All Courses")} className={`px-4 py-2.5 hover:bg-gray-50 cursor-pointer ${filterCourse === "All Courses" ? "bg-blue-50 text-blue-600 font-medium" : ""}`}>All Courses</li>
                                {UNIQUE_COURSES.map((course) => (
                                    <li key={course} onClick={() => handleSelectCourse(course)} className={`px-4 py-2.5 hover:bg-gray-50 cursor-pointer truncate ${filterCourse === course ? "bg-blue-50 text-blue-600 font-medium" : ""}`} title={course}>{course}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Sort Select */}
                <div className="relative">
                    <button 
                        onClick={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition min-w-[160px] justify-between"
                    >
                        <span>{sortOption}</span> 
                        <ChevronDown size={16} className={`transition-transform flex-shrink-0 ${activeDropdown === 'sort' ? 'rotate-180' : ''}`} />
                    </button>
                    {activeDropdown === 'sort' && (
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                            <ul className="py-1 text-sm text-gray-700">
                                {SORT_OPTIONS.map((option) => (
                                    <li key={option} onClick={() => handleSelectSort(option)} className={`px-4 py-2.5 hover:bg-gray-50 cursor-pointer ${sortOption === option ? "bg-blue-50 text-blue-600 font-medium" : ""}`}>{option}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative z-10 min-h-[400px]">
                {processedData.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="p-4 w-12">#</th>
                                <th className="p-4">Student Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Enrolled Course</th>
                                <th className="p-4">Progress</th>
                                <th className="p-4">Last Activity</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {currentStudents.map((student, idx) => (
                                <tr 
                                    key={student.id} 
                                    onClick={() => setSelectedStudent(student)}
                                    className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                                >
                                    <td className="p-4 text-gray-400">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                    <td className="p-4 font-medium text-gray-900">{student.name}</td>
                                    <td className="p-4 text-gray-500">{student.email}</td>
                                    <td className="p-4 text-gray-900 max-w-xs truncate" title={student.course}>{student.course}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-gray-700 w-8">{student.progress}%</span>
                                            <div className="flex-1 w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${student.progress === 100 ? 'bg-green-500' : 'bg-yellow-400'}`}
                                                    style={{ width: `${student.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-500">{student.lastActivity}</td>
                                    <td className="p-4"><StatusBadge status={student.status} /></td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-2 text-gray-400">
                                            <button className="p-1 hover:text-red-500 hover:bg-red-50 rounded transition" onClick={(e) => e.stopPropagation()}><Trash2 size={18} /></button>
                                            <button className="p-1 hover:text-blue-500 hover:bg-blue-50 rounded transition" onClick={(e) => e.stopPropagation()}><SquareArrowOutUpRight size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <p>No students found for this filter.</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 0 && (
                    <div className="p-4 flex justify-center items-center gap-2 border-t border-gray-100">
                        <button onClick={() => setCurrentPage(c => Math.max(c - 1, 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 text-gray-500 disabled:opacity-50"><ChevronLeft size={16} /></button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-md text-sm font-medium ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-50 text-gray-600'}`}>{i + 1}</button>
                        ))}
                        <button onClick={() => setCurrentPage(c => Math.min(c + 1, totalPages))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 text-gray-500 disabled:opacity-50"><ChevronRight size={16} /></button>
                    </div>
                )}
            </div>

            {/* Modal Popup */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-[1px] p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        {isMessageMode ? (
                            // Message Mode
                            <div className="flex flex-col h-full">
                                <div className="p-6 border-b border-gray-100 bg-gray-50">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">Send Message to {selectedStudent.name}</h2>
                                    <p className="text-sm text-gray-500 mt-1">To: {selectedStudent.email}</p>
                                </div>
                                <div className="p-6 flex-1 overflow-y-auto">
                                    {sendingStatus === 'success' ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center py-10">
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-in zoom-in"><CheckCircle size={32} className="text-green-600" /></div>
                                            <h3 className="text-lg font-bold text-gray-900">Message Sent!</h3>
                                            <p className="text-gray-500 mt-2">Your message has been sent.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                                <input type="text" defaultValue={`Regarding: ${selectedStudent.course}`} className="w-full px-4 py-2 text-black border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                                <textarea rows={6} value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Type your message here..." className="w-full px-4 py-3 text-black border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition resize-none"></textarea>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 border-t border-gray-100 flex justify-between bg-white">
                                    <button onClick={() => sendingStatus === 'success' ? setSelectedStudent(null) : setIsMessageMode(false)} className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-gray-200 font-medium text-gray-700 hover:bg-gray-50 transition">
                                        {sendingStatus === 'success' ? 'Close' : <><ArrowLeft size={18} /> Back</>}
                                    </button>
                                    {sendingStatus !== 'success' && (
                                        <button onClick={handleSendMessage} disabled={!messageText.trim() || sendingStatus === 'sending'} className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-black shadow-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: COLORS.yellowBtn }}>
                                            {sendingStatus === 'sending' ? 'Sending...' : <><Send size={18} /> Send Message</>}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            // Course Detail Mode
                            <>
                                <div className="p-6 pb-2">
                                    <h2 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h2>
                                    <p className="text-sm mt-1 font-medium text-blue-600">{selectedStudent.course}</p>
                                </div>
                                
                                <div className="p-6 pt-2 overflow-y-auto space-y-4 bg-gray-50/50 flex-1">
                                    {currentCourseModules ? (
                                        currentCourseModules.map((mod, idx) => (
                                            <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                                                <div 
                                                    onClick={() => setOpenModule(openModule === mod.title ? null : mod.title)}
                                                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-semibold text-gray-800 text-sm md:text-base">{mod.title}</span>
                                                        {mod.complete && <CheckCircle size={20} className="text-white fill-green-600 flex-shrink-0" />}
                                                    </div>
                                                    <ChevronDown size={20} className={`text-gray-400 transition-transform ${openModule === mod.title ? 'rotate-180' : ''}`} />
                                                </div>

                                                {openModule === mod.title && (
                                                    <div className="bg-white px-4 pb-4 space-y-2 border-t border-gray-100">
                                                        {mod.items.map((lesson, lIdx) => (
                                                            <div key={lIdx} className="flex items-center justify-between py-2.5 px-2 rounded-lg hover:bg-slate-50 transition">
                                                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                                                    {lesson.completed ? (
                                                                        <CheckCircle size={18} className="text-white fill-green-600 flex-shrink-0" />
                                                                    ) : (
                                                                        <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                                                                    )}
                                                                    
                                                                    <div className="flex items-center gap-2">
                                                                        {lesson.type === 'video' ? <PlayCircle size={16} className="text-gray-400" /> : <FileText size={16} className="text-gray-400" />}
                                                                        <span>{lesson.title}</span>
                                                                    </div>
                                                                </div>
                                                                <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded">{lesson.duration}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 text-gray-500 italic">Course curriculum details not found.</div>
                                    )}
                                </div>
                                
                                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white">
                                    <button onClick={() => setIsMessageMode(true)} className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-black shadow-sm hover:opacity-90 transition" style={{ backgroundColor: COLORS.yellowBtn }}>
                                        <Mail size={18} /> Send message
                                    </button>
                                    <button onClick={() => setSelectedStudent(null)} className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-gray-200 font-medium text-gray-700 hover:bg-gray-50 transition">
                                        Cancel <span className="text-lg leading-none">&rarr;</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardMyStudents;