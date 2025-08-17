import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/orders/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders(); // refresh after update
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="p-6 bg-[#E8F5F5] min-h-screen flex justify-center items-center">
          <p className="text-[#006D6D] text-xl font-semibold">Loading all orders...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="px-6 py-8 bg-[#E8F5F5] min-h-screen">
        <h2 className="text-2xl font-bold text-[#006D6D] mb-6">All Customer Orders</h2>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
              {/* User Info */}
              <div className="mb-4 border-b pb-2">
                <h3 className="text-lg font-semibold text-[#006D6D]">
                  {order.user?.name || "Unknown Customer"}
                </h3>
                <p className="text-gray-600">{order.user?.email}</p>
                {order.user?.mobile && <p className="text-gray-600">Mobile: {order.user.mobile}</p>}
                {order.user?.address && <p className="text-gray-600">Address: {order.user.address}</p>}
              </div>

              {/* Order Info */}
              <div>
                <p className="text-gray-600">Order ID: {order._id}</p>
                <p className="text-gray-600">
                  Date: {new Date(order.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600">Payment ID: {order.paymentId || "N/A"}</p>
                <p className="text-[#006D6D] font-bold text-lg">Total: ₹{order.totalAmount}</p>

                {/* Status Update */}
                <label className="block mt-2 font-semibold">Status:</label>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="border border-gray-300 rounded p-1"
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Order Items */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center bg-gray-50 p-3 rounded">
                    <img
                      src={item.medicine?.image || "https://via.placeholder.com/100"}
                      alt={item.medicine?.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="ml-3">
                      <p className="font-semibold">{item.medicine?.name}</p>
                      <p className="text-sm">{item.quantity} × ₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <p className="text-gray-500 text-center mt-20">No orders found.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
