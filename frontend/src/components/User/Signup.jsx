import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    const { username, email, password, confirmPassword } = formData;
    if (!username || !email || !password || !confirmPassword) {
      setMessage("All fields are required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Invalid email format.");
      return;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/api/users/signup", formData);
      setMessage("Signup successful! Please verify your email.");
      navigate("/verify-otp"); // Redirect to OTP verification page
    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-6 rounded shadow-md w-1/3"
        onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4">Signup</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full mb-3 p-2 border"
          onChange={handleChange}
        />
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
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="w-full mb-3 p-2 border"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded">
          Signup
        </button>
        {message && <p className="mt-4 text-red-500">{message}</p>}
        <div className="pt-2">
          Already have an account? <a href="/login" className="text-blue-400 hover:underline">Login</a>
        </div>
      </form>
    </div>
  );
};

export default Signup;
