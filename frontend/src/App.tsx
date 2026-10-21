import { useEffect } from "react"; 
import { Navigate, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux"; 
import type { AppDispatch } from "./store/store"; 
import { getLoggedInUser } from "./store/loginSlice"; 
import RegisterPage from "./pages/register/registerPage";
import Login from "./pages/login/login";
import HomePage from "./pages/home/homePage"; 
import ProtectedRoute from "./components/protectedRoute/protectedRoute"; 

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

        {/* only logged-in users can open these */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/register" />} />
      </Routes>
    </>
  );
}
