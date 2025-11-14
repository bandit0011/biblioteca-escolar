import { Prestamo } from "../models/Prestamo.js";
import { Libro } from "../models/Libro.js";

export const listarPrestamos = async (req, res) => {
  try {
    const prestamos = await Prestamo.findAll({ include: Libro });
    res.json(prestamos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener préstamos", error });
  }
};

export const obtenerMisPrestamos = async (req, res) => {
  try {
    // req.usuario.id viene del token (verificarToken)
    const prestamos = await Prestamo.findAll({ 
      where: { id_usuario: req.usuario.id },
      include: Libro 
    });
    res.json(prestamos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener mis préstamos", error });
  }
};

export const crearPrestamo = async (req, res) => {
  try {
    // ---- ESTAS SON LAS LÍNEAS CORREGIDAS ----
    
    // 1. Obtenemos el ID del usuario desde el token (inyectado por verificarToken)
    const id_usuario = req.usuario.id;
    
    // 2. Obtenemos el resto de la información del body
    const { id_libro, fecha_devolucion } = req.body;
    
    // ---- FIN DE LA CORRECCIÓN ----

    const libro = await Libro.findByPk(id_libro);
    if (!libro || libro.cantidad_disponible <= 0)
      return res.status(400).json({ mensaje: "Libro no disponible" });

    const nuevo = await Prestamo.create({
      id_usuario: id_usuario, // <-- Ahora usamos el ID del token
      id_libro: id_libro,
      fecha_devolucion: fecha_devolucion || null, // Asignamos null si no viene
      estado: "pendiente",
    });

    await libro.update({ cantidad_disponible: libro.cantidad_disponible - 1 });

    res.status(201).json({ mensaje: "Préstamo registrado", prestamo: nuevo });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear préstamo", error });
  }
};

export const devolverLibro = async (req, res) => {
  try {
    const prestamo = await Prestamo.findByPk(req.params.id, { include: Libro });
    if (!prestamo) return res.status(404).json({ mensaje: "Préstamo no encontrado" });

    await prestamo.update({ estado: "devuelto" });

    const libro = prestamo.Libro;
    await libro.update({ cantidad_disponible: libro.cantidad_disponible + 1 });

    res.json({ mensaje: "Libro devuelto correctamente", prestamo });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al devolver libro", error });
  }
};
