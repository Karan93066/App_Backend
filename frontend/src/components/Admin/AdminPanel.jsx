import React, { useState } from "react";
import Users from "./Users";
import Offers from "./Offers";
import Packages from "./Packages";
import SubAdmin from "./SubAdmin";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("Users");
  const [error, setError] = useState(""); // For handling errors
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      dispatch(logout());
      localStorage.removeItem("token");
      navigate("/login");
    } catch (e) {
      setError("Logout failed. Please try again.");
    }
  };

  const theme = {
    primary: "bg-blue-600 hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-800",
    activeTab: "bg-teal-600 text-white",
    tabHover: "hover:bg-teal-500",
    logout: "bg-red-500 hover:bg-red-600",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className={`${theme.primary} text-white p-4 flex justify-between shadow-md`}>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <div className="flex gap-4">
          {["Users", "Offers", "Packages", "SubAdmin"].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 rounded ${activeTab === tab ? theme.activeTab : theme.tabHover}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className={`${theme.logout} text-white py-2 px-4 rounded`}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6">
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}
        {activeTab === "Users" && <Users />}
        {activeTab === "Offers" && <Offers />}
        {activeTab === "Packages" && <Packages />}
        {activeTab === "SubAdmin" && <SubAdmin />}
      </div>
    </div>
  );
};

export default AdminPanel;
