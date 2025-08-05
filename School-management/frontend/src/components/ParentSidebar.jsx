// Import necessary icons and dependencies
import { FaChartLine, FaBullhorn, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import axios from 'axios';

// ParentSidebar component takes in activeTab and setActiveTab as props
const ParentSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate(); // For programmatic navigation
  const [, setAuthUser] = useAuth(); // Access auth context to update user state

  // Function to handle logout logic
  const handleLogout = async () => {
    try {
      // Call logout API with credentials
      await axios.post('http://localhost:5002/api/auth/logout', {}, { withCredentials: true });
      
      // Clear local storage and auth user context
      localStorage.removeItem('messenger');
      setAuthUser(null);

      // Redirect to login page
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Logout failed!');
    }
  };

  // Define sidebar menu items with corresponding icons
  const menuItems = [
    { name: 'performance', icon: <FaChartLine /> },
    { name: 'notices', icon: <FaBullhorn /> },
    { name: 'events', icon: <FaCalendarAlt /> },
  ];

  return (
    <aside
      className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-purple-600 text-white p-6 shadow-lg z-30 flex flex-col justify-between"
    >
      {/* Top section with header and menu items */}
      <div>
        <h2 className="text-2xl font-bold mb-8">Parent</h2>

        {/* Render menu items */}
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-purple-700 transition ${
                activeTab === item.name ? 'bg-purple-700' : ''
              }`}
              onClick={() => setActiveTab(item.name)} // Update active tab on click
            >
              {item.icon}
              <span className="capitalize">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout button at bottom */}
      <button
        onClick={handleLogout}
        className="flex items-center space-x-3 text-red-100 hover:bg-red-600 px-3 py-2 rounded transition"
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default ParentSidebar;
// This component provides a sidebar for parents with navigation options and logout functionality.