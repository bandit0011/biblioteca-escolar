import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LibroListPage from "./pages/LibroListPage";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./pages/AdminDashboard";
import EditarLibroPage from "./pages/EditarLibroPage";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/libros" element={<LibroListPage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/libros/editar/:id"
          element={
            <PrivateRoute>
              <EditarLibroPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}