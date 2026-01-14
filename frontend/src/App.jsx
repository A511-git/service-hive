import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import GigsDashboard from "./pages/GigsDashboard";
import BidsPage from "./pages/BidsPage";


export default function App() {
  return (
    <BrowserRouter>
      <AppNavbar />

      <Routes>
        <Route path="/" element={<Navigate to="/gigs" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/gigs" element={<GigsDashboard />} />
        <Route path="/bids" element={<BidsPage />} />

        <Route path="*" element={<Navigate to="/gigs" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
