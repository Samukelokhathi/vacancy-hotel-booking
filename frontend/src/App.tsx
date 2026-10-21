import { useEffect } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store/store";
import { getLoggedInUser } from "./store/loginSlice";
import RegisterPage from "./pages/register/registerPage";
import Login from "./pages/login/login";
import HomePage from "./pages/home/homePage";
import HotelDetailsPage from "./pages/hotelDetails/hotelDetailsPage";
// import ProtectedRoute from "./components/protectedRoute/protectedRoute";
import Layout from "./components/layout/layout";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getLoggedInUser());
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />

        {/* CHANGED: public pages share the Navbar. Hotels need no login */}
        <Route element={<Layout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/hotels/:id" element={<HotelDetailsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}
