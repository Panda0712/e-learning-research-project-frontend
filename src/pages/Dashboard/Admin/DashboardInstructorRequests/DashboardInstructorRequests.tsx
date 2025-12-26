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

const RequestDetail = ({ data, onBack, onApprove, onReject }: { data: InstructorRequest; onBack: () => void; onApprove: () => void; onReject: () => void; }) => {
  return (
    <div className="animate-fade-in">
      <div className="bg-gray-100 px-8 py-4 flex items-center gap-4 border-b border-gray-200">
         <button onClick={onBack} className="text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium">
            <ChevronLeft size={20} /> Back
         </button>
      </div>
      <div className="px-8 py-8 max-w-5xl mx-auto">
         <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">LECTURER REGISTRATION</h2>
         </div>
         <div className="bg-[#F9FAFB] rounded-xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-md font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">First Name *</label>
                  <input type="text" value={data.firstName} readOnly className="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-700 text-sm focus:outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Last Name *</label>
                  <input type="text" value={data.lastName} readOnly className="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-700 text-sm focus:outline-none" />
               </div>
               <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1">Bio / Experience *</label>
                  <textarea rows={5} value={data.bioExperience} readOnly className="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-700 text-sm focus:outline-none resize-none" />
               </div>
               <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1">CV / Resume *</label>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                     <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs font-medium">File</span>
                     <span className="text-sm text-gray-500 italic">{data.cvFileName}</span>
                     <button className="text-blue-600 text-sm font-bold ml-auto hover:underline flex items-center gap-1">Download <Download size={14}/></button>
                  </div>
               </div>
            </div>
            <div className="flex gap-4 mt-8">
               <button onClick={onApprove} className="px-8 py-3 bg-[#704FE6] text-white rounded-full font-bold hover:bg-[#5F3DD4] transition-all shadow-lg">Approve</button>
               <button onClick={onReject} className="px-8 py-3 bg-[#FF4444] text-white rounded-full font-bold hover:bg-[#dd3333] transition-all shadow-lg">Reject</button>
            </div>
         </div>
      </div>
    </div>
  );
};

const DashboardInstructorRequests = () => {
  const [allRequests, setAllRequests] = useState<InstructorRequest[]>(
    Array(15).fill(null).map((_, i) => ({
      id: i + 1,
      avatar: '/avatar1.png',
      firstName: `Lecturer ${i + 1}`,
      lastName: 'Nguyen Van',
      email: `lecturer${i+1}@gmail.com`,
      professionalTitle: i % 2 === 0 ? 'User Interface' : 'Systems and Databases',
      appliedDate: 'June 15, 2025',
      status: i < 8 ? 'Pending' : (i % 2 === 0 ? 'Approved' : 'Rejected'),
      birthDate: '22/05/1998', gender: 'Male', nationality: 'Viet Nam', phone: '0988867551',
      begunStudies: '2020', yearsOfExperience: 5, highestDegree: "Bachelor's Degree",
      bioExperience: "Experience stories...", cvFileName: 'CV.pdf'
    }))
  );

  const [activeTab, setActiveTab] = useState<'requests' | 'history'>('requests');
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedRequest, setSelectedRequest] = useState<InstructorRequest | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const itemsPerPage = 5;

  const filteredData = allRequests.filter(item => 
    activeTab === 'requests' ? item.status === 'Pending' : item.status !== 'Pending'
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleMenu = (id: number) => setOpenMenuId(openMenuId === id ? null : id);

  const handleActionClick = (item: InstructorRequest, type: 'approve' | 'reject') => {
    setSelectedRequest(item);
    setActionType(type);
    setShowConfirmModal(true);
    setOpenMenuId(null);
  };

  const confirmAction = () => {
    if (!selectedRequest || !actionType) return;
    const newStatus = actionType === 'approve' ? 'Approved' : 'Rejected';
    setAllRequests(prev => prev.map(item => 
      item.id === selectedRequest.id ? { ...item, status: newStatus } : item
    ));
    setShowConfirmModal(false);
    if (viewMode === 'detail') setViewMode('list');
    if (currentItems.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
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
    <div className="p-6 min-h-screen font-poppins relative" onClick={() => setOpenMenuId(null)}>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Instructor Requests</h1>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-200 mb-6">
        <button 
          onClick={() => { setActiveTab('requests'); setCurrentPage(1); }} 
          className={`pb-3 font-medium text-sm transition-colors ${activeTab === 'requests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Requests ({allRequests.filter(i => i.status === 'Pending').length})
        </button>
        <button 
          onClick={() => { setActiveTab('history'); setCurrentPage(1); }} 
          className={`pb-3 font-medium text-sm transition-colors ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          History ({allRequests.filter(i => i.status !== 'Pending').length})
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-6">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#EBEBEB]">
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
            {currentItems.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4"><img src={item.avatar} className="w-10 h-10 rounded-full object-cover" alt="" /></td>
                <td className="p-4">
                   <div className="font-bold text-gray-800 text-sm">{item.lastName} {item.firstName}</div>
                   <div className="text-xs text-gray-500">{item.email}</div>
                </td>
                <td className="p-4 text-sm text-gray-700">{item.professionalTitle}</td>
                <td className="p-4 text-sm text-gray-600">{item.appliedDate}</td>
                <td className="p-4 text-center">
                   <span className={`px-3 py-1 rounded-full text-xs font-bold 
                      ${item.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' : ''}
                      ${item.status === 'Approved' || item.status === 'Active' ? 'bg-green-50 text-green-600' : ''}
                      ${item.status === 'Rejected' ? 'bg-red-50 text-red-600' : ''}
                   `}>
                     • {item.status}
                   </span>
                </td>
                <td className="p-4 text-right relative">
                   <button onClick={(e) => { e.stopPropagation(); toggleMenu(item.id); }} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                      <MoreHorizontal size={20} />
                   </button>
                   {openMenuId === item.id && (
                       <div className="absolute right-8 top-10 w-36 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden text-left animate-fade-in">
                          <button onClick={() => { setSelectedRequest(item); setViewMode('detail'); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 font-medium transition-colors"><Eye size={16} /> View</button>
                          {activeTab === 'requests' && (
                            <>
                              <button onClick={() => handleActionClick(item, 'approve')} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 font-bold transition-colors"><Check size={16} /> Approve</button>
                              <button onClick={() => handleActionClick(item, 'reject')} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold transition-colors"><X size={16} /> Reject</button>
                            </>
                          )}
                       </div>
                   )}
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr><td colSpan={6} className="p-10 text-center text-gray-500 font-medium">No requests found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
          <div className="flex justify-center mt-6 pb-8">
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm bg-white" aria-label="Pagination">
                  <button
                      onClick={() => setCurrentPage(p => p - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      <ChevronLeft size={16} aria-hidden="true" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset focus:z-20 focus:outline-offset-0
                              ${currentPage === pageNum 
                                  ? 'z-10 bg-black text-white ring-black' 
                                  : 'text-gray-900 ring-gray-300 hover:bg-gray-50' 
                              }`}
                      >
                          {pageNum}
                      </button>
                  ))}

                  <button
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      <ChevronRight size={16} aria-hidden="true" />
                  </button>
              </nav>
          </div>
      )}

      {showConfirmModal && renderConfirmModal()}
    </div>
  );

  function renderConfirmModal() {
     return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
           <div className="bg-white rounded-xl p-8 w-[400px] shadow-2xl text-center animate-scale-up border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                 {actionType === 'approve' ? 'Approve Lecturer?' : 'Reject Lecturer?'}
              </h3>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                 Are you sure you want to {actionType} this request? This will move it to the history tab.
              </p>
              <div className="flex gap-4">
                 <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 border border-gray-200 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                 <button onClick={confirmAction} className="flex-1 py-3 rounded-lg font-bold text-black bg-[#FFD130] hover:bg-[#eec225] shadow-md transition-all">Confirm</button>
              </div>
           </div>
        </div>
     );
  }
};

export default DashboardInstructorRequests;