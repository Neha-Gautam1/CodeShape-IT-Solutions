import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

export default function InventoryPage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [stockInput, setStockInput] = useState({});

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/inventory", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMedicines(res.data);

      // Initialize stock inputs
      const stockValues = {};
      res.data.forEach((med) => {
        stockValues[med._id] = med.stock || 0;
      });
      setStockInput(stockValues);
    } catch (err) {
      setError("Failed to fetch inventory.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockChange = (id, value) => {
    if (/^\d*$/.test(value)) {
      setStockInput((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleUpdateStock = async (id) => {
    const newStock = parseInt(stockInput[id], 10);
    if (isNaN(newStock) || newStock < 0) {
      alert("Please enter a valid non-negative stock number");
      return;
    }
    try {
      setUpdatingId(id);
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/inventory/${id}`,
        { stock: newStock },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Stock updated successfully");
      fetchInventory();
    } catch (error) {
      alert("Failed to update stock");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#E8F5F5] p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-[#006D6D] mb-6">Inventory Management</h2>

        {loading && <p className="text-[#006D6D] font-semibold">Loading inventory...</p>}
        {error && <p className="text-red-600 font-semibold">{error}</p>}

        {!loading && !error && medicines.length === 0 && (
          <p className="text-gray-600">No medicines found.</p>
        )}

        {!loading && !error && medicines.length > 0 && (
          <table className="w-full bg-white rounded shadow overflow-hidden text-gray-900">
            <thead className="bg-[#006D6D] text-white">
              <tr>
                <th className="p-3 text-left  border-gray-200">Medicine Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Price (₹)</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med) => (
                <tr key={med._id} className="border-b">
                  <td className="p-3">{med.name}</td>
                  <td className="p-3">{med.category || "-"}</td>
                  <td className="p-3">₹{med.price?.toFixed(2) || "-"}</td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={stockInput[med._id]}
                      onChange={(e) => handleStockChange(med._id, e.target.value)}
                      className="w-20 border rounded px-2 py-1"
                      disabled={updatingId === med._id}
                    />
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleUpdateStock(med._id)}
                      disabled={updatingId === med._id}
                      className="bg-[#006D6D] text-white px-3 py-1 rounded hover:bg-[#005959]"
                    >
                      {updatingId === med._id ? "Updating..." : "Update"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
      <Footer />
    </>
  );
}
