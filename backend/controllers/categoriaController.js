import { Categoria } from "../models/Categoria.js";

export const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener categorías", error });
  }
};

export const crearCategoria = async (req, res) => {
  try {
    const nueva = await Categoria.create(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear categoría", error });
  }
};

export const actualizarCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    // Actualizar el nombre y guardar
    categoria.nombre = nombre;
    await categoria.save();

    res.json({ mensaje: "Categoría actualizada", categoria });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar categoría", error });
  }
};

export const eliminarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ mensaje: "Categoría no encontrada" });

    await categoria.destroy();
    res.json({ mensaje: "Categoría eliminada" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar categoría", error });
  }
};
