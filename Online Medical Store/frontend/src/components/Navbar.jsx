import { FaUserCircle, FaShoppingCart, FaSearch, FaUserPlus, FaHeart, FaShoppingBag, FaClipboardList, FaUsersCog, FaBoxes, FaChartBar } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [profileName, setProfileName] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);


  const fetchProfile = () => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const user = res.data.user;
          let photoUrl = "";
          if (user.photo) {
            photoUrl = user.photo.startsWith("http")
              ? user.photo
              : `http://localhost:5000${user.photo}`;
          }
          setProfilePhoto(photoUrl);
          setProfileName(user.name || "");
          setRole(user.role || "");
        })
        .catch(() => {
          setProfilePhoto("");
          setProfileName("");
          setRole("");
        });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    fetchProfile();

    const updateListener = (e) => {
      const updatedUser = e.detail;
      if (updatedUser) {
        setProfileName(updatedUser.name || "");
        setProfilePhoto(
          updatedUser.photo
            ? updatedUser.photo.startsWith("http")
              ? updatedUser.photo
              : `http://localhost:5000${updatedUser.photo}`
            : ""
        );
        setRole(updatedUser.role || "");
      } else {
        fetchProfile();
      }
    };
    window.addEventListener("profileUpdated", updateListener);

    return () => {
      window.removeEventListener("profileUpdated", updateListener);
    };
  }, []);

 useEffect(() => {
  if (isLoggedIn && role === "User") {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/wishlist/count", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setWishlistCount(res.data.count || 0);
      })
      .catch(() => setWishlistCount(0));

    axios
      .get("http://localhost:5000/api/cart/count", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCartCount(res.data.count || 0);
      })
      .catch(() => setCartCount(0));
  }
}, [isLoggedIn, role]);


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/user/dashboard?name=${encodeURIComponent(searchTerm)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setProfilePhoto("");
    setProfileName("");
    setRole("");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center">
        <Link to="/">
          <img src="/logo.png" alt="PharmaCare Logo" className="h-14 md:h-16 cursor-pointer" />
        </Link>
      </div>

      {role === "User" && (
        <form onSubmit={handleSearchSubmit} className="flex-1 mx-6 relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search medicines, products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      )}

      <div className="flex items-center space-x-4">
        {isLoggedIn && role === "User" && (
          <>
            <Link to="/wishlist" className="relative">
              <FaHeart className="h-8 w-8 text-[#006D6D]" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                {wishlistCount}
              </span>
            </Link>
            <Link to="/cart" className="relative">
  <FaShoppingCart className="h-8 w-8 text-[#006D6D]" />
  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
    {cartCount}
  </span>
</Link>

            <Link to="/myorders">
              <FaShoppingBag className="h-8 w-8 text-[#006D6D]" />
            </Link>
          </>
        )}

        {isLoggedIn && role === "Admin" && (
          <>
            <Link to="/adminorders" title="All Orders">
              <FaClipboardList className="h-8 w-8 text-[#006D6D]" />
            </Link>
            <Link to="/users" title="Manage Users">
              <FaUsersCog className="h-8 w-8 text-[#006D6D]" />
            </Link>
            <Link to="/inventory" title="Inventory">
              <FaBoxes className="h-8 w-8 text-[#006D6D]" />
            </Link>
            <Link to="/reports" title="Reports">
              <FaChartBar className="h-8 w-8 text-[#006D6D]" />
            </Link>
          </>
        )}

        {isLoggedIn ? (
          <Link to={role === "Admin" ? "/adminprofile" : "/userprofile"} className="flex items-center space-x-2">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover border-2 border-[#006D6D]"
              />
            ) : (
              <FaUserCircle className="h-8 w-8 text-[#006D6D]" />
            )}
            <span className="text-sm font-semibold text-gray-700">{profileName}</span>
          </Link>
        ) : (
          <FaUserCircle className="h-8 w-8 text-gray-400" />
        )}
        {!isLoggedIn ? (
          <Link to="/login" className="text-gray-700">Login</Link>
        ) : (
          <button onClick={handleLogout} className="text-gray-700 hover:text-red-600">
            Logout
          </button>
        )}
        {!isLoggedIn && (
          <Link
            to="/signup"
            className="group relative flex items-center justify-center bg-[#006D6D] text-white w-10 h-10 rounded-full"
          >
            <FaUserPlus className="h-5 w-5" />
          </Link>
        )}
      </div>
    </nav>
  );
}
