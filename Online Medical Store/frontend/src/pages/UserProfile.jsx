import React, { useState, useEffect } from "react";
import { FaUserCircle, FaCamera } from "react-icons/fa";
import axios from "axios";

const UserProfile = () => {
  const [userData, setUserData] = useState({
    name: "",
    photo: "",
    email: "",
    mobile: "",
    address: "",
    role: ""
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res.data.user;
        const photoUrl = user.photo
          ? user.photo.startsWith("http")
            ? user.photo
            : `http://localhost:5000${user.photo}`
          : "";
        setUserData({ ...user, photo: photoUrl });
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setUserData({ ...userData, photo: URL.createObjectURL(file) });
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not logged in!");
        return;
      }

      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      if (userData.role === "User") {
        formData.append("mobile", userData.mobile);
        formData.append("address", userData.address);
      }
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data.user;
      const photoUrl = updatedUser.photo
        ? updatedUser.photo.startsWith("http")
          ? updatedUser.photo
          : `http://localhost:5000${updatedUser.photo}`
        : "";

      setUserData({ ...updatedUser, photo: photoUrl });
      setPhotoFile(null);
      setIsEditing(false);

      window.dispatchEvent(new CustomEvent("profileUpdated", { detail: updatedUser }));

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update profile error:", error.response || error.message);
      alert(
        "Failed to update profile: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-[#006D6D] text-white">
      <div className="relative">
        {userData.photo ? (
          <img
            src={userData.photo}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white object-cover"
          />
        ) : (
          <FaUserCircle className="w-32 h-32 text-white" />
        )}
        {isEditing && (
          <>
            <label
              htmlFor="photo-upload"
              className="absolute bottom-0 right-0 bg-white text-[#006D6D] p-2 rounded-full cursor-pointer shadow hover:bg-gray-100"
            >
              <FaCamera size={16} />
            </label>
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </>
        )}
      </div>

      <button
        onClick={toggleEdit}
        className="mt-4 px-6 py-2 bg-white text-[#006D6D] font-semibold rounded-lg hover:bg-gray-200"
      >
        {isEditing ? "Cancel" : "Edit Profile"}
      </button>

      <div className="mt-6 w-full max-w-md bg-white text-[#006D6D] rounded-lg p-6 shadow-lg">
        <label className="block mb-2 font-semibold">Name:</label>
        <input
          type="text"
          name="name"
          value={userData.name}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <label className="block mb-2 font-semibold">Email:</label>
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        {userData.role === "User" && (
          <>
            <label className="block mb-2 font-semibold">Mobile:</label>
            <input
              type="text"
              name="mobile"
              value={userData.mobile}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2 font-semibold">Address:</label>
            <textarea
              name="address"
              value={userData.address}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </>
        )}

        {isEditing && (
          <button
            onClick={handleSave}
            className="w-full px-4 py-2 bg-[#006D6D] text-white rounded hover:bg-[#005555]"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
