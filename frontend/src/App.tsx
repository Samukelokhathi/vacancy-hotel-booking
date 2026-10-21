import { useEffect } from "react"; // NEW
import { Navigate, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux"; // NEW
import type { AppDispatch } from "./store/store"; // NEW
import { getLoggedInUser } from "./store/loginSlice"; // NEW
import RegisterPage from "./pages/register/registerPage";
import Login from "./pages/login/login";
import HomePage from "./pages/home/homePage"; // NEW
import ProtectedRoute from "./components/protectedRoute/protectedRoute"; // NEW

export default function App() {
  const dispatch = useDispatch<AppDispatch>();

  // NEW: on every page load, restore the user from the saved token
  useEffect(() => {
    dispatch(getLoggedInUser());
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />

        {/* NEW: only logged-in users can open these */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/register" />} />
      </Routes>
    </>
  );
}
