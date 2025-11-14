import { Libro } from "./Libro.js";
import { Categoria } from "./Categoria.js";

// Relación uno-a-muchos
// AÑADIDO: Alias explícito 'Categoria' para asegurar un nombre de propiedad consistente.
Categoria.hasMany(Libro, { foreignKey: "categoria_id", as: "Libros" });
Libro.belongsTo(Categoria, { foreignKey: "categoria_id", as: "Categoria" }); 

export { Libro, Categoria };