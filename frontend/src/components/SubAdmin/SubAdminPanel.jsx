import React from 'react';
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";

function SubAdminPanel() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const handleLogout = () => {
      dispatch(logout());
      localStorage.removeItem("token");
      navigate("/login");
    };
    return (
        <div>
            <h1>Welcome to sub admin panel</h1>
            <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded">
            Logout
          </button>
        </div>
    );
}

export default SubAdminPanel;