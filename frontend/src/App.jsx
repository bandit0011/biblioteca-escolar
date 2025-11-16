import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // <-- 1. IMPORTA EL FOOTER
import HomePage from "./pages/HomePage";
import LibroListPage from "./pages/LibroListPage";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute"; // El NUEVO
import AdminRoute from "./components/AdminRoute";
import PerfilPage from "./pages/PerfilPage"; // Página que crearemos
import AdminDashboard from "./pages/AdminDashboard";
import LibroFormPage from "./pages/LibroFormPage";
import './App.css'; // <-- Importa el CSS que acabamos de editar
import CategoriaPage from "./pages/CategoriaPage";
import RegistroPage from "./pages/RegistroPage";

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
            path="/perfil"
            element={
              <PrivateRoute> {/* <-- Usa el nuevo PrivateRoute */}
                <PerfilPage />
              </PrivateRoute>
            }
          />

          <Route path="/registro" element={<RegistroPage />} />

          <Route
            path="/admin"
            element={
              <AdminRoute> {/* <-- Usa el nuevo AdminRoute */}
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/libros/crear"
            element={
              <AdminRoute>
                <LibroFormPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/libros/editar/:id"
            element={
              <AdminRoute>
                <LibroFormPage />
              </AdminRoute>
            }
          />
          <Route
          path="/admin/categorias"
          element={
            <AdminRoute>
              <CategoriaPage />
            </AdminRoute>
          }
        />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}