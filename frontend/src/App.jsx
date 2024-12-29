import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Signup from "./components/User/Signup";
import Login from "./components/User/Login";
import OTPVerification from "./components/User/OTPVerification";
import AdminPanel from "./components/Admin/AdminPanel";
import AdminLogin from "./components/Admin/AdminLogin";
import SubAdminLogin from "./components/SubAdmin/SubAdminLogin";
import SubAdminPanel from "./components/SubAdmin/SubAdminPanel";
import UserPanel from "./components/User/User_Panel";

const ProtectedRoute = ({ element, role }) => {
  const { token, role: userRole } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && role !== userRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

const Unauthorized = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 text-white">
    <h1 className="text-5xl font-bold">403 - Unauthorized</h1>
    <p className="text-lg mt-4">
      Sorry, you don't have permission to view this page.
    </p>
    <a
      href="/login"
      className="mt-6 px-6 py-3 bg-white text-red-500 rounded-lg shadow hover:bg-gray-100">
      Go to Login
    </a>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
    <h1 className="text-5xl font-bold">404 - Page Not Found</h1>
    <p className="text-lg mt-4">The page you are looking for doesn't exist.</p>
    <a
      href="/"
      className="mt-6 px-6 py-3 bg-white text-blue-500 rounded-lg shadow hover:bg-gray-100">
      Go to Homepage
    </a>
  </div>
);

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route
          path="/adminpanel"
          element={<ProtectedRoute element={<AdminPanel />} role="admin" />}
        />
        <Route path="/subadminlogin" element={<SubAdminLogin />} />
        <Route
          path="/subadminpanel"
          element={
            <ProtectedRoute element={<SubAdminPanel />} role="subadmin" />
          }
        />
        <Route
          path="/userpanel"
          element={<ProtectedRoute element={<UserPanel />} role="user" />}
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
