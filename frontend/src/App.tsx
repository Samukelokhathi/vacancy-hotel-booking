import { useEffect } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store/store";
import { getLoggedInUser } from "./store/loginSlice";
// ADDED: load heart state after login / page refresh
import { fetchFavoriteIds } from "./store/favoriteSlice";
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
  // ADDED: know when the user is logged in so we can load favourite ids
  const isAuthenticated = useSelector(
    (state: RootState) => state.login.isAuthenticated,
  );

  useEffect(() => {
    dispatch(getLoggedInUser());
  }, [dispatch]);

  // ADDED: after auth is restored (or login), fill favoriteHotelIds for heart icons
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavoriteIds());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* every page shares the light header + footer */}
      <Route element={<Layout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/hotels/:id" element={<HotelDetailsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/payment/verify" element={<PaymentVerifyPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/bookings" element={<MyBookingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
