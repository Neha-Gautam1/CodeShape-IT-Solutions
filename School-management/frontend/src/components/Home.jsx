import { useNavigate } from 'react-router-dom';
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaInstagram
} from 'react-icons/fa';

const Home = () => {
   const navigate = useNavigate();

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <div className="relative">
        <img src="/banner.jpeg" alt="Hero" className="w-full h-[75vh] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/30 flex flex-col justify-center items-center text-white text-center px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg leading-tight">
            Empowering Education for the Future
          </h1>
          <p className="text-lg md:text-2xl max-w-3xl drop-shadow-md font-light">
            A centralized platform for teachers, students, parents, and administrators to connect and grow.
          </p>
        </div>
      </div>

      {/* Info Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6 py-16">
        {/* Admin Card */}
        <div
          onClick={() => navigate('/register')}
          className="cursor-pointer bg-white shadow-lg hover:shadow-xl transition rounded-xl p-6 text-center hover:bg-blue-50 border-t-4 border-blue-600"
        >
          <h2 className="text-2xl font-semibold mb-2 text-blue-700">For Admins</h2>
          <p className="text-gray-600">Manage classes, teachers, students, and generate insightful reports.</p>
        </div>

        {/* Teacher Card */}
        <div
          onClick={() => navigate('/login')}
          className="cursor-pointer bg-white shadow-lg hover:shadow-xl transition rounded-xl p-6 text-center hover:bg-green-50 border-t-4 border-green-600"
        >
          <h2 className="text-2xl font-semibold mb-2 text-green-700">For Teachers</h2>
          <p className="text-gray-600">Track attendance, upload materials, and communicate with students.</p>
        </div>

        {/* Students & Parents Card */}
        <div
          onClick={() => navigate('/login')}
          className="cursor-pointer bg-white shadow-lg hover:shadow-xl transition rounded-xl p-6 text-center hover:bg-purple-50 border-t-4 border-purple-600"
        >
          <h2 className="text-2xl font-semibold mb-2 text-purple-700">For Students & Parents</h2>
          <p className="text-gray-600">View grades, timetable, and stay updated with school announcements.</p>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="relative">
        <img src="/social-banner.jpeg" alt="Social Background" className="w-full h-[60vh] object-cover" />
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-white text-center">
          <h2 className="text-3xl font-bold mb-4 drop-shadow-md">Follow Us on Social Media</h2>
          <div className="flex space-x-6 text-2xl">
            <a href="#" className="hover:text-blue-400 transition duration-200"><FaFacebookF /></a>
            <a href="#" className="hover:text-sky-400 transition duration-200"><FaTwitter /></a>
            <a href="#" className="hover:text-red-500 transition duration-200"><FaYoutube /></a>
            <a href="#" className="hover:text-pink-400 transition duration-200"><FaInstagram /></a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6 mt-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-sm">
          <div>
            <h3 className="text-xl font-bold mb-3 text-blue-400">Smart School</h3>
            <p className="text-gray-300">
              A centralized platform for school administration and academic collaboration, empowering every stakeholder.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-blue-400">Contact Us</h4>
            <p className="text-gray-300">Email: support@smartschool.com</p>
            <p className="text-gray-300">Phone: +91 98765 43210</p>
            <p className="text-gray-300">Location: Gujarat, India</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-blue-400">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="hover:underline text-gray-300">Home</a></li>
              <li><a href="/login" className="hover:underline text-gray-300">Login</a></li>
              <li><a href="/register/admin" className="hover:underline text-gray-300">Register</a></li>
              <li><a href="#" className="hover:underline text-gray-300">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <p className="text-center mt-8 text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} Smart School. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
