import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { FaShoppingCart, FaHeart, FaStar } from "react-icons/fa";

export default function UserDashboard() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const searchName = getSearchQuery();
        const res = await axios.get("http://localhost:5000/api/medicines", {
          params: searchName ? { name: searchName } : {},
        });
        setMedicines(res.data);
      } catch (err) {
        console.error("Error fetching medicines:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, [location.search]);

  // Extract search query param if needed
  function getSearchQuery() {
    const params = new URLSearchParams(location.search);
    return params.get("name") || "";
  }

  // Add to Cart
  const handleAddToCart = async (med) => {
    try {
      await axios.post(
        "http://localhost:5000/api/cart",
        { medicineId: med._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert(`✅ Added "${med.name}" to cart`);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("❌ Could not add to cart");
    }
  };

  // Move to Wishlist
  const handleMoveToWishlist = async (med) => {
    try {
      await axios.post(
        "http://localhost:5000/api/wishlist",
        { medicineId: med._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert(`💖 Added "${med.name}" to wishlist`);
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      alert("❌ Could not add to wishlist");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="p-6 bg-[#E8F5F5] min-h-screen flex justify-center items-center">
          <p className="text-[#006D6D] text-xl font-semibold">Loading medicines...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="px-6 py-8 bg-[#E8F5F5] min-h-screen max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-[#006D6D] mb-6">
          Available Medicines ({medicines.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((med) => {
            const discount = med.discount || 0;
            const discountedPrice = med.price - (med.price * discount) / 100;
            const rating = med.rating || 0;

            return (
              <div
                key={med._id}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
              >
                {/* Image with link */}
                <Link to={`/medicines/${med._id}`} className="relative block flex-shrink-0">
                  <img
                    src={med.image || "https://via.placeholder.com/400x300?text=No+Image"}
                    alt={med.name}
                    className="w-full h-48 object-cover"
                  />
                  {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      {discount}% OFF
                    </span>
                  )}
                </Link>

                {/* Details */}
                <div className="p-4 flex flex-col flex-1">
                  <Link to={`/medicines/${med._id}`}>
                    <h3 className="text-lg font-semibold text-[#006D6D] hover:underline">
                      {med.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm flex-grow">{med.description}</p>

                  {/* Average rating stars */}
                  <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-gray-700 font-semibold">{rating.toFixed(1)}</span>
                  </div>

                  {/* Price */}
                  <div className="mt-3">
                    <span className="text-lg font-bold text-[#F6B73C]">
                      ₹{discountedPrice.toFixed(2)}
                    </span>
                    {discount > 0 && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ₹{med.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="mt-auto flex space-x-2 pt-4">
                    <button
                      onClick={() => handleAddToCart(med)}
                      className="flex items-center justify-center bg-[#006D6D] text-white px-3 py-2 rounded hover:bg-[#005959] flex-1"
                    >
                      <FaShoppingCart className="mr-1" /> Add to Cart
                    </button>
                    <button
                      onClick={() => handleMoveToWishlist(med)}
                      className="flex items-center justify-center bg-yellow-100 text-yellow-700 px-3 py-2 rounded hover:bg-yellow-200 flex-1"
                    >
                      <FaHeart className="mr-1" /> Move to Wishlist
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
