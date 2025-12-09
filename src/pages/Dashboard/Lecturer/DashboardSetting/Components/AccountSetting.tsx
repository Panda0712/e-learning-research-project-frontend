import { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react'; 

const AccountSetting = () => {
  const [activeTab] = useState('account');
  const [showCurrentPass, setShowCurrentPass] = useState(false); 
  const [showNewPass, setShowNewPass] = useState(false);

  const [formData, setFormData] = useState({
    name: 'Bang',
    email: '',
    location: '',
    phone: '',
    bio: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    phone: ''
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/\D/g, ''); 
    
    setFormData({ ...formData, phone: numericValue });
  };

  const validateEmail = (e: React.FocusEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue && !emailRegex.test(emailValue)) {
        setErrors(prev => ({ ...prev, email: 'Invalid email (Example: abc@gmail.com)' }));
    } else {
        setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className=" font-poppins">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* form right */}
        <div className="">
            
            {/*Account & security */}
            {activeTab === 'account' && (
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-8">ACCOUNT SETTINGS</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* name */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-500">Name</label>
                            <input 
                                name="name"
                                type="text" 
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500 text-sm" 
                            />
                        </div>
                        
                        {/* email */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-500">Email</label>
                            <input 
                                name="email"
                                type="email" 
                                value={formData.email}
                                onChange={handleChange} 
                                onBlur={validateEmail} 
                                placeholder="Email" 
                                className={`w-full border rounded-lg p-3 focus:outline-none text-sm 
                                    ${errors.email 
                                        ? 'border-red-500 focus:border-red-500' 
                                        : 'border-gray-200 focus:border-blue-500'
                                    }`} 
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs flex items-center gap-1">
                                    <AlertCircle size={12}/> {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-500">Location</label>
                            <input type="text" placeholder="Location" className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500 text-sm" />
                        </div>

                        {/* Phone number */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-500">Phone number</label>
                            <input 
                                name="phone"
                                type="text" 
                                value={formData.phone}
                                onChange={handlePhoneChange} 
                                placeholder="Phone number" 
                                maxLength={11} 
                                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500 text-sm" 
                            />
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="mb-6">
                        <label className="text-sm text-gray-500 block mb-2">Date of Birth</label>
                        <div className="grid grid-cols-3 gap-4 max-w-md">
                            <select className="border border-gray-200 rounded-lg p-3 text-sm bg-white focus:outline-none focus:border-blue-500 text-gray-600">
                                <option>DD</option>
                                {[...Array(31)].map((_, i) => <option key={i}>{i + 1}</option>)}
                            </select>
                            <select className="border border-gray-200 rounded-lg p-3 text-sm bg-white focus:outline-none focus:border-blue-500 text-gray-600">
                                <option>MM</option>
                                {[...Array(12)].map((_, i) => <option key={i}>{i + 1}</option>)}
                            </select>
                            <select className="border border-gray-200 rounded-lg p-3 text-sm bg-white focus:outline-none focus:border-blue-500 text-gray-600">
                                <option>YYYY</option>
                                {[...Array(50)].map((_, i) => <option key={i}>{2025 - i}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Bio/About */}
                    <div className="mb-8">
                        <label className="text-sm text-gray-500 block mb-2">Bio/About</label>
                        <textarea rows={4} className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500 text-sm resize-none"></textarea>
                    </div>

                    {/* Button */}
                    <div className="flex gap-4 mb-10">
                        <button className="px-6 py-2.5 rounded-full border border-blue-100 text-blue-600 font-medium hover:bg-blue-50 transition-colors">
                            Cancel
                        </button>
                        <button className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-md shadow-blue-200">
                            Save & Change
                        </button>
                    </div>

                    <hr className="border-gray-100 my-8" />

                    {/*Security Settings*/}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-8">SECURITY SETTINGS</h2>
                        
                        <div className="space-y-6 max-w-lg">
                            {/* Current Password */}
                            <div className="space-y-2">
                                <label className="text-sm text-gray-500">Current Password</label>
                                <div className="relative">
                                    <input 
                                        type={showCurrentPass ? "text" : "password"} 
                                        className="w-full border border-gray-200 rounded-lg p-3 pr-10 focus:outline-none focus:border-blue-500 text-sm" 
                                    />
                                    <button 
                                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div className="space-y-2">
                                <label className="text-sm text-gray-500">New Password</label>
                                <div className="relative">
                                     <input 
                                        type={showNewPass ? "text" : "password"} 
                                        className="w-full border border-gray-200 rounded-lg p-3 pr-10 focus:outline-none focus:border-blue-500 text-sm" 
                                    />
                                    <button 
                                        onClick={() => setShowNewPass(!showNewPass)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Password Strength</span>
                                    <span className="text-green-600 font-medium">Strong</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-green-500 h-1.5 rounded-full w-3/4"></div>
                                </div>
                            </div>

                            <button className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors w-full md:w-auto shadow-md shadow-blue-200">
                                Update Security Settings
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AccountSetting;