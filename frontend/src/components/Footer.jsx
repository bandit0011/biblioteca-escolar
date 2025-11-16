import React from 'react';
import './Footer.css'; // Importamos su propio CSS

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} Biblioteca Escolar. Todos los derechos reservados.
      </p>
      <p>
        Proyecto desarrollado con React, Node.js y MySQL.
      </p>
    </footer>
  );
}