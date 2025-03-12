import { Request, Response } from "express";
import { TestEstresEstudiantes } from "../../models/Test/test_estres_estudiantes";

// Crear un nuevo test de estrés para estudiante
const createTestEstresEstudiante = async (_req: Request, _res: Response) => {
  try {
    const { user_id, estado, ...preguntas } = _req.body;

    const test = await TestEstresEstudiantes.create({
      user_id,
      estado,
      ...preguntas,
    });

    return _res.status(201).json(test);  // Asegura que se retorna una respuesta
  } catch (error) {
    return _res.status(500).json({ message: "Error al crear el test", error });
  }
};

// Obtener un test de estrés por ID de usuario
const getTestEstresEstudiante = async (_req: Request, _res: Response) => {
  try {
    const { user_id } = _req.params;
    const test = await TestEstresEstudiantes.findOne({
      where: { user_id },
    });

    if (!test) {
      return _res.status(404).json({ message: "Test no encontrado" });
    }

    return _res.status(200).json(test);  // Asegura que se retorna una respuesta
  } catch (error) {
    return _res.status(500).json({ message: "Error al obtener el test", error });
  }
};

// Actualizar un test de estrés para estudiante
const updateTestEstresEstudiante = async (_req: Request, _res: Response) => {
  try {
    const { user_id } = _req.params;
    const { estado, ...preguntas } = _req.body;

    const test = await TestEstresEstudiantes.update(
      { estado, ...preguntas },
      { where: { user_id } }
    );

    if (test[0] === 0) {
      return _res.status(404).json({ message: "Test no encontrado" });
    }

    return _res.status(200).json({ message: "Test actualizado exitosamente" });  // Asegura que se retorna una respuesta
  } catch (error) {
    return _res.status(500).json({ message: "Error al actualizar el test", error });
  }
};

export default {
  createTestEstresEstudiante,
  getTestEstresEstudiante,
  updateTestEstresEstudiante,
};
