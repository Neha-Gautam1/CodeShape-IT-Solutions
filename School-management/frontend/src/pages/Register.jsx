import React from 'react';
import { useForm } from "react-hook-form";
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthProvider";
import toast from "react-hot-toast";

const Register = () => {
  const [authUser, setAuthUser] = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

   const navigate = useNavigate();
  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");
  const validatePasswordMatch = (value) => {
    return password === value || "Passwords do not match";
  };

  const onSubmit = async (data) => {
    const userInfo = {
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    await axios.post("http://localhost:5002/admin/signup", userInfo)
      .then((response) => {
        console.log("Signup successful:", response.data);
        if (response.data) {
          toast.success("Signup successful! Please login.");
          navigate("/login");
        }
        localStorage.setItem("messenger", JSON.stringify(response.data));
        setAuthUser(response.data);
      })
      .catch((error) => {
        if (error.response) {
          toast.error("Error:" + error.response.data.message);
        }
      });
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center px-4 pt-24">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Admin Registration</h1>

      <div className="w-full max-w-md bg-white bg-opacity-80 backdrop-blur-md p-8 rounded-xl shadow-xl border border-blue-100">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full px-4 py-2 bg-transparent text-blue-900 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-blue-400"
                {...register("name", { required: true })}

            />
             {errors.name && <span className='text-red-400 text-xs mt-1'>*This field is required*</span>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
          
              className="w-full px-4 py-2 bg-transparent text-blue-900 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-blue-400"
             {...register("email", { required: true })}
            />
             {errors.name && <span className='text-red-400 text-xs mt-1'>*This field is required*</span>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-2 bg-transparent text-blue-900 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-blue-400"
               {...register("password", { required: true })}
            />
             {errors.password && <span className='text-red-400 text-xs mt-1'>*This field is required*</span>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
             Confirm Password
            </label>
            <input
              type="password"
              name="password"
             placeholder="Confirm password"
              className="w-full px-4 py-2 bg-transparent text-blue-900 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-blue-400"
               {...register("confirmPassword", {
              required: true,
              validate: validatePasswordMatch,
            })}
            />
             {errors.confirmPassword && (
            <span className='text-red-400 text-xs mt-1'>
              *{errors.confirmPassword.message}*
            </span>
          )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
          >
            Register as Admin
          </button>
        </form>

        {/* ✅ Login Redirect Link */}
        <p className="text-center mt-6 text-sm text-gray-700">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
