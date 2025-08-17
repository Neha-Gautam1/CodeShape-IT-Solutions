export default function Footer() {
  return (
    <footer className="bg-[#006D6D] text-white mt-10">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand Section */}
        <div>
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="PharmaCare Logo" className="h-10" />
            <span className="text-xl font-bold">PharmaCare</span>
          </div>
          <p className="mt-4 text-sm">
            Your trusted partner in health & wellness. From pharmacy to your doorstep.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:underline">Home</a>
            </li>
            <li>
              <a href="/login" className="hover:underline">Login</a>
            </li>
            <li>
              <a href="/signup" className="hover:underline">Signup</a>
            </li>
            <li>
              <a href="/user/dashboard" className="hover:underline">User Dashboard</a>
            </li>
            <li>
              <a href="/admin/dashboard" className="hover:underline">Admin Dashboard</a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <p className="text-sm">📍 123 Health Street, Wellness City</p>
          <p className="text-sm">📞 +91 98765 43210</p>
          <p className="text-sm">✉️ support@pharmacare.com</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#005959] text-center py-3 text-sm">
        © {new Date().getFullYear()} PharmaCare. All rights reserved.
      </div>
    </footer>
  );
}
