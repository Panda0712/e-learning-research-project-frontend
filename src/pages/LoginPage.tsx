import React, { useState } from 'react';
import { FaFacebookF } from 'react-icons/fa'; // Cài đặt react-icons nếu chưa có: npm install react-icons
import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import { removeVietnameseMarks } from '../utils/stringUtils';


const LoginPage: React.FC = () => {
    // State để quản lý trạng thái ẩn/hiện mật khẩu
    const [showPassword, setShowPassword] = useState(false);
    // State lưu mật khẩu (bắt đầu là raw input)
    const [password, setPassword] = useState(''); 
    
    // Hàm xử lý nhập liệu và lọc dấu
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const cleanedValue = removeVietnameseMarks(value); // GỌI HÀM TỪ UTILS
        setPassword(cleanedValue); 
    };

    // Hàm chuyển đổi trạng thái
    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    return (
        // 1. Container chính, căn giữa
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            
            {/* 2. Khung form - Card */}
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
                
                {/* Header */}
                <h1 className="text-center text-3xl font-bold text-gray-800">Login</h1>
                <p className="mb-6 text-center text-sm text-gray-500">Login to access your account</p>
                
                <form>
                    {/* Trường Email */}
                    <div className="mb-4">
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    {/* Trường Password */}
                    <div className="mb-4">
                        <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"} 
                                id="password"
                                placeholder="Enter your password"
                                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                                value={password} 
                                onChange={handlePasswordChange} // Gắn hàm xử lý lọc dấu
                            />
                            {/* Ẩn/hiện mật khẩu */}
                            <span 
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition"
                                onClick={togglePasswordVisibility} // 👈 Kích hoạt chức năng
                            >
                                {/* Thay đổi biểu tượng dựa trên trạng thái */}
                                {showPassword ? '🙈' : '👁'} 
                            </span>
                        </div>
                    </div>

                    {/* Remember me & Forgot Password */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>
                        <Link to="forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                            Forgot password?
                        </Link>
                    </div>
                    
                    {/* Nút Login chính */}
                    <button
                        type="submit"
                        className="w-full rounded-md bg-sky-500 py-2 text-lg font-semibold text-white transition duration-200 hover:bg-sky-600"
                    >
                        Login
                    </button>
                    
                </form>

                {/* Phần Sign up và Social Login */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account? 
                        {/* Link đến trang Đăng ký */}
                        <Link to="/signup" className="ml-1 font-semibold text-pink-500 hover:text-pink-600">
                            Sign up
                        </Link>
                    </p>
                    
                    {/* Dòng phân cách "or login" */}
                    <div className="my-4 flex items-center">
                        <div className="h-px flex-grow bg-pink-200"></div>
                        <span className="px-2 text-sm text-gray-500">or login</span>
                        <div className="h-px flex-grow bg-pink-200"></div>
                    </div>
                    
                    {/* Nút Social Login */}
                    <div className="flex justify-center space-x-4">
                        {/* Facebook */}
                        <button className="flex items-center rounded-md border border-gray-300 bg-white p-2 hover:bg-gray-50">
                            <FaFacebookF className="h-6 w-6 text-blue-600" />
                        </button>
                        {/* Google */}
                        <button className="flex items-center rounded-md border border-gray-300 bg-white p-2 hover:bg-gray-50">
                            <FcGoogle className="h-6 w-6" />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoginPage;