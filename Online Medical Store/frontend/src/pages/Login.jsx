import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
  const [role, setRole] = useState("User");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

const handleLogin = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();

    if (res.ok) {
      // Store token & role correctly
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      // Redirect based on role
      if (data.user.role === "Admin") {
        navigate("/admin/dashboard");
      } else if (data.user.role === "User") {
        navigate("/user/dashboard");
      }
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
          <h2 className="text-2xl font-bold text-center text-[#006D6D]">Login</h2>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded mt-4 bg-white text-black"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>

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
            onClick={handleLogin}
            className="w-full bg-[#006D6D] text-white p-2 rounded mt-4 hover:bg-[#005959]"
          >
            Login
          </button>

          {message && (
            <p className="text-sm text-center mt-3 text-red-500">{message}</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
