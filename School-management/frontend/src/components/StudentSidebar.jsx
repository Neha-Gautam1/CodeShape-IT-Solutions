// components/StudentSidebar.jsx
import {
  FaUserGraduate,
  FaBookOpen,
  FaClipboardList,
  FaFolderOpen,
  FaCheckCircle,
  FaCommentDots,
  FaBullhorn,
  FaSignOutAlt,
} from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import toast from 'react-hot-toast';

const StudentSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const [, setAuthUser] = useAuth();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5002/api/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('messenger');
      setAuthUser(null);
      toast.success('Logout successful!');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      toast.error('Logout failed!');
    }
  };

  const menuItems = [
    { name: 'profile', icon: <FaUserGraduate /> },
    { name: 'schedule', icon: <FaClipboardList /> },
    { name: 'grades', icon: <FaBookOpen /> },
    { name: 'materials', icon: <FaFolderOpen /> },
    { name: 'attendance', icon: <FaCheckCircle /> },
    { name: 'announcements', icon: <FaBullhorn /> }, // ✅ New announcements tab
    { name: 'feedback', icon: <FaCommentDots /> },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-green-600 text-white p-6 shadow-lg z-50 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-8">Student</h2>
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-green-700 transition ${
                activeTab === item.name ? 'bg-green-700' : ''
              }`}
              onClick={() => setActiveTab(item.name)}
            >
              {item.icon}
              <span className="capitalize">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center space-x-3 text-red-100 hover:bg-red-600 px-3 py-2 rounded transition"
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default StudentSidebar;
