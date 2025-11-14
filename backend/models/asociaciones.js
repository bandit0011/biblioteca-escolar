import { Libro } from "./Libro.js";
import { Categoria } from "./Categoria.js";
import { Usuario } from "./Usuario.js";   // <-- 1. IMPORTAR
import { Prestamo } from "./Prestamo.js"; // <-- 2. IMPORTAR

// Relación Libro <-> Categoria
Categoria.hasMany(Libro, { foreignKey: "categoria_id", as: "Libros" });
Libro.belongsTo(Categoria, { foreignKey: "categoria_id", as: "Categoria" }); 

// --- 3. AÑADIR ESTAS ASOCIACIONES ---
        
// Relación Prestamo -> Usuario (Un préstamo pertenece a un usuario)
Prestamo.belongsTo(Usuario, { foreignKey: "id_usuario" });
// Relación Usuario -> Prestamo (Un usuario puede tener muchos préstamos)
Usuario.hasMany(Prestamo, { foreignKey: "id_usuario" });

// Relación Prestamo -> Libro (Un préstamo pertenece a un libro)
Prestamo.belongsTo(Libro, { foreignKey: "id_libro" });
// Relación Libro -> Prestamo (Un libro puede estar en muchos préstamos)
Libro.hasMany(Prestamo, { foreignKey: "id_libro" });

// --- FIN DEL BLOQUE AÑADIDO ---

// 4. Exportar todos los modelos
export { Libro, Categoria, Usuario, Prestamo };