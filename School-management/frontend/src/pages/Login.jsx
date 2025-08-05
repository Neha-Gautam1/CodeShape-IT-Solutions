import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthProvider';
import toast from 'react-hot-toast';

const roles = ['admin', 'teacher', 'student', 'parent'];

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const [, setAuthUser] = useAuth(); // only setAuthUser needed

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'http://localhost:5002/api/auth/login',
        {
          email: form.email,
          password: form.password,
          role: selectedRole,
        },
        {
          withCredentials: true, // important for cookie to be sent
        }
      );

      if (res.data) {
        localStorage.setItem('messenger', JSON.stringify(res.data));
        setAuthUser(res.data);
        toast.success('Login successful!');

        // Navigate based on role
        switch (selectedRole) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'teacher':
            navigate('/teacher/dashboard');
            break;
          case 'student':
            navigate('/student/dashboard');
            break;
          case 'parent':
            navigate('/parent/dashboard');
            break;
          default:
            navigate('/');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center px-4 pt-24">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Login</h1>

      {/* Role Tabs */}
      <div className="flex space-x-4 mb-6">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`px-4 py-2 rounded-md font-semibold border transition duration-200 ${
              selectedRole === role
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-100'
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md bg-white bg-opacity-80 backdrop-blur-md p-8 rounded-xl shadow-xl border border-blue-100">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder={`${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Email`}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-transparent text-blue-900 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-blue-400"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-2 bg-transparent text-blue-900 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
          >
            Login as {selectedRole}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
