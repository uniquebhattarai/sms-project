import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  function changeHandler(event) {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  function submitHandler(event) {
    event.preventDefault();
    setIsLoggedIn(true);
    toast.success('Logged In');
    navigate('/dashboard');
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-secondary">
      <form
        onSubmit={submitHandler}
        className="w-full max-w-md rounded-xl bg-blue-950 p-8 shadow-lg"
      >
        <h2 className="mb-6 text-center text-2xl font-bold text-white">Welcome Back 👋</h2>

        {/* Email */}
        <label className="mb-4 block">
          <p className="mb-1 text-sm text-white">Email Address</p>
          <input
            type="email"
            value={formData.email}
            onChange={changeHandler}
            name="email"
            id="email"
            required
            placeholder="Enter your email"
            className="w-full rounded border border-blue-700 bg-transparent px-3 py-2 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
          />
        </label>

        {/* Password */}
        <label className="mb-6 block relative">
          <p className="mb-1 text-sm text-white">Password</p>
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={changeHandler}
            name="password"
            id="password"
            required
            placeholder="Enter your password"
            className="w-full rounded border border-blue-700 bg-transparent px-3 py-2 pr-10 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
          />
          <span
            className="absolute right-3 top-[38px] cursor-pointer text-white"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
          </span>
        </label>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full rounded bg-blue-700 px-4 py-2 text-white transition hover:bg-blue-800 hover:cursor-pointer"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
