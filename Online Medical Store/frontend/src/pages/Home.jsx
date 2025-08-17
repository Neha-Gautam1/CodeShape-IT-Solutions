import Navbar from "../components/Navbar";
import { useRef } from "react";
import Footer from "../components/Footer";
import { FaShoppingCart, FaEye, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Home() {
   const scrollRef = useRef(null);
      
        const scroll = (direction) => {
          if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
          }
        };
        const categories = [
    { title: "Medicines", img: "medicines.jpeg" },
    { title: "Wellness", img: "wellness.jpeg" },
    { title: "Personal Care", img: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80" },
    { title: "Medical Equipment", img: "equipment.jpeg" },
    { title: "Skin Care", img: "skincare.jpeg" },
    { title: "Beauty Care", img: "beautycare.jpeg" },
    { title: "Hair Care", img: "haircare.jpeg" },
    { title: "Oral Care", img: "oralcare.jpeg" },
    { title: "Health Care", img: "healthcare.jpeg" },
     { title: "Baby Care", img: "babycare.jpeg" }
  ];
  const featuredProducts = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      description: "Reduces fever and relieves mild to moderate pain.",
      price: 50,
      discount: 10,
      image: "medicines.jpeg",
      rating: 4
    },
    {
      id: 2,
      name: "Vitamin C Tablets",
      description: "Boosts immunity and promotes skin health.",
      price: 120,
      discount: 20,
      image: "wellness.jpeg",
      rating: 5
    },
    {
      id: 3,
      name: "Digital Thermometer",
      description: "Accurate and fast temperature readings.",
      price: 250,
      discount: 15,
      image: "equipment.jpeg",
      rating: 4
    },
    {
      id: 4,
      name: "Hand Sanitizer 500ml",
      description: "Kills 99.9% of germs without water.",
      price: 150,
      discount: 10,
      image: "wellness.jpeg",
      rating: 5
    },
    {
      id: 5,
      name: "Blood Pressure Monitor",
      description: "Automatic BP checking device.",
      price: 1800,
      discount: 20,
      image: "equipment.jpeg",
      rating: 4
    },
    {
      id: 6,
      name: "Face Mask Pack (50 pcs)",
      description: "3-ply protective face masks.",
      price: 300,
      discount: 25,
      image: "medicines.jpeg",
      rating: 4
    }
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#E8F5F5] to-[#ffffff] flex flex-col md:flex-row items-center px-10 py-20">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-[#006D6D] leading-snug">
            From <span className="text-[#F6B73C]">Pharmacy</span> to Your Doorstep
          </h1>
          <p className="mt-4 text-gray-600">
            Browse and order medicines online with fast delivery right to your home.
          </p>
        

<Link to="/login" className="mt-6 bg-[#006D6D] text-white px-6 py-3 rounded-lg hover:bg-[#005959] inline-block text-center">
  Shop Now
</Link>

        </div>
        <div className="flex-1 flex justify-center mt-10 md:mt-0">
          <img
            src="medical-store.jpeg"
            alt="Medical Store"
            className="rounded-lg shadow-lg max-w-sm"
          />
        </div>
      </section>

     {/* Categories Carousel */}
      <section className="px-10 py-16 bg-white relative">
        <h2 className="text-2xl font-bold text-[#006D6D] mb-8">Shop by Category</h2>

        {/* Left Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-[#006D6D] text-white p-2 rounded-full shadow-lg hover:bg-[#005959] z-10"
        >
          ◀
        </button>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar"
        >
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="bg-[#E8F5F5] rounded-lg shadow-md min-w-[200px] overflow-hidden hover:shadow-lg transition cursor-pointer flex-shrink-0"
            >
              <img src={cat.img} alt={cat.title} className="h-40 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-[#006D6D]">{cat.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Right Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#006D6D] text-white p-2 rounded-full shadow-lg hover:bg-[#005959] z-10"
        >
          ▶
        </button>
      </section>


      {/* Filters + Featured Products */}
      <section className="px-6 py-12 bg-[#E8F5F5]">
        <h2 className="text-2xl font-bold text-[#006D6D] mb-6">Featured Products</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {["Home", "Shop", "Categories", "Products", "Top Deals", "Health Care", "Beauty Care"].map(
            (filter) => (
              <button
                key={filter}
                className="px-4 py-2 bg-white text-[#006D6D] border border-[#006D6D] rounded-full hover:bg-[#006D6D] hover:text-white transition"
              >
                {filter}
              </button>
            )
          )}
        </div>

        {/* Products Grid */}
   

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {featuredProducts.map((product) => {
    const discountedPrice = product.price - (product.price * product.discount) / 100;
    return (
      <Link
        to="/login"
        key={product.id}
        className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
      >
        {/* Image */}
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            {product.discount}% OFF
          </span>
        </div>

        {/* Details */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-lg font-semibold text-[#006D6D]">{product.name}</h3>
          <p className="text-gray-600 text-sm">{product.description}</p>

          {/* Rating */}
          <div className="flex items-center mt-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`h-4 w-4 ${
                  i < product.rating ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Price */}
          <div className="mt-3">
            <span className="text-lg font-bold text-[#F6B73C]">₹{discountedPrice}</span>
            <span className="text-sm text-gray-500 line-through ml-2">
              ₹{product.price}
            </span>
          </div>

          {/* Buttons */}
          <div className="mt-auto flex space-x-2 pt-4">
            <button className="flex items-center justify-center bg-[#006D6D] text-white px-3 py-2 rounded hover:bg-[#005959] flex-1 pointer-events-none">
              <FaShoppingCart className="mr-1" /> Add to Cart
            </button>
            <button className="flex items-center justify-center bg-yellow-100 text-yellow-600 px-3 py-2 rounded hover:bg-yellow-200 flex-1 pointer-events-none">
              <FaEye className="mr-1" /> View
            </button>
          </div>
        </div>
      </Link>
    );
  })}
</div>


        {/* Shop Now Section */}
     <div className="bg-white rounded-lg shadow-md mt-10 p-6 text-center">
  <h3 className="text-xl font-bold text-[#006D6D] mb-4">Shop Now for the Best Medical Products</h3>
  <p className="text-gray-600 mb-4">
    Browse our wide range of healthcare essentials and wellness products. Enjoy exclusive discounts and fast delivery.
  </p>
  <Link
    to="/login"
    className="bg-[#006D6D] text-white px-6 py-3 rounded-lg hover:bg-[#005959] inline-block"
  >
    Start Shopping
  </Link>
</div>
      </section>

      <Footer />
    </>
  );
}
