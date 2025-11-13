import { Libro } from "./Libro.js";
import { Categoria } from "./Categoria.js";

// Relación uno-a-muchos
Categoria.hasMany(Libro, { foreignKey: "categoria_id" });
Libro.belongsTo(Categoria, { foreignKey: "categoria_id" });

export { Libro, Categoria };
