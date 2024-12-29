import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/authSlice";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/api/admin/", formData);
      const { token } = res.data;
      console.log(res)
      dispatch(login({ token, role: "admin" }));
      localStorage.setItem("token", token);
      navigate("/adminpanel");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-1/3" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4">Admin Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border"
          onChange={handleChange}
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Login
        </button>
        {message && <p className="mt-4 text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default AdminLogin;
