import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaPlus, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const placeholderImg = "https://via.placeholder.com/100x100.png?text=No+Image";
const API_BASE_URL = "http://localhost:5000/api/medicines";

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    image: "",
    discount: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE_URL);
      setMedicines(res.data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      alert("Failed to fetch medicines");
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setFormData({
      id: null,
      name: "",
      description: "",
      price: "",
      image: "",
      discount: "",
      category: "",
    });
    setIsFormOpen(true);
  };

  const openEditForm = (medicine) => {
    setFormData({
      id: medicine._id,
      name: medicine.name,
      description: medicine.description,
      price: medicine.price,
      image: medicine.image || "",
      discount: medicine.discount || "",
      category: medicine.category || "",
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Name and price are required!");
      return;
    }
    try {
      if (formData.id) {
        await axios.put(`${API_BASE_URL}/${formData.id}`, {
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          image: formData.image,
          discount: Number(formData.discount) || 0,
          category: formData.category,
        });
        alert("Medicine updated successfully");
      } else {
        await axios.post(API_BASE_URL, {
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          image: formData.image,
          discount: Number(formData.discount) || 0,
          category: formData.category,
        });
        alert("Medicine added successfully");
      }
      closeForm();
      fetchMedicines();
    } catch (error) {
      console.error("Error saving medicine:", error);
      alert("Failed to save medicine");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        alert("Medicine deleted");
        fetchMedicines();
      } catch (error) {
        console.error("Error deleting medicine:", error);
        alert("Failed to delete medicine");
      }
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#E8F5F5] p-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-[#006D6D] mb-6">Medicines</h2>

          <button
            onClick={openAddForm}
            className="mb-6 inline-flex items-center bg-[#006D6D] hover:bg-[#005959] text-white px-4 py-2 rounded shadow"
          >
            <FaPlus className="mr-2" /> Add Medicine
          </button>

          {loading ? (
            <p>Loading medicines...</p>
          ) : medicines.length === 0 ? (
            <p>No medicines found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {medicines.map((med) => {
                const discount = med.discount || 0;
                const discountedPrice = med.price - (med.price * discount) / 100;
                const rating = med.rating || 0;

                return (
                  <div
                    key={med._id}
                    className="bg-white rounded-lg shadow p-4 flex flex-col"
                  >
                    <Link to={`/medicines/${med._id}`} className="self-center">
                      <img
                        src={med.image || placeholderImg}
                        alt={med.name}
                        className="w-24 h-24 object-cover rounded mb-3"
                      />
                    </Link>

                    <Link to={`/medicines/${med._id}`}>
                      <h3 className="text-xl font-semibold text-[#006D6D] mb-1 hover:underline">
                        {med.name}
                      </h3>
                    </Link>

                    <p className="text-sm text-gray-500 mb-1">
                      Category: {med.category || "Uncategorized"}
                    </p>
                   <p className="text-gray-800 font-semibold mb-2">Stock: {med.stock ?? 0}</p>
                    {discount > 0 && (
                      <p className="text-sm text-green-600 mb-2">Discount: {discount}%</p>
                    )}

                    <p className="text-gray-700 mb-2 flex-grow">{med.description}</p>

                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-gray-700 font-semibold">
                        {rating.toFixed(1)}
                      </span>
                    </div>

                    <p className="font-bold text-[#F6B73C] mb-4">
                      {discount > 0 ? (
                        <>
                          <span className="line-through text-gray-500 mr-2">
                            ₹{med.price}
                          </span>
                          ₹{discountedPrice.toFixed(2)}
                        </>
                      ) : (
                        <>₹{med.price}</>
                      )}
                    </p>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => openEditForm(med)}
                        className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(med._id)}
                        className="flex items-center px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add/Edit Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50">
            <form
              onSubmit={handleFormSubmit}
              className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
            >
              <h3 className="text-2xl font-semibold mb-4 text-[#006D6D]">
                {formData.id ? "Edit Medicine" : "Add Medicine"}
              </h3>

              {/* Form inputs */}
              <label className="block mb-2 font-semibold text-gray-700">
                Name <span className="text-red-500">*</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                  required
                  placeholder="Medicine name"
                />
              </label>

              <label className="block mb-2 font-semibold text-gray-700">
                Description
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                  placeholder="Description about medicine"
                />
              </label>

              <label className="block mb-2 font-semibold text-gray-700">
                Price <span className="text-red-500">*</span>
                <input
                  type="number"
                  name="price"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                  required
                  placeholder="Price in ₹"
                />
              </label>

              <label className="block mb-4 font-semibold text-gray-700">
                Image URL
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                  placeholder="https://example.com/image.jpg"
                />
              </label>

              <label className="block mb-2 font-semibold text-gray-700">
                Discount (%)
                <input
                  type="number"
                  name="discount"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                  placeholder="Enter discount percentage"
                />
              </label>

              <label className="block mb-4 font-semibold text-gray-700">
                Category <span className="text-red-500">*</span>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Antibiotic">Antibiotic</option>
                  <option value="Painkiller">Painkiller</option>
                  <option value="Vitamin">Vitamin</option>
                  <option value="Ayurvedic">Ayurvedic</option>
                </select>
              </label>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#006D6D] text-white hover:bg-[#005959]"
                >
                  {formData.id ? "Save Changes" : "Add Medicine"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
