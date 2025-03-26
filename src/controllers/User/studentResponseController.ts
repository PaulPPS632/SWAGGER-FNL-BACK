import { StudentsResponses } from "../../models/User/studentsresponses";
import { User } from "../../models/User/user";
const fs = require('fs');

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
      // Leer el archivo JSON con las secciones
      const rawData = fs.readFileSync('secciones.json');
      const sections = JSON.parse(rawData);
  
      // Buscar el username del usuario en la tabla users
      const user = await User.findOne({ where: { id: user_id } });
  
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
  
      const userUsername = user.username;
  
      // Buscar en las secciones para determinar a qué sección pertenece
      let foundSeccion = null;
  
      // Recorremos las secciones para ver si el userUsername está presente en alguna
      for (const seccionId in sections.secciones) {
        if (sections.secciones[seccionId].includes(userUsername)) {
          foundSeccion = seccionId;  // Asignamos la sección correspondiente
          break;
        }
      }
  
      if (!foundSeccion) {
        return res.status(400).json({ error: "Usuario no pertenece a ninguna sección" });
      }
  
      // Guardar la respuesta en la base de datos con la sección encontrada
      const userResponse = await StudentsResponses.create({
        user_id,
        age_range_id,
        ciclo_id,
        gender_id,
        seccion: parseInt(foundSeccion),  // Usamos la sección encontrada
        created_at,
      });
  
      res.status(201).json({
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
