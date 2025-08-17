import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AdminDashboard() {
  const cards = [
    { title: "Manage Products", desc: "Add, edit, or remove medicines.", path: "/addmedicine" },
    { title: "Manage Orders", desc: "View and process customer orders.", path: "/adminorders" },
    { title: "Manage Users", desc: "View registered users and details.", path: "/users" },
    { title: "Inventory", desc: "Track stock levels in real-time.", path: "/inventory" },
    { title: "Reports", desc: "View sales and performance analytics.", path: "/reports" }
  ];

  return (
    <>
      <Navbar />
      <main className="p-6 bg-[#E8F5F5] min-h-screen">
        <h2 className="text-2xl font-bold text-[#006D6D] mb-4">Admin Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link
              to={card.path}
              key={card.title}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition block"
            >
              <h3 className="font-semibold text-lg text-[#006D6D]">{card.title}</h3>
              <p className="text-gray-600">{card.desc}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
