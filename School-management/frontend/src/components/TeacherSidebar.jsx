// components/TeacherSidebar.jsx
import {
  FaChalkboardTeacher,
  FaClipboardCheck,
  FaMedal,
  FaFolder,
  FaBullhorn,
  FaSignOutAlt,
  FaListOl
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import axios from 'axios';

const TeacherSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const [, setAuthUser] = useAuth();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5002/api/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('messenger');
      setAuthUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Logout failed!');
    }
  };

  const menuItems = [
    { name: 'classes', icon: <FaChalkboardTeacher /> },
    { name: 'attendance', icon: <FaClipboardCheck /> },
    { name: 'grades', icon: <FaMedal /> },
    { name: 'materials', icon: <FaFolder /> },
    { name: 'announcements', icon: <FaBullhorn /> },
     { name: 'rollnumbers', icon: <FaListOl /> },
  ];

  return (
   <div className="fixed left-0 top-16 h-[calc(100%-4rem)] w-64 bg-blue-700 text-white p-6 shadow-lg z-50 flex flex-col justify-between">

      <div>
        <h2 className="text-2xl font-bold mb-8">Teacher</h2>
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-blue-800 transition ${
                activeTab === item.name ? 'bg-blue-800' : ''
              }`}
              onClick={() => setActiveTab(item.name)}
            >
              {item.icon}
              <span className="capitalize">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout Button */}
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

export default TeacherSidebar;
