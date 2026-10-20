import { Navigate, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/registerPage";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/register" />} />
      </Routes>
    </>
  );
}
