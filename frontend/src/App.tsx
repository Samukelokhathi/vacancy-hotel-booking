import { Navigate, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/register/registerPage";
import Login from "./pages/login/login";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />

        <Route path="*" element={<Navigate to="/register" />} />
      </Routes>
    </>
  );
}
