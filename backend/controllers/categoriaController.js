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
