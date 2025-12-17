import { useState } from 'react';
import { 
  MoreHorizontal, 
  Eye, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Download
} from 'lucide-react';

interface InstructorRequest {
  id: number;
  avatar: string;
  firstName: string;
  lastName: string; 
  email: string;
  birthDate: string;
  gender: string;
  nationality: string;
  phone: string;
  professionalTitle: string;
  begunStudies: string; 
  highestDegree: string;
  yearsOfExperience: number; 
  bioExperience: string;
  appliedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Active'; 
  cvFileName?: string;
}

const RequestDetail = ({ 
  data, 
  onBack, 
  onApprove, 
  onReject 
}: { 
  data: InstructorRequest; 
  onBack: () => void; 
  onApprove: () => void; 
  onReject: () => void; 
}) => {
  return (
    <div >
      {/* Header riêng*/}
      <div className="bg-gray-100 px-8 py-4 flex items-center gap-4 border-b border-gray-200">
         <button onClick={onBack} className="text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium">
            <ChevronLeft size={20} /> Back
         </button>
         {/* <h1 className="text-xl font-bold text-gray-800">Instructor Requests</h1> */}
      </div>

      <div className="px-8 py-8 max-w-5xl mx-auto">
         {/* Title Section */}
         <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
              LECTURER REGISTRATION
            </h2>
         </div>

         <div className="bg-[#F9FAFB] rounded-xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-md font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
               Profile Information
            </h3>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">First Name *</label>
                  <input type="text" value={data.firstName} readOnly className="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-700 text-sm focus:outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Last Name *</label>
                  <input type="text" value={data.lastName} readOnly className="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-700 text-sm focus:outline-none" />
               </div>
               
               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Birth Date *</label>
                  <input type="text" value={data.birthDate} readOnly className="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-700 text-sm focus:outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Gender *</label>
                  <input type="text" value={data.gender} readOnly className="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-700 text-sm focus:outline-none" />
               </div>

               <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1">Nationality *</label>
                  <input type="text" value={data.nationality} readOnly className="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-700 text-sm focus:outline-none" />
               </div>

               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Phone *</label>
                  <input type="text" value={data.phone} readOnly className="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-700 text-sm focus:outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Professional Title *</label>
                  <input type="text" value={data.professionalTitle} readOnly className="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-700 text-sm focus:outline-none" />
               </div>

               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Years Of Experience *</label>
                  <input type="text" value={data.yearsOfExperience} readOnly className="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-700 text-sm focus:outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Year Of Graduation *</label>
                  <input type="text" value={data.begunStudies} readOnly className="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-700 text-sm focus:outline-none" />
               </div>

               <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1">Highest Degree *</label>
                  <input type="text" value={data.highestDegree} readOnly className="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-700 text-sm focus:outline-none" />
               </div>

               <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1">Bio / Experience *</label>
                  <textarea rows={5} value={data.bioExperience} readOnly className="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-700 text-sm focus:outline-none resize-none" />
               </div>

               {/* CV Download Section */}
               <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1">CV / Resume *</label>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                     <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs font-medium">Choose File</span>
                     <span className="text-sm text-gray-500 italic">{data.cvFileName || "No file uploaded"}</span>
                     <button className="text-blue-600 text-sm font-bold ml-auto hover:underline flex items-center gap-1">
                        Click To Download <Download size={14}/>
                     </button>
                  </div>
               </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 mt-8">
               <button 
                  onClick={onApprove}
                  className="px-8 py-3 bg-[#704FE6] text-white rounded-full font-bold hover:bg-[#5F3DD4] transition-all shadow-lg shadow-purple-200 flex items-center gap-2"
               >
                  Approve 
               </button>
               <button 
                  onClick={onReject}
                  className="px-8 py-3 bg-[#FF4444] text-white rounded-full font-bold hover:bg-[#dd3333] transition-all shadow-lg shadow-red-200 flex items-center gap-2"
               >
                  Reject 
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};


const DashboardInstructorRequests = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'history'>('requests');
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list'); // Chế độ xem bảng hay xem chi tiết
  const [selectedRequest, setSelectedRequest] = useState<InstructorRequest | null>(null);

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const requestsData: InstructorRequest[] = Array(8).fill(null).map((_, i) => ({
    id: i + 1,
    avatar: '/public/avatar1.png',
    firstName: 'A',
    lastName: 'Nguyen Van',
    email: 'A@gmail.com',
    professionalTitle: i % 2 === 0 ? 'User Interface' : 'Systems and Databases',
    appliedDate: 'June 15, 2025',
    status: 'Pending',
    // Detail Data
    birthDate: '22/05/1998',
    gender: 'Male',
    nationality: 'Viet Nam',
    phone: '0988867551',
    begunStudies: '2020',
    yearsOfExperience: 5,
    highestDegree: "Bachelor's Degree",
    bioExperience: "Each Of Us Has Our Own Stories, Experiences And Dreams That Shape Our Lives. For Me, I Am A Person Who Is Always Eager To Explore...",
    cvFileName: 'Nguyen_Van_A_CV.pdf'
  }));

  const historyData: InstructorRequest[] = [
    { ...requestsData[0], id: 101, status: 'Approved' },
    { ...requestsData[1], id: 102, status: 'Rejected' },
    { ...requestsData[2], id: 103, status: 'Active' },
  ];

  const toggleMenu = (id: number) => {
    if (openMenuId === id) setOpenMenuId(null);
    else setOpenMenuId(id);
  };

  const handleView = (item: InstructorRequest) => {
    setSelectedRequest(item);
    setViewMode('detail');
    setOpenMenuId(null);
  };

//popup
  const handleActionClick = (item: InstructorRequest, type: 'approve' | 'reject') => {
    setSelectedRequest(item);
    setActionType(type);
    setShowConfirmModal(true);
    setOpenMenuId(null);
  };

  const confirmAction = () => {
    console.log(`${actionType} user ${selectedRequest?.id}`);
    setShowConfirmModal(false);
    if (viewMode === 'detail') setViewMode('list');
    setSelectedRequest(null);
  };

  if (viewMode === 'detail' && selectedRequest) {
    return (
       <>
         <RequestDetail 
            data={selectedRequest}
            onBack={() => setViewMode('list')}
            onApprove={() => handleActionClick(selectedRequest, 'approve')}
            onReject={() => handleActionClick(selectedRequest, 'reject')}
         />
         {showConfirmModal && renderConfirmModal()}
       </>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-poppins relative" onClick={() => setOpenMenuId(null)}>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Instructor Requests</h1>

      {/* tab*/}
      <div className="flex gap-8 border-b border-gray-200 mb-6">
        <button onClick={() => setActiveTab('requests')} className={`pb-3 font-medium text-sm transition-colors ${activeTab === 'requests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Requests</button>
        <button onClick={() => setActiveTab('history')} className={`pb-3 font-medium text-sm transition-colors ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>History</button>
      </div>

      {/* bảng */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[500px]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600">Avatar</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Lecturer</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Expertise</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Applied Date</th>
              <th className="p-4 text-sm font-semibold text-gray-600 text-center">Status</th>
              <th className="p-4 text-sm font-semibold text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === 'requests' ? requestsData : historyData).map((item, index) => (
              <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4"><img src={item.avatar} className="w-10 h-10 rounded-full object-cover" alt="" /></td>
                <td className="p-4">
                   <div className="font-bold text-gray-800 text-sm">{item.lastName} {item.firstName}</div>
                   <div className="text-xs text-gray-500">Email: {item.email}</div>
                </td>
                <td className="p-4 text-sm text-gray-700">{item.professionalTitle}</td>
                <td className="p-4 text-sm text-gray-600">{item.appliedDate}</td>
                <td className="p-4 text-center">
                   <span className={`px-3 py-1 rounded-full text-xs font-bold 
                      ${item.status === 'Pending' ? 'bg-[#FFF9C4] text-[#FBC02D]' : ''}
                      ${item.status === 'Approved' ? 'bg-green-100 text-green-600' : ''}
                      ${item.status === 'Active' ? 'bg-green-100 text-green-600' : ''}
                      ${item.status === 'Rejected' ? 'bg-red-100 text-red-600' : ''}
                   `}>
                     • {item.status}
                   </span>
                </td>
                <td className="p-4 text-right relative">
                   {/* ✅ SỬA: Bỏ điều kiện activeTab === 'requests' đi để nút 3 chấm luôn hiện */}
                   <button 
                      onClick={(e) => { e.stopPropagation(); toggleMenu(item.id); }} 
                      className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                   >
                      <MoreHorizontal size={20} />
                   </button>
                    
                   {/* Dropdown Menu */}
                   {openMenuId === item.id && (
                       <div className="absolute right-8 top-10 w-36 bg-white rounded-lg shadow-xl border border-gray-100 z-10 overflow-hidden animate-fade-in text-left">
                          
                          {/* icon view*/}
                          <button 
                              onClick={(e) => { e.stopPropagation(); handleView(item); }} 
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 font-medium"
                          >
                             <Eye size={16} /> View
                          </button>

                          {/* button approve & reject only request */}
                          {activeTab === 'requests' && (
                            <>
                              <button 
                                  onClick={(e) => { e.stopPropagation(); handleActionClick(item, 'approve'); }} 
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 font-bold"
                              >
                                 <Check size={16} /> Approve
                              </button>
                              <button 
                                  onClick={(e) => { e.stopPropagation(); handleActionClick(item, 'reject'); }} 
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold"
                              >
                                 <X size={16} /> Reject
                              </button>
                            </>
                          )}
                       </div>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
         {/* Pagination */}
         <div className="flex justify-center p-6 gap-2 border-t border-gray-100">
            <button className="w-8 h-8 flex items-center justify-center rounded border hover:bg-gray-100"><ChevronLeft size={16}/></button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 text-sm font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border hover:bg-gray-100 text-sm">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border hover:bg-gray-100 text-sm">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border hover:bg-gray-100"><ChevronRight size={16}/></button>
        </div>
      </div>

      {showConfirmModal && renderConfirmModal()}
    </div>
  );

  function renderConfirmModal() {
     return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
           <div className="bg-white rounded-xl p-8 w-[400px] shadow-2xl text-center animate-scale-up border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                 {actionType === 'approve' ? 'Approve Lecturer?' : 'Reject Lecturer?'}
              </h3>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                 {actionType === 'approve' 
                    ? 'Are you sure to approve lecturer registration?'
                    : 'Are you sure to reject lecturer registration? This action cannot be undone.'}
              </p>
              <div className="flex gap-4">
                 <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 border border-gray-200 rounded-lg font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                 <button onClick={confirmAction} className={`flex-1 py-3 rounded-lg font-bold text-black shadow-md ${actionType === 'approve' ? 'bg-[#FFD130] hover:bg-[#eec225]' : 'bg-[#FFD130] hover:bg-[#eec225]'}`}>Confirm</button>
              </div>
           </div>
        </div>
     );
  }
};

export default DashboardInstructorRequests;
