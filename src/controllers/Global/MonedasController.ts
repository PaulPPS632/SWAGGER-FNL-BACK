import { Monedas } from "../../models/Global/monedas";

class MonedasController {

  async insert_monedas(req: any, res: any) {
    const { monedas, user_id } = req.body;
  
    try {
      // Validación de datos
      if (!monedas || !user_id) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
      }
  
      // Buscar si el usuario ya tiene monedas
      const existMoned = await Monedas.findOne({ where: { user_id } });
  
      if (existMoned) {
        // Actualizar cantidad de monedas
        await existMoned.update({ cantidad: existMoned.cantidad + monedas });
      } else {
        // Crear nuevo registro
        await Monedas.create({ user_id, cantidad: monedas });
      }
  
      return res.status(200).json({ message: `Monedas insertadas correctamente para el usuario ${user_id}` });
  
    } catch (error) {
      console.error("Error en insert_monedas:", error);
      return res.status(500).json({ error: "Error al insertar las monedas" });
    }
  }


  async get_all_monedas(_req: any, res: any) {
    try {
      const monedas = await Monedas.findAll();
      return res.status(200).json(monedas);
    } catch (error) {
      console.error("Error en get_all_monedas:", error);
      return res.status(500).json({ error: "Error al obtener las monedas" });
    }
  }

  // Obtener monedas por user_id
  async get_monedas_by_user(req: any, res: any) {
    const { user_id } = req.params;

    try {
      const monedas = await Monedas.findOne({ where: { user_id } });

      if (!monedas) {
        return res.status(404).json({ error: "No se encontraron monedas para este usuario" });
      }

      return res.status(200).json(monedas);
    } catch (error) {
      console.error("Error en get_monedas_by_user:", error);
      return res.status(500).json({ error: "Error al obtener las monedas del usuario" });
    }
  }

  // Actualizar monedas por user_id
  async update_monedas(req: any, res: any) {
    const { user_id } = req.params;
    const { cantidad } = req.body;

    try {
      const monedas = await Monedas.findOne({ where: { user_id } });

      if (!monedas) {
        return res.status(404).json({ error: "No se encontraron monedas para este usuario" });
      }

      await monedas.update({ cantidad });

      return res.status(200).json({ message: `Monedas actualizadas correctamente para el usuario ${user_id}` });

    } catch (error) {
      console.error("Error en update_monedas:", error);
      return res.status(500).json({ error: "Error al actualizar las monedas" });
    }
  }

  // Eliminar monedas por user_id
  async delete_monedas(req: any, res: any) {
    const { user_id } = req.params;

    try {
      const monedas = await Monedas.findOne({ where: { user_id } });

      if (!monedas) {
        return res.status(404).json({ error: "No se encontraron monedas para este usuario" });
      }

      await monedas.destroy();

      return res.status(200).json({ message: `Monedas eliminadas para el usuario ${user_id}` });

    } catch (error) {
      console.error("Error en delete_monedas:", error);
      return res.status(500).json({ error: "Error al eliminar las monedas" });
    }
  }

}

export default new MonedasController();