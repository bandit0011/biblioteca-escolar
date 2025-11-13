-- ===============================================
--  Sistema de Biblioteca Escolar
--  Versión inicial - Base de datos MySQL
-- ===============================================

CREATE DATABASE IF NOT EXISTS biblioteca_escolar;
USE biblioteca_escolar;

-- ===============================================
-- 1. Tabla de Usuarios
-- ===============================================
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'bibliotecario', 'estudiante') DEFAULT 'estudiante',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================================
-- 2. Tabla de Categorías
-- ===============================================
CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- ===============================================
-- 3. Tabla de Libros
-- ===============================================
CREATE TABLE libros (
    id_libro INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    anio_publicacion YEAR,
    categoria_id INT,
    cantidad_total INT DEFAULT 1,
    cantidad_disponible INT DEFAULT 1,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id_categoria)
);

-- ===============================================
-- 4. Tabla de Préstamos
-- ===============================================
CREATE TABLE prestamos (
    id_prestamo INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_libro INT,
    fecha_prestamo DATE DEFAULT (CURRENT_DATE),
    fecha_devolucion DATE,
    estado ENUM('pendiente', 'devuelto', 'retrasado') DEFAULT 'pendiente',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_libro) REFERENCES libros(id_libro)
);

-- ===============================================
-- 5. Datos iniciales (Seed básico)
-- ===============================================
INSERT INTO categorias (nombre) VALUES
('Ciencia Ficción'), ('Historia'), ('Matemáticas'), ('Literatura'), ('Tecnología');

INSERT INTO usuarios (nombre, email, contrasena, rol) VALUES
('Admin Principal', 'admin@biblioteca.com', 'admin123', 'admin'),
('Bibliotecario Juan', 'juan@biblioteca.com', 'juan123', 'bibliotecario'),
('Estudiante María', 'maria@correo.com', 'maria123', 'estudiante');

INSERT INTO libros (titulo, autor, anio_publicacion, categoria_id, cantidad_total, cantidad_disponible) VALUES
('Cien años de soledad', 'Gabriel García Márquez', 1967, 4, 5, 5),
('Historia del Ecuador', 'Juan León Mera', 1978, 2, 3, 3),
('Introducción a la Programación', 'B. Kernighan', 1990, 5, 4, 4),
('Matemática Básica', 'A. Rojas', 2015, 3, 2, 2);
