import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Khởi tạo router sử dụng createBrowserRouter
const router = createBrowserRouter([
  {
    path: '/',
    // Trang chủ (mặc định là trang Login)
    element: <LoginPage />, 
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
    {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
    }
]);

export default router;