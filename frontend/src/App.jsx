import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LibroListPage from "./pages/LibroListPage";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./pages/AdminDashboard";
import LibroFormPage from "./pages/LibroFormPage";
import './App.css'; // <-- Importa el CSS que acabamos de editar
import CategoriaPage from "./pages/CategoriaPage";

export default function App() {
  return (
    <BrowserRouter>
      {/* 1. La Navbar ahora está fuera del contenedor */}
      <Navbar />

      {/* 2. El contenido de las páginas va DENTRO del .container */}
      <div className="container">
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
            path="/admin/libros/crear"
            element={
              <PrivateRoute>
                <LibroFormPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/libros/editar/:id"
            element={
              <PrivateRoute>
                <LibroFormPage />
              </PrivateRoute>
            }
          />
          <Route
          path="/admin/categorias"
          element={
            <PrivateRoute>
              <CategoriaPage />
            </PrivateRoute>
          }
        />
        </Routes>
      </div>
    </BrowserRouter>
  );
}