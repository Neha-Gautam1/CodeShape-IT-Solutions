import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaInfoCircle } from "react-icons/fa";
import axios from "axios";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(res.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="p-6 bg-[#E8F5F5] min-h-screen flex justify-center items-center">
          <p className="text-[#006D6D] text-xl font-semibold">
            Loading your orders...
          </p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="px-6 py-8 bg-[#E8F5F5] min-h-screen">
        <h2 className="text-2xl font-bold text-[#006D6D] mb-6">My Orders</h2>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div className="mb-4 md:mb-0 flex-1">
                <h3 className="text-lg font-semibold text-[#006D6D]">
                  Order ID: {order._id}
                </h3>
                <p className="text-gray-600 text-sm">
                  Date: {new Date(order.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Payment ID: {order.paymentId || "N/A"}
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Items:
                  {order.items.map((item, idx) => (
                    <span key={idx} className="block">
                      {item.quantity} × {item.medicine?.name || "Unknown"} — ₹{item.price}
                    </span>
                  ))}
                </p>
              </div>

              <div className="flex flex-col items-start md:items-end space-y-2">
                <span
                  className={`px-3 py-1 rounded-full font-semibold text-sm ${getStatusStyles(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
                <span className="font-bold text-lg text-[#006D6D]">
                  ₹{order.totalAmount}
                </span>
                <button
                  type="button"
                  className="flex items-center space-x-2 bg-[#006D6D] hover:bg-[#005959] text-white px-3 py-1 rounded text-sm"
                  onClick={() => alert(`Order details for ${order._id}`)}
                >
                  <FaInfoCircle />
                  <span>Details</span>
                </button>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <p className="text-gray-500 text-center mt-20">
              No orders found. Start shopping!
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
