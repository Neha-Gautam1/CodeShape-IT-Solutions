import { NavLink, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaChalkboardTeacher, FaBook, FaCalendarAlt, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthProvider';

const Sidebar = () => {
  const baseStyle =
    'flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200';
  const activeClassName = ({ isActive }) =>
    isActive
      ? `${baseStyle} bg-blue-600 text-white shadow-md`
      : `${baseStyle} text-blue-100 hover:bg-blue-500 hover:text-white`;

  const navigate = useNavigate();
  const [, setAuthUser] = useAuth();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5002/admin/logout', {}, { withCredentials: true });
      localStorage.removeItem('messenger');
      setAuthUser(null);
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Logout failed!');
    }
  };

  return (
    <div className="w-64 h-screen bg-blue-800 text-white fixed top-0 left-0 p-6 shadow-lg z-10">
      <h2 className="text-2xl font-bold text-white mb-10 text-center">Admin Panel</h2>
      <nav className="flex flex-col space-y-3">
        <NavLink to="/admin/dashboard" className={activeClassName}>
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/users" className={activeClassName}>
          <FaUsers />
          <span>Manage Users</span>
        </NavLink>
        <NavLink to="/admin/classes" className={activeClassName}>
          <FaChalkboardTeacher />
          <span>Manage Classes</span>
        </NavLink>
        <NavLink to="/admin/subjects" className={activeClassName}>
          <FaBook />
          <span>Subjects</span>
        </NavLink>
        <NavLink to="/admin/timetable" className={activeClassName}>
          <FaCalendarAlt />
          <span>Timetable</span>
        </NavLink>
        <NavLink to="/admin/reports" className={activeClassName}>
          <FaChartBar />
          <span>Reports</span>
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`${baseStyle} text-red-200 hover:bg-red-500 hover:text-white`}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
