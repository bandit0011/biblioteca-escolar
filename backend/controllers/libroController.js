import { Libro, Categoria } from "../models/asociaciones.js";

// Obtener todos los libros
export const obtenerLibros = async (req, res) => {
  try {
    // 1. Recibir página y límite por query param (ej: ?page=1&limit=10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9; // 9 libros por defecto
    const offset = (page - 1) * limit;

    // 2. Usar findAndCountAll
    const { count, rows } = await Libro.findAndCountAll({
      include: {
        model: Categoria,
        as: "Categoria",
        attributes: ["id_categoria", "nombre"],
      },
      limit: limit,
      offset: offset,
      // Opcional: order: [['titulo', 'ASC']]
    });

    // 3. Responder con estructura de paginación
    res.json({
      totalLibros: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      libros: rows // 'rows' contiene los libros de esta página
    });

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
      include: { model: Categoria, as: "Categoria" }, // AÑADIDO: Alias consistente
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
