import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfile from "./pages/UserProfile"; // <-- Import the profile page
import MedicinesPage from "./pages/MedicinesPage";
import MyOrders from "./pages/MyOrders";
import MedicineDetails from "./pages/MedicineDetails";
import ManageUsers from "./pages/ManageUsers";
import InventoryPage from "./pages/InventoryPage";
import Reports from "./pages/Reports";
import AdminOrders from "./pages/AdminOrders";
import AddressModal from "./pages/AddressModal";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute role="User">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute role="User">
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute role="User">
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userprofile" // <-- New route for profile page
          element={
            <ProtectedRoute role="User">
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
  path="/adminprofile"
  element={
    <ProtectedRoute role="Admin">
      <UserProfile />
    </ProtectedRoute>
  }
/>

        <Route path="/myorders" 
        element={
          <ProtectedRoute role="User">
            <MyOrders/>
          </ProtectedRoute>
        }/>
        <Route
  path="/addmedicine"
  element={
    <ProtectedRoute role="Admin">
      <MedicinesPage />
    </ProtectedRoute> 
  }
/>
<Route path="/medicines/:id" element={
  <ProtectedRoute role="User">
  <MedicineDetails />
  </ProtectedRoute>
  } 
  />
  <Route path="/users" element={
    <ProtectedRoute role="Admin">
      <ManageUsers/>
    </ProtectedRoute>
  }
  />
  <Route path="/inventory" element={
    <ProtectedRoute role="Admin">
      <InventoryPage />
      </ProtectedRoute>}/>
<Route path="/reports" element={
  <ProtectedRoute role="Admin"> <Reports /></ProtectedRoute>}/>

   <Route
          path="/adminorders" // <-- New admin orders route
          element={
            <ProtectedRoute role="Admin">
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        <Route
        path="/addressmodal"
        element={
          <ProtectedRoute role="User">
          <AddressModal/>
          </ProtectedRoute>
        }

        />
   
      </Routes>
    </Router>
  );
}
