import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaTrash, FaHeart, FaPlus, FaEdit, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState("");


  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCart(res.data?.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/addresses", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAddresses(res.data || []);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  // Add new address
  const handleAddAddress = async () => {
    if (!newAddress) return alert("Please enter address");
    try {
      await axios.post(
        "http://localhost:5000/api/addresses",
        { label: "Home", fullAddress: newAddress, isDefault: addresses.length === 0 },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setNewAddress("");
      fetchAddresses();
    } catch (err) {
      console.error("Error adding address:", err);
    }
  };

  // Fetch current location
  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();
        setNewAddress(data.display_name);
      });
    } else {
      alert("Geolocation not supported by your browser");
    }
  };


  const removeFromCart = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchCart();
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  const moveToWishlist = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/cart/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchCart();
    } catch (err) {
      console.error("Error moving to wishlist:", err);
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return; // Prevent negative or zero quantity
    try {
      await axios.put(
        `http://localhost:5000/api/cart/${id}`,
        { quantity },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const handlePayment = async (totalAmount) => {
    const amountInPaise = totalAmount * 100;
    try {
      const res = await fetch("http://localhost:5000/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: "receipt_order_01",
        }),
      });

      const orderData = await res.json();

      const options = {
        key: "rzp_test_7WDKJozgjmggqG",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "PharmaCare",
        description: "Order Payment",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch("http://localhost:5000/api/payment/order/validate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
              alert("Payment verification failed.");
              return;
            }

            await axios.post(
              "http://localhost:5000/api/orders",
              {
                items: cart.map((item) => ({
                  medicine: item.medicine._id,
                  quantity: item.quantity,
                  price: item.medicine.price,
                })),
                totalAmount,
                paymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
              },
              {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
              }
            );

            alert("Payment successful! Order placed.");
            fetchCart();
          } catch (err) {
            console.error("Error creating order:", err);
            alert("Failed to create order after payment.");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "+919999999999",
        },
        theme: { color: "#006D6D" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed to initiate.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <p>Loading cart...</p>;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.medicine?.price || 0) * item.quantity, 0);
  const totalDiscount = cart.reduce(
    (sum, item) =>
      sum + (((item.medicine?.discount || 0) * (item.medicine?.price || 0)) / 100) * item.quantity,
    0
  );
  const finalPrice = totalPrice - totalDiscount;

  return (
    <>
      <Navbar />
      <main className="px-6 py-8 bg-[#E8F5F5] min-h-screen">
        <h2 className="text-2xl font-bold text-[#006D6D] mb-6">
          My Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const med = item.medicine || {};
              return (
                <div key={item._id} className="bg-white rounded-lg shadow-md p-4 flex items-center">
                  <img
                    src={med.image || "https://via.placeholder.com/100"}
                    alt={med.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1 ml-4">
                    <h3 className="text-lg font-semibold text-[#006D6D]">{med.name}</h3>
                    <p className="text-gray-600 text-sm">{med.description}</p>
                    <p className="mt-2 text-[#F6B73C] font-bold">
                      ₹{(med.price - (med.price * (med.discount || 0)) / 100) * item.quantity}
                    </p>
                    {med.discount > 0 && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{med.price * item.quantity}
                      </span>
                    )}

                    {/* Quantity selector */}
                    <div className="mt-2 flex items-center space-x-2">
                      <button
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                        onClick={() => updateQuantity(med._id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border rounded bg-white text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                        onClick={() => updateQuantity(med._id, item.quantity + 1)}
                      >
                        +
                      </button>

                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => removeFromCart(med._id)}
                      className="flex items-center bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                    >
                      <FaTrash className="mr-1" /> Remove
                    </button>
                    <button
                      onClick={() => moveToWishlist(med._id)}
                      className="flex items-center bg-yellow-100 text-yellow-600 px-3 py-1 rounded hover:bg-yellow-200"
                    >
                      <FaHeart className="mr-1" /> Move to Wishlist
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 h-fit">
            <h3 className="text-lg font-semibold text-[#006D6D] border-b pb-2 mb-4">
              Price Details
            </h3>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Price ({totalItems} items)</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Discount</span>
              <span className="text-green-600">-₹{totalDiscount}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-[#006D6D] border-t pt-2">
              <span>Total Amount</span>
              <span>₹{finalPrice}</span>
            </div>
            <button
              onClick={() => handlePayment(finalPrice)}
              className="mt-4 w-full bg-[#006D6D] text-white py-2 rounded-lg hover:bg-[#005959]"
            >
              Buy
            </button>
          </div>
        </div>
      </main>

       {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Select Delivery Address</h2>
            {addresses.map((addr) => (
              <label key={addr._id} className="flex items-center mb-2">
                <input
                  type="radio"
                  name="address"
                  value={addr._id}
                  checked={selectedAddressId === addr._id}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                  className="mr-2"
                />
                {addr.fullAddress}
              </label>
            ))}

            {/* Add new address */}
            <textarea
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Enter new address"
              className="w-full p-2 border rounded mb-2"
            ></textarea>
            <button
              onClick={fetchCurrentLocation}
              className="flex items-center text-blue-600 text-sm mb-2"
            >
              <FaMapMarkerAlt className="mr-1" /> Use Current Location
            </button>
            <button
              onClick={handleAddAddress}
              className="bg-green-500 text-white px-3 py-1 rounded w-full"
            >
              Add Address
            </button>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowAddressModal(false)}
                className="bg-gray-300 px-3 py-1 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!selectedAddressId) return alert("Select an address");
                  setShowAddressModal(false);
                  handlePayment(finalPrice);
                }}
                className="bg-[#006D6D] text-white px-3 py-1 rounded"
              >
                Continue to Pay
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
