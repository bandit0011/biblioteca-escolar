import { Prestamo, Libro, Usuario, Categoria } from "../models/asociaciones.js";

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
    console.log("======================================");
    console.log("✅ API: INICIANDO crearPrestamo");
    console.log("ID de usuario (del token):", req.usuario.id);
    console.log("Body de la petición (del frontend):", req.body);
    
    const id_usuario = req.usuario.id;
    const { id_libro, fecha_devolucion } = req.body;

    console.log("PASO 1: Buscando libro...");
    const libro = await Libro.findByPk(id_libro);
    console.log("PASO 2: Libro encontrado. Disponible:", libro.cantidad_disponible);

    if (!libro || libro.cantidad_disponible <= 0)
      return res.status(400).json({ mensaje: "Libro no disponible" });

    console.log("PASO 3: Creando préstamo...");
    const nuevo = await Prestamo.create({
      id_usuario: id_usuario,
      id_libro: id_libro,
      fecha_devolucion: fecha_devolucion || null, 
      estado: "pendiente",
    });
    console.log("PASO 4: Préstamo creado con ID:", nuevo.id_prestamo);

    console.log("PASO 5: Actualizando stock del libro...");
    await libro.update({ cantidad_disponible: libro.cantidad_disponible - 1 });
    console.log("PASO 6: Stock actualizado.");

    res.status(201).json({ mensaje: "Préstamo registrado", prestamo: nuevo });

  } catch (error) {
    // Si falla, esto nos dirá qué paso fue el último en completarse
    console.error("❌ ERROR AL CREAR PRÉSTAMO:", error); 
    res.status(500).json({ mensaje: "Error al crear préstamo", error: error.message });
  }
};

export const devolverLibro = async (req, res) => {
  try {
    console.log(`--- API: Iniciando devolución para préstamo ID: ${req.params.id} ---`);
    const prestamo = await Prestamo.findByPk(req.params.id, { include: Libro });
    
    if (!prestamo) {
      console.log("--- API: Préstamo no encontrado ---");
      return res.status(404).json({ mensaje: "Préstamo no encontrado" });
    }

    console.log(`--- API: Préstamo encontrado. Estado actual: ${prestamo.estado} ---`);

    if (prestamo.estado === "devuelto") {
      console.log("--- API: El libro ya estaba devuelto. Enviando error 400. ---");
      return res.status(400).json({ mensaje: "Este libro ya fue devuelto anteriormente." });
    }

    console.log("--- API: Actualizando estado a 'devuelto'... ---");
    await prestamo.update({ estado: "devuelto" });
    console.log("--- API: Estado actualizado en BD. ---");

    const libro = prestamo.Libro;
    if (libro) {
      console.log("--- API: Actualizando stock del libro... ---");
      await libro.update({ cantidad_disponible: libro.cantidad_disponible + 1 });
      console.log("--- API: Stock actualizado. ---");
    }

    // +++ ESTA ES LA LÍNEA DE DEPDEBUGGING MÁS IMPORTANTE +++
    console.log(`--- API: Estado del objeto 'prestamo' ANTES de reload: ${prestamo.estado} ---`);
    
    await prestamo.reload(); // ¡Asegúrate que esta línea esté aquí!

    console.log(`--- API: Estado del objeto 'prestamo' DESPUÉS de reload: ${prestamo.estado} ---`);
    console.log("--- API: Enviando respuesta exitosa al frontend. ---");

    res.json({ mensaje: "Libro devuelto correctamente", prestamo });

  } catch (error) {
    console.error("--- API: ❌ ERROR FATAL en devolverLibro ---", error);
    res.status(500).json({ mensaje: "Error al devolver libro", error: error.message });
  }
};