import { UserResponses } from "../../models/User/user_responses";

class UserResponseController {
  async saveUserResponse(req: any, res: any) {
    const {
      user_id,
      age_range_id,
      hierarchical_level_id,
      responsability_level_id,
      gender_id,
      sedes_id,
      created_at,
    } = req.body;

    try {
      const userResponse = await UserResponses.create({
        user_id,
        age_range_id,
        hierarchical_level_id,
        responsability_level_id,
        gender_id,
        sedes_id,
        created_at,
      });

      res
        .status(201)
        .json({
          message: "Respuesta guardada exitosamente.",
          data: userResponse,
        });
    } catch (error) {
      console.error("Error al guardar la respuesta del usuario:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
  async getAllUserResponses(_req: any, res: any) {
    try {
      const responses = await UserResponses.findAll();
      res.status(200).json(responses);
    } catch (error) {
      console.error("Error al obtener las respuestas de usuarios:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }

  async getUserResponsesByUserId(req: any, res: any) {
    const { user_id } = req.params; // O puedes usar req.query si viene desde la URL

    try {
      const responses = await UserResponses.findAll({
        where: { user_id: user_id }, // Filtrar por user_id
      });

      if (responses.length === 0) {
        return res
          .status(404)
          .json({ message: "No se encontraron respuestas para este usuario." });
      }

      res.status(200).json(responses);
    } catch (error) {
      console.error("Error al obtener las respuestas de usuario:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
}

export default new UserResponseController();
