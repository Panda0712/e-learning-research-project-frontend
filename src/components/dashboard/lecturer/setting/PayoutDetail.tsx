import React, { useState } from 'react';
import { Trash2, Plus, X, CreditCard, Calendar, Lock, AlertCircle } from 'lucide-react';

interface CardType {
  id: number;
  type: 'Visa' | 'Mastercard';
  number: string;
  holder: string;
  isDefault: boolean;
}

const PayoutDetail = () => {
  const [cards, setCards] = useState<CardType[]>([
    { id: 1, type: 'Visa', number: '1900 **** **** 1234', holder: 'Nguyen Van A', isDefault: true },
    { id: 2, type: 'Visa', number: '1800 **** **** 5678', holder: 'Nguyen Van B', isDefault: false },
  ]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    holderName: ''
  });

  const [errors, setErrors] = useState({
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  // --- XỬ LÝ NHẬP LIỆU (VALIDATION) ---
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const truncatedValue = rawValue.slice(0, 16);
    const formattedValue = truncatedValue.replace(/(\d{4})(?=\d)/g, '$1 ');

    setFormData({ ...formData, cardNumber: formattedValue });
    setErrors({ ...errors, cardNumber: '' }); 
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (inputValue.length < formData.expiry.length) {
        setFormData({ ...formData, expiry: inputValue });
        setErrors(prev => ({ ...prev, expiry: '' }));
        return;
    }

    let rawValue = inputValue.replace(/\D/g, '');
    if (rawValue.length > 4) rawValue = rawValue.slice(0, 4);

    let formattedValue = rawValue;
    if (rawValue.length >= 2) {
       formattedValue = rawValue.slice(0, 2) + '/' + rawValue.slice(2);
    }

    setFormData({ ...formData, expiry: formattedValue });
    const now = new Date();
    const currentYear = parseInt(now.getFullYear().toString().substr(-2)); 
    const currentMonth = now.getMonth() + 1; 

    if (rawValue.length >= 2) {
        const month = parseInt(rawValue.slice(0, 2));
        if (month > 12 || month === 0) {
            setErrors(prev => ({ ...prev, expiry: 'Invalid month' }));
            return;
        }
    }

    if (rawValue.length === 4) {
        const inputMonth = parseInt(rawValue.slice(0, 2));
        const inputYear = parseInt(rawValue.slice(2, 4));

        if (inputYear < currentYear) {
            setErrors(prev => ({ ...prev, expiry: 'Expired card (Year)' }));
            return;
        }

        if (inputYear === currentYear && inputMonth < currentMonth) {
             setErrors(prev => ({ ...prev, expiry: 'Expired card (Month)' }));
             return;
        }
    }

    setErrors(prev => ({ ...prev, expiry: '' }));
  };
  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const truncatedValue = rawValue.slice(0, 3);
    setFormData({ ...formData, cvv: truncatedValue });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, holderName: e.target.value });
  };

// submit form
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.cardNumber.length < 19) { 
        setErrors(prev => ({...prev, cardNumber: 'Please enter full details 16 số'}));
        return;
    }

    if (formData.expiry.length < 5 || errors.expiry) {
         if (!errors.expiry) {
             setErrors(prev => ({...prev, expiry: 'Please enter full details MM/YY'}));
         }
         return; 
    }

    if (formData.cvv.length < 3) {
        alert("Vui lòng nhập đủ 3 số CVV"); 
        return; 
    }

    if (!formData.holderName.trim()) {
        alert("Vui lòng nhập tên chủ thẻ");
        return;
    }

    const newCard: CardType = {
      id: Date.now(),
      type: 'Visa',
      number: formData.cardNumber.slice(0, 14) + ' **** ' + formData.cardNumber.slice(-4), 
      holder: formData.holderName.toUpperCase(),
      isDefault: false
    };

    setCards([...cards, newCard]);
    setShowAddModal(false);
    
    setFormData({ cardNumber: '', expiry: '', cvv: '', holderName: '' });
    setErrors({ cardNumber: '', expiry: '', cvv: '' });
  };

  const openDeleteModal = (id: number) => { setSelectedCardId(id); setShowDeleteModal(true); };
  const confirmDelete = () => {
    if (selectedCardId) {
      setCards(cards.filter(card => card.id !== selectedCardId));
      setShowDeleteModal(false);
      setSelectedCardId(null);
    }
  };

  const isFormValid = 
      formData.cardNumber.length === 19 &&
      formData.expiry.length === 5 &&
      formData.cvv.length === 3 &&
      formData.holderName.trim() !== '' &&
      !errors.cardNumber &&
      !errors.expiry;

  return (
    <div className="font-poppins relative">
      <h2 className="text-xl font-bold text-gray-800 mb-8">PAYOUT DETAILS</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <div key={card.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
               <span className="font-bold text-gray-700">{card.type}</span>
               <span className="font-mono text-gray-600 font-medium tracking-widest">{card.number}</span>
            </div>
            <div className="mb-4">
                <p className="text-gray-400 text-xs uppercase mb-1">Card Holder</p>
                <p className="text-gray-700 font-medium">{card.holder}</p>
            </div>
            <div className="flex justify-between items-center mt-4">
                {card.isDefault ? (
                    <span className="text-blue-600 text-sm font-bold bg-blue-50 px-3 py-1 rounded-full">[Default]</span>
                ) : <span></span>}
                <button onClick={() => openDeleteModal(card.id)} className="text-gray-400 hover:text-red-500 font-bold text-sm transition-colors">Delete</button>
            </div>
          </div>
        ))}

        <button onClick={() => setShowAddModal(true)} className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 h-[180px] text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all group">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200">
                <Plus size={24} />
            </div>
            <span className="font-medium">Add card</span>
        </button>
      </div>

      {/* Popup Xóa */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
           <div className="bg-white rounded-2xl p-8 w-[400px] shadow-2xl relative">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-500"><Trash2 size={24} /></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Card</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">Are you sure to delete your card permanently?</p>
              <div className="flex gap-4">
                  <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 border border-gray-200 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                  <button onClick={confirmDelete} className="flex-1 py-3 bg-[#FFD130] rounded-lg font-bold text-gray-900 hover:bg-[#eec225] transition-colors shadow-md">Confirm</button>
              </div>
           </div>
        </div>
      )}

      {/* PopUp thêm card */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 w-[500px] shadow-2xl relative">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Payout Details</h3>
                    <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>

                <form onSubmit={handleAddCard} className="space-y-5">
                    {/* Số thẻ */}
                    <div>
                        <label className="text-sm font-bold text-gray-700 block mb-2">Card Number</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={formData.cardNumber}
                                onChange={handleCardNumberChange}
                                placeholder="4966 0000 0000 0000" 
                                // LOGIC VIỀN: 
                                // border-gray-300 (Mặc định xám)
                                // focus:border-blue-500 (Click vào thì xanh)
                                // errors ? border-red-500 (Có lỗi thì đỏ)
                                className={`w-full border rounded-xl p-3 pr-10 font-mono text-lg text-gray-700 focus:outline-none bg-white transition-colors duration-200
                                    ${errors.cardNumber 
                                        ? 'border-red-500 focus:border-red-500' 
                                        : 'border-gray-300 focus:border-blue-500 shadow-sm'
                                    }`}
                            />
                        <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500" />
                    </div>
                    {errors.cardNumber && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.cardNumber}</p>}
            </div>

            <div className="flex gap-5">
                    {/* Ngày hết hạn*/}
                    <div className="flex-1">
                        <label className="text-sm text-gray-500 block mb-2">Expiry Date</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={formData.expiry}
                                onChange={handleExpiryChange}
                                placeholder="MM/YY" 
                                className={`w-full border rounded-xl p-3 text-gray-700 focus:outline-none transition-colors duration-200
                                    ${errors.expiry 
                                        ? 'border-red-500 focus:border-red-500' 
                                        : 'border-gray-300 focus:border-blue-500 shadow-sm'
                                    }`}
                            />
                            <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                    </div>
                    {/* CVV */}
                    <div className="flex-1">
                        <label className="text-sm text-gray-500 block mb-2">CVV</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={formData.cvv}
                                onChange={handleCVVChange}
                                placeholder="123" 
                                // Luôn là xám, click vào mới xanh (vì CVV ít khi check lỗi realtime)
                                className="w-full border border-gray-300 rounded-xl p-3 text-gray-700 focus:border-blue-500 focus:outline-none transition-colors duration-200 shadow-sm" 
                            />
                            <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
            </div>

                    {/* name*/}
                    <div>
                        <label className="text-sm text-gray-500 block mb-2">Cardholder's Name</label>
                        <input 
                            type="text" 
                            value={formData.holderName}
                            onChange={handleNameChange}
                            placeholder="Enter cardholder's full name" 
                            className="w-full border border-gray-300 rounded-xl p-3 text-gray-700 focus:border-blue-500 focus:outline-none uppercase transition-colors duration-300 shadow-sm" 
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={!isFormValid} 
                        className={`w-full font-bold py-4 rounded-xl mt-4 flex items-center justify-center gap-2 transition-all duration-300
                            ${isFormValid 
                                ? 'bg-[#0C67C0] text-white hover:bg-blue-700 shadow-lg shadow-blue-200 cursor-pointer'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            }
                        `}
                    >
                        <CreditCard size={20} /> Add Card
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default PayoutDetail;