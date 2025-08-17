import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaStar, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function MedicineDetails() {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [addingReview, setAddingReview] = useState(false);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/medicines/${id}`);
        setMedicine(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicine();
  }, [id]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddReview = async () => {
    try {
      setAddingReview(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/medicines/${id}/reviews`,
        review,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = await axios.get(`http://localhost:5000/api/medicines/${id}`);
      setMedicine(res.data);
      setReview({ rating: 5, comment: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to add review");
    } finally {
      setAddingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/medicines/${id}/reviews/${reviewId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = await axios.get(`http://localhost:5000/api/medicines/${id}`);
      setMedicine(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to delete review");
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <main className="p-6 bg-[#E8F5F5] min-h-screen flex justify-center items-center">
        <p className="text-[#006D6D] text-xl font-semibold">Loading medicine...</p>
      </main>
      <Footer />
    </>
  );
  if (!medicine) return (
    <>
      <Navbar />
      <main className="p-6 bg-[#E8F5F5] min-h-screen flex justify-center items-center">
        <p className="text-[#006D6D] text-xl font-semibold">Medicine not found</p>
      </main>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6 bg-[#E8F5F5] min-h-screen">
        <h1 className="text-4xl font-bold mb-6 text-[#006D6D]">{medicine.name}</h1>

        <img
          src={medicine.image || "https://via.placeholder.com/600x400?text=No+Image"}
          alt={medicine.name}
          className="w-full max-h-96 object-cover rounded-lg mb-6 shadow-md"
        />

        <p className="text-gray-700 mb-4">{medicine.description}</p>
        <p className="text-[#006D6D] font-semibold mb-2">Category: {medicine.category}</p>
        <p className="text-[#F6B73C] text-2xl font-bold mb-8">₹{medicine.price.toFixed(2)}</p>

        <section>
          <h2 className="text-3xl font-semibold mb-4 text-[#006D6D]">Reviews</h2>

          {medicine.reviews.length === 0 && (
            <p className="text-gray-600 mb-6">No reviews yet.</p>
          )}

          <ul className="space-y-4 mb-8">
  {medicine.reviews.map((rev) => (
    <li
      key={rev._id}
      className="bg-white rounded shadow p-4 border border-gray-200"
    >
      <p className="text-gray-900"><strong>User:</strong> {rev.user?.name || "Anonymous"}</p>
      <p className="flex items-center text-gray-900">
        <strong>Rating:</strong>
        <span className="ml-2 flex">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`h-4 w-4 ${
                i < rev.rating ? "text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </span>
      </p>
      <p className="mt-1 text-gray-900"><strong>Comment:</strong> {rev.comment}</p>
      <button
        onClick={() => handleDeleteReview(rev._id)}
        className="mt-2 text-red-600 hover:underline flex items-center space-x-1 text-sm"
      >
        <FaTrash /> <span>Delete Review</span>
      </button>
    </li>
  ))}
</ul>

        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-3 text-[#006D6D]">Add a Review</h3>
          <label className="block mb-3 text-[#006D6D]">
            Rating:
            <select
              name="rating"
              value={review.rating}
              onChange={handleReviewChange}
              className="ml-3 rounded border border-gray-300 px-2 py-1 focus:outline-none focus:border-[#006D6D]"
            >
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <label className="block mb-4">
            Comment:
            <textarea
              name="comment"
              value={review.comment}
              onChange={handleReviewChange}
              className="w-full border border-gray-300 rounded p-2 mt-1 focus:outline-none focus:border-[#006D6D]"
              rows={4}
            />
          </label>

          <button
            onClick={handleAddReview}
            disabled={addingReview}
            className="px-6 py-2 bg-[#006D6D] text-white rounded hover:bg-[#005959]"
          >
            {addingReview ? "Submitting..." : "Submit Review"}
          </button>
        </section>
      </main>
      <Footer />
    </>
  );
}
