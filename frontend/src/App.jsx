import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LibroListPage from "./pages/LibroList";
import LibroFormPage from "./pages/LibroForm";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/" />} />
        <Route path="/login" element={<Login />} />

        {/* Panel de administración protegido */}
        <Route path="/admin/libros" element={
          <PrivateRoute>
            <LibroListPage admin={true} />
          </PrivateRoute>
        } />
        <Route path="/admin/libros/nuevo" element={
          <PrivateRoute>
            <LibroFormPage />
          </PrivateRoute>
        } />
        <Route path="/admin/libros/editar/:id" element={
          <PrivateRoute>
            <LibroFormPage />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
