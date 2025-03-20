import { StudentsResponses } from "../../models/User/studentsresponses";


class StudentResponseController {
  async saveStudentResponse(req: any, res: any) {
    const {
      user_id,
      age_range_id,
      ciclo_id,
      gender_id,
      created_at,
    } = req.body;

    try {
      const userResponse = await StudentsResponses.create({
        user_id,
        age_range_id,
        ciclo_id,
        gender_id,
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
  
  async getStudentResponsesByUserId(req: any, res: any) {
    const { user_id } = req.params; // O puedes usar req.query si viene desde la URL

    try {
      const responses = await StudentsResponses.findAll({
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

export default new StudentResponseController();
