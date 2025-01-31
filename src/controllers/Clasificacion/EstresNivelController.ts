import { EstresNiveles } from "../../models/Clasificacion/estres_niveles";

class EstresNivelController {
  async getNombreById(req: any, res: any) {
    try {
      const id = req.params.id; // Obtener el id de los parámetros de la ruta
      const estresNivel = await EstresNiveles.findByPk(id); // Buscar el nivel de estrés por su ID

      if (!estresNivel) {
        // Si no se encuentra el nivel de estrés
        return res
          .status(404)
          .json({ message: "Nivel de estrés no encontrado" });
      }

      // Si se encuentra, devolver el nombre
      res.status(200).json({ nombre: estresNivel.nombre });
    } catch (error) {
      // Manejo de errores
      console.error("Error al obtener el nombre del nivel de estrés:", error);
      res.status(500).json({ message: "Error del servidor" });
    }
  }
}
export default new EstresNivelController();
