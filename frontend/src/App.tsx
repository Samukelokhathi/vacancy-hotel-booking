import { useEffect } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store/store";
import { getLoggedInUser } from "./store/loginSlice";
import RegisterPage from "./pages/register/registerPage";
import Login from "./pages/login/login";
import HomePage from "./pages/home/homePage";
import HotelDetailsPage from "./pages/hotelDetails/hotelDetailsPage";
import Layout from "./components/layout/layout";
import ProtectedRoute from "./components/protectedRoute/protectedRoute";
import MyBookingsPage from "./pages/myBookings/myBookingsPage";
import PaymentVerifyPage from "./pages/paymentVerify/paymentVerifyPage";
import AdminDashboard from "./pages/admin/adminDashboard";
import ProfilePage from "./pages/profile/profilePage";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getLoggedInUser());
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/hotels/:id" element={<HotelDetailsPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/bookings" element={<MyBookingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/payment/verify" element={<PaymentVerifyPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}
