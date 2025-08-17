import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Signup() {
  const [role, setRole] = useState("User");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Signup successful! Please login.");
        alert("Signup successful! Please login."); // Optional alert for user feedback
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setMessage("❌ Server error, please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-[#E8F5F5]">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-[#006D6D]">
            Create Your Account
          </h2>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded mt-4 bg-white text-black"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded mt-4 bg-white text-black"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mt-4 bg-white text-black"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mt-4 bg-white text-black"
          />

          <button
            onClick={handleSignup}
            className="w-full bg-[#006D6D] text-white p-2 rounded mt-4 hover:bg-[#005959]"
          >
            Sign Up
          </button>

          {message && (
            <p className="text-sm text-center mt-3 text-red-500">{message}</p>
          )}

          <p className="text-sm text-gray-500 mt-4 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-[#006D6D] hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
