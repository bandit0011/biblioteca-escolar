// Obtener todos los libros
import { Libro, Categoria } from "../models/asociaciones.js";
import { Op } from "sequelize"; // <--- 1. IMPORTAR Op

// Obtener todos los libros
export const obtenerLibros = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const offset = (page - 1) * limit;
    
    // 2. Extraer parámetros de búsqueda y categoría
    const { search, category } = req.query; 

    // 3. Construir el objeto "where" dinámicamente
    const whereCondition = {};

    if (search) {
      whereCondition[Op.or] = [
        { titulo: { [Op.like]: `%${search}%` } },
        { autor: { [Op.like]: `%${search}%` } }
      ];
    }

    if (category) {
      whereCondition.categoria_id = category;
    }

    // 4. Pasar el "whereCondition" a la consulta
    const { count, rows } = await Libro.findAndCountAll({
      where: whereCondition, // <--- APLICAR FILTRO AQUÍ
      include: {
        model: Categoria,
        as: "Categoria",
        attributes: ["id_categoria", "nombre"],
      },
      limit: limit,
      offset: offset,
      order: [['titulo', 'ASC']] // Opcional: ordenar alfabéticamente
    });

    res.json({
      totalLibros: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      libros: rows
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
