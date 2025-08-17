import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter out admins from the fetched users
        const filteredUsers = res.data.filter((user) => user.role !== "Admin");
        setUsers(filteredUsers);
      } catch (err) {
        setError("Failed to fetch users.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#E8F5F5] p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-[#006D6D] mb-6">Manage Users</h2>

        {loading && <p className="text-[#006D6D] font-semibold">Loading users...</p>}
        {error && <p className="text-red-600 font-semibold">{error}</p>}

        {!loading && !error && users.length === 0 && (
          <p className="text-gray-600">No users found.</p>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-lg shadow p-4 flex flex-col items-center"
              >
                <img
                  src={
                    user.photo
                      ? `http://localhost:5000${user.photo}`
                      : "https://via.placeholder.com/100?text=No+Photo"
                  }
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover mb-3"
                />
                <h3 className="text-lg font-semibold text-[#006D6D]">{user.name}</h3>
                <p className="text-gray-700">{user.email}</p>
                <p className="text-gray-600 italic">Role: {user.role}</p>
                {user.mobile && <p className="text-gray-600">Mobile: {user.mobile}</p>}
                {user.address && <p className="text-gray-600">Address: {user.address}</p>}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
