import React, { useState } from 'react';
import { 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash, 
  X, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle 
} from 'lucide-react';

interface Voucher {
  id: number;
  name: string;
  discount: number; 
  code: string;
  usageLimit: number; 
  usedCount: number;  
  minOrder: number;   
  expiryDate: string;
}

const DashboardVoucher = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>(
    Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: i % 2 === 0 ? 'Noel Discount' : 'Summer Sale',
      discount: i % 2 === 0 ? 30 : 15,
      code: i % 2 === 0 ? `NOEL${i}` : `SUMMER${i}`,
      usageLimit: 100,
      usedCount: i * 2,
      minOrder: 50,
      expiryDate: '2025-06-15'
    }))
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = vouchers.slice(indexOfFirstItem, indexOfLastItem); 
  const totalPages = Math.ceil(vouchers.length / itemsPerPage);

  const goToNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  const [currentVoucherId, setCurrentVoucherId] = useState<number | null>(null); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '', discount: '', code: '', usageLimit: '', minOrder: '', expiryDate: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const toggleMenu = (id: number) => {
    if (openMenuId === id) setOpenMenuId(null);
    else setOpenMenuId(id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.name.trim()) newErrors.name = "Required";
    if (!formData.discount || Number(formData.discount) <= 0 || Number(formData.discount) > 100) newErrors.discount = "1-100%";
    if (!formData.code.trim()) newErrors.code = "Required";
    if (!formData.usageLimit || Number(formData.usageLimit) <= 0) newErrors.usageLimit = "> 0";
    if (!formData.minOrder || Number(formData.minOrder) < 0) newErrors.minOrder = ">= 0";
    
    if (!formData.expiryDate) {
        newErrors.expiryDate = "Required";
    } else if (new Date(formData.expiryDate) < today) {
        newErrors.expiryDate = "Future date required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  const handleOpenAddModal = () => {
    setIsEditing(false); 
    setFormData({ name: '', discount: '', code: '', usageLimit: '', minOrder: '', expiryDate: '' }); 
    setErrors({});
    setShowModal(true);
  };

  const handleEditClick = (item: Voucher) => {
    setIsEditing(true); 
    setCurrentVoucherId(item.id);
    setFormData({
        name: item.name,
        discount: item.discount.toString(),
        code: item.code,
        usageLimit: item.usageLimit.toString(),
        minOrder: item.minOrder.toString(),
        expiryDate: item.expiryDate
    });
    setErrors({});
    setShowModal(true);
    setOpenMenuId(null); 
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (isEditing && currentVoucherId !== null) {
        setVouchers(prev => prev.map(v => v.id === currentVoucherId ? {
            ...v,
            name: formData.name,
            discount: Number(formData.discount),
            code: formData.code,
            usageLimit: Number(formData.usageLimit),
            minOrder: Number(formData.minOrder),
            expiryDate: formData.expiryDate
        } : v));
    } else {
        const newVoucher: Voucher = {
            id: Date.now(),
            name: formData.name,
            discount: Number(formData.discount),
            code: formData.code,
            usageLimit: Number(formData.usageLimit),
            usedCount: 0,
            minOrder: Number(formData.minOrder),
            expiryDate: formData.expiryDate
        };
        setVouchers([newVoucher, ...vouchers]);
        setCurrentPage(1);
    }
    setShowModal(false);
  };

  const handleDeleteClick = (id: number) => {
    setVoucherToDelete(id);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const confirmDelete = () => {
    if (voucherToDelete !== null) {
        setVouchers(prev => prev.filter(v => v.id !== voucherToDelete));
        setShowDeleteModal(false);
        setVoucherToDelete(null);
        if (currentItems.length === 1 && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    }
  };

  return (
    <div className="p-6 min-h-screen font-poppins relative" onClick={() => setOpenMenuId(null)}>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Voucher</h1>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-[#FFD130] hover:bg-[#eec225] text-black font-bold px-6 py-2.5 rounded-lg shadow-sm transition-all"
        >
          <Plus size={20} /> Create New Voucher
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-6">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#EBEBEB]">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600 pl-6">Voucher Name</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Discount (%)</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Code</th>
              <th className="p-4 text-sm font-semibold text-gray-600 text-center">Limit</th>
              <th className="p-4 text-sm font-semibold text-gray-600 text-center">Used</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Min Order</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Expiry</th>
              <th className="p-4 text-sm font-semibold text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4 pl-6 text-sm font-medium text-gray-800">{item.name}</td>
                <td className="p-4 text-sm text-gray-600">{item.discount}%</td>
                <td className="p-4 text-sm font-bold text-gray-700">{item.code}</td>
                <td className="p-4 text-sm text-gray-600 text-center">{item.usageLimit}</td>
                <td className="p-4 text-sm text-gray-600 text-center">{item.usedCount}</td>
                <td className="p-4 text-sm text-gray-800 font-medium">${item.minOrder}</td>
                <td className="p-4 text-sm text-gray-600">{item.expiryDate}</td>
                
                <td className="p-4 relative">
                  <button onClick={(e) => { e.stopPropagation(); toggleMenu(item.id); }} className="p-2 hover:bg-gray-100 rounded text-gray-500">
                    <MoreHorizontal size={20} />
                  </button>
                  {openMenuId === item.id && (
                    <div className="absolute right-8 top-10 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-10 overflow-hidden animate-fade-in">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleEditClick(item); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-yellow-600 hover:bg-yellow-50 font-medium"
                      >
                        <Pencil size={16} /> Edit
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(item.id); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 font-medium"
                      >
                        <Trash size={16} /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
             {vouchers.length === 0 && (
                <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">No vouchers found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="flex justify-center mt-6 pb-8">
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm bg-white" aria-label="Pagination">

                <button
                    onClick={goToPrev}
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
                    onClick={goToNext}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRight size={16} aria-hidden="true" />
                </button>
            </nav>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
          <div className="bg-white rounded-xl w-[450px] shadow-2xl animate-scale-up p-6 relative">
            <button onClick={() => setShowModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
            <h2 className="text-xl font-bold text-gray-900 mb-6">{isEditing ? 'Edit Voucher' : 'Add New Voucher'}</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm text-gray-500">Voucher Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-200'}`} placeholder="Enter Name"/>
                {errors.name && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/> {errors.name}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-500">Discount (%)</label>
                <input type="number" name="discount" value={formData.discount} onChange={handleInputChange} className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 ${errors.discount ? 'border-red-500' : 'border-gray-200'}`} placeholder="0"/>
                {errors.discount && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/> {errors.discount}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-500">Voucher Code</label>
                <input type="text" name="code" value={formData.code} onChange={handleInputChange} className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 ${errors.code ? 'border-red-500' : 'border-gray-200'}`} placeholder="Enter Code"/>
                {errors.code && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/> {errors.code}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-500">Usage Limit</label>
                <input type="number" name="usageLimit" value={formData.usageLimit} onChange={handleInputChange} className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 ${errors.usageLimit ? 'border-red-500' : 'border-gray-200'}`} placeholder="1"/>
                {errors.usageLimit && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/> {errors.usageLimit}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-500">Min. Order Value</label>
                <input type="number" name="minOrder" value={formData.minOrder} onChange={handleInputChange} className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 ${errors.minOrder ? 'border-red-500' : 'border-gray-200'}`} placeholder="0"/>
                {errors.minOrder && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/> {errors.minOrder}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-500">Expiry Date</label>
                <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 text-gray-500 ${errors.expiryDate ? 'border-red-500' : 'border-gray-200'}`}/>
                {errors.expiryDate && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/> {errors.expiryDate}</p>}
              </div>
              <button onClick={handleSubmit} className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-3 rounded-lg mt-4 shadow-blue-200 shadow-md transition-all">
                {isEditing ? 'Update Voucher' : 'Add Voucher'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
            <div className="bg-white rounded-xl p-6 w-[350px] shadow-2xl text-center animate-scale-up border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Voucher?</h3>
                <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this voucher? This action cannot be undone.</p>
                <div className="flex gap-3">
                    <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 font-bold hover:bg-gray-50">Cancel</button>
                    <button onClick={confirmDelete} className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold shadow-sm">Delete</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default DashboardVoucher;