import { Libro, Categoria } from "../models/asociaciones.js";

// Obtener todos los libros
export const obtenerLibros = async (req, res) => {
  try {
    const libros = await Libro.findAll({
      include: {
        model: Categoria,
        attributes: ["id_categoria", "nombre"],
      },
    });
    res.json(libros);
  } catch (error) {
    console.error("Error al obtener libros:", error);
    res.status(500).json({ error: "Error al obtener libros" });
  }
};

// Crear nuevo libro
export const crearLibro = async (req, res) => {
  try {
    const nuevoLibro = await Libro.create(req.body);
    res.status(201).json(nuevoLibro);
  } catch (error) {
    console.error("Error al crear libro:", error);
    res.status(500).json({ error: "Error al crear libro" });
  }
};

// Obtener libro por ID
export const obtenerLibroPorId = async (req, res) => {
  try {
    const libro = await Libro.findByPk(req.params.id, {
      include: { model: Categoria },
    });
    if (!libro) return res.status(404).json({ error: "Libro no encontrado" });
    res.json(libro);
  } catch (error) {
    console.error("Error al obtener libro:", error);
    res.status(500).json({ error: "Error al obtener libro" });
  }
};

// Actualizar libro
export const actualizarLibro = async (req, res) => {
  try {
    const libro = await Libro.findByPk(req.params.id);
    if (!libro) return res.status(404).json({ error: "Libro no encontrado" });

    await libro.update(req.body);
    res.json({ mensaje: "Libro actualizado correctamente", libro });
  } catch (error) {
    console.error("Error al actualizar libro:", error);
    res.status(500).json({ error: "Error al actualizar libro" });
  }
};

// Eliminar libro
export const eliminarLibro = async (req, res) => {
  try {
    const libro = await Libro.findByPk(req.params.id);
    if (!libro) return res.status(404).json({ error: "Libro no encontrado" });

    await libro.destroy();
    res.json({ mensaje: "Libro eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar libro:", error);
    res.status(500).json({ error: "Error al eliminar libro" });
  }
};
