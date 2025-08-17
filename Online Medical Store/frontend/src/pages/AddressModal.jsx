import { useState, useEffect } from "react";
import axios from "axios";

export default function AddressModal({ onClose, onAddressSelected }) {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    label: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    country: ""
  });
  const [showNewForm, setShowNewForm] = useState(false);

  const fetchAddresses = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/auth/addresses", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAddresses(res.data || []);
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json();
        setNewAddress({
          ...newAddress,
          addressLine: data.display_name || "",
          latitude,
          longitude
        });
      });
    }
  };

  const saveAddress = async () => {
    const token = localStorage.getItem("token");
    await axios.post("http://localhost:5000/api/auth/address", newAddress, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setShowNewForm(false);
    fetchAddresses();
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-lg font-bold mb-4">Select Delivery Address</h2>

        {addresses.length > 0 && (
          <div className="mb-4">
            {addresses.map((addr) => (
              <div key={addr._id} className="border p-2 mb-2 rounded">
                <p>{addr.label}</p>
                <p className="text-sm text-gray-600">{addr.addressLine}</p>
                <button
                  className="mt-2 px-4 py-1 bg-[#006D6D] text-white rounded"
                  onClick={() => {
                    onAddressSelected(addr);
                    onClose();
                  }}
                >
                  Deliver Here
                </button>
              </div>
            ))}
          </div>
        )}

        {showNewForm ? (
          <div>
            <input
              type="text"
              placeholder="Label (Home/Office)"
              className="border w-full mb-2 p-2"
              value={newAddress.label}
              onChange={(e) =>
                setNewAddress({ ...newAddress, label: e.target.value })
              }
            />
            <textarea
              placeholder="Address Line"
              className="border w-full mb-2 p-2"
              value={newAddress.addressLine}
              onChange={(e) =>
                setNewAddress({ ...newAddress, addressLine: e.target.value })
              }
            />
            <div className="flex justify-between mb-2">
              <input
                type="text"
                placeholder="City"
                className="border w-1/2 p-2 mr-1"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="State"
                className="border w-1/2 p-2 ml-1"
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, state: e.target.value })
                }
              />
            </div>
            <div className="flex justify-between mb-2">
              <input
                type="text"
                placeholder="Pincode"
                className="border w-1/2 p-2 mr-1"
                value={newAddress.pincode}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, pincode: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Country"
                className="border w-1/2 p-2 ml-1"
                value={newAddress.country}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, country: e.target.value })
                }
              />
            </div>
            <button
              type="button"
              className="mb-2 px-4 py-1 bg-blue-500 text-white rounded"
              onClick={useCurrentLocation}
            >
              Use My Current Location
            </button>
            <button
              type="button"
              className="px-4 py-1 bg-green-500 text-white rounded"
              onClick={saveAddress}
            >
              Save Address
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowNewForm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            + Add New Address
          </button>
        )}

        <button
          onClick={onClose}
          className="mt-4 px-4 py-1 bg-gray-400 text-white rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
