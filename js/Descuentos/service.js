const { sequelize } = require('../Models');
const jsonFallback = require('./json');

let useFallback = false;

// Verificar conexión a la base de datos
async function isConnected() {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error);
    return false;
  }
}

class DescuentosService {
    /**
     * Calcula el descuento por cantidad para un producto específico
     * @param {number} producto_id - ID del producto
     * @param {number} cantidad - Cantidad del producto
     * @returns {Promise<number>} - Porcentaje de descuento aplicable
     */
    static async calcularDescuentoPorCantidad(producto_id, cantidad) {
        if (useFallback) {
            return jsonFallback.calcularDescuentoPorCantidad(producto_id, cantidad);
        }
        
        try {
            const query = `
                SELECT porcentaje_descuento 
                FROM descuentos_cantidad 
                WHERE producto_id = :producto_id 
                AND cantidad_minima <= :cantidad 
                AND activo = 1
                ORDER BY cantidad_minima DESC 
                LIMIT 1
            `;
            
            const result = await sequelize.query(query, {
                replacements: { producto_id, cantidad },
                type: sequelize.QueryTypes.SELECT
            });
            
            if (result.length > 0) {
                return result[0].porcentaje_descuento;
            }
            
            return 0;
        } catch (error) {
            console.error('Error al calcular descuento:', error);
            // Fallback automático en caso de error
            return jsonFallback.calcularDescuentoPorCantidad(producto_id, cantidad);
        }
    }

    /**
     * Obtiene todos los descuentos de un producto
     * @param {number} producto_id - ID del producto
     * @returns {Promise<Array>} - Lista de descuentos
     */
    static async getDescuentosProducto(producto_id) {
        if (useFallback) {
            return jsonFallback.getDescuentosProducto(producto_id);
        }
        
        try {
            const query = `
                SELECT * FROM descuentos_cantidad 
                WHERE producto_id = :producto_id 
                ORDER BY cantidad_minima ASC
            `;
            
            const result = await sequelize.query(query, {
                replacements: { producto_id },
                type: sequelize.QueryTypes.SELECT
            });
            
            return result;
        } catch (error) {
            console.error('Error al obtener descuentos:', error);
            // Fallback automático en caso de error
            return jsonFallback.getDescuentosProducto(producto_id);
        }
    }

    /**
     * Obtiene todos los descuentos
     * @returns {Promise<Array>} - Lista de todos los descuentos
     */
    static async getAllDescuentos() {
        if (useFallback) {
            return jsonFallback.getAllDescuentos();
        }
        
        try {
            const query = `
                SELECT * FROM descuentos_cantidad 
                ORDER BY producto_id ASC, cantidad_minima ASC
            `;
            
            const result = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT
            });
            
            return result;
        } catch (error) {
            console.error('Error al obtener todos los descuentos:', error);
            // Fallback automático en caso de error
            return jsonFallback.getAllDescuentos();
        }
    }

    /**
     * Crea un nuevo descuento
     * @param {number} producto_id - ID del producto
     * @param {number} cantidad_minima - Cantidad mínima para el descuento
     * @param {number} porcentaje_descuento - Porcentaje de descuento
     * @param {boolean} activo - Estado del descuento
     * @returns {Promise<boolean>} - Éxito de la operación
     */
    static async crearDescuento(producto_id, cantidad_minima, porcentaje_descuento, activo = true) {
        if (useFallback) {
            return jsonFallback.crearDescuento(producto_id, cantidad_minima, porcentaje_descuento, activo);
        }
        
        try {
            const query = `
                INSERT INTO descuentos_cantidad (producto_id, cantidad_minima, porcentaje_descuento, activo)
                VALUES (:producto_id, :cantidad_minima, :porcentaje_descuento, :activo)
            `;
            
            await sequelize.query(query, {
                replacements: { 
                    producto_id, 
                    cantidad_minima, 
                    porcentaje_descuento, 
                    activo: activo ? 1 : 0 
                },
                type: sequelize.QueryTypes.INSERT
            });
            
            return true;
        } catch (error) {
            console.error('Error al crear descuento:', error);
            // Fallback automático en caso de error
            return jsonFallback.crearDescuento(producto_id, cantidad_minima, porcentaje_descuento, activo);
        }
    }

    /**
     * Elimina un descuento por ID
     * @param {number} id - ID del descuento
     * @returns {Promise<boolean>} - Éxito de la operación
     */
    static async eliminarDescuento(id) {
        if (useFallback) {
            return jsonFallback.eliminarDescuentoPermanente(id);
        }
        
        try {
            // Primero verificar si el descuento existe
            const existeQuery = `
                SELECT id FROM descuentos_cantidad 
                WHERE id = :id
            `;
            
            const existe = await sequelize.query(existeQuery, {
                replacements: { id },
                type: sequelize.QueryTypes.SELECT
            });
            
            if (existe.length === 0) {
                console.log(`Descuento con ID ${id} no encontrado`);
                return false;
            }
            
            const query = `
                DELETE FROM descuentos_cantidad 
                WHERE id = :id
            `;
            
            const result = await sequelize.query(query, {
                replacements: { id },
                type: sequelize.QueryTypes.DELETE
            });
            
            // Para DELETE queries, el resultado puede variar según la versión de Sequelize
            // Verificar diferentes posibles estructuras de respuesta
            let affectedRows = 0;
            
            if (Array.isArray(result)) {
                // Si result es un array, puede tener diferentes estructuras
                if (result.length >= 2 && typeof result[1] === 'number') {
                    affectedRows = result[1];
                } else if (result.length > 0) {
                    affectedRows = 1; // Asumimos que se eliminó si no hay error
                }
            } else if (result && typeof result === 'object') {
                // Si result es un objeto, buscar propiedades comunes
                affectedRows = result.affectedRows || result.rowCount || 1;
            } else {
                // Si llegamos aquí sin error, asumimos éxito
                affectedRows = 1;
            }
            
            console.log(`Descuento eliminado. Filas afectadas: ${affectedRows}`);
            return affectedRows > 0;
            
        } catch (error) {
            console.error('Error al eliminar descuento:', error);
            // Fallback automático en caso de error
            return jsonFallback.eliminarDescuentoPermanente(id);
        }
    }

    /**
     * Actualiza un descuento existente
     * @param {number} id - ID del descuento
     * @param {number} producto_id - ID del producto
     * @param {number} cantidad_minima - Cantidad mínima para el descuento
     * @param {number} porcentaje_descuento - Porcentaje de descuento
     * @param {boolean} activo - Estado del descuento
     * @returns {Promise<boolean>} - Éxito de la operación
     */
    static async actualizarDescuento(id, producto_id, cantidad_minima, porcentaje_descuento, activo = true) {
        if (useFallback) {
            return jsonFallback.actualizarDescuento(id, producto_id, cantidad_minima, porcentaje_descuento, activo);
        }
        
        try {
            // Primero obtener el descuento actual para verificar cambios
            const descuentoActual = await sequelize.query(
                'SELECT * FROM descuentos_cantidad WHERE id = :id',
                {
                    replacements: { id },
                    type: sequelize.QueryTypes.SELECT
                }
            );
            
            if (descuentoActual.length === 0) {
                return false; // Descuento no encontrado
            }
            
            const descuento = descuentoActual[0];
            
            // Verificar si realmente hay cambios
            const hayChangios = 
                descuento.producto_id !== Number(producto_id) ||
                descuento.cantidad_minima !== Number(cantidad_minima) ||
                descuento.porcentaje_descuento !== Number(porcentaje_descuento) ||
                Boolean(descuento.activo) !== Boolean(activo);
            
            // Si no hay cambios, considerar como exitoso
            if (!hayChangios) {
                console.log('No hay cambios en el descuento, actualización exitosa');
                return true;
            }
            
            const query = `
                UPDATE descuentos_cantidad 
                SET producto_id = :producto_id,
                    cantidad_minima = :cantidad_minima,
                    porcentaje_descuento = :porcentaje_descuento,
                    activo = :activo
                WHERE id = :id
            `;
            
            const result = await sequelize.query(query, {
                replacements: { 
                    id, 
                    producto_id, 
                    cantidad_minima, 
                    porcentaje_descuento, 
                    activo: activo ? 1 : 0 
                },
                type: sequelize.QueryTypes.UPDATE
            });
            
            return result[1] > 0; // result[1] contiene el número de filas afectadas
        } catch (error) {
            console.error('Error al actualizar descuento:', error);
            // Fallback automático en caso de error
            return jsonFallback.actualizarDescuento(id, producto_id, cantidad_minima, porcentaje_descuento, activo);
        }
    }
}

// === Inicialización del fallback ===
(async () => {
  useFallback = !(await isConnected());
  console.log(useFallback ? '🟡 Fallback JSON activado para Descuentos' : '🟢 DB conectada para Descuentos');
})();

module.exports = DescuentosService;
