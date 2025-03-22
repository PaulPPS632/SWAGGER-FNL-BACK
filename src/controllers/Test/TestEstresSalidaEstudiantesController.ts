import { Request, Response } from "express";
import { TestEstresSalida } from "../../models/Test/test_estres_salida";

// Crear un nuevo test de estrés de salida
const createTestEstresSalida = async (req: Request, res: Response) => {
  try {
    const { user_id, estado, ...preguntas } = req.body;

    const test = await TestEstresSalida.create({
      user_id,
      estado,
      ...preguntas,
    });

    return res.status(201).json(test);  // Asegura que se retorna una respuesta
  } catch (error) {
    return res.status(500).json({ message: "Error al crear el test de salida", error });
  }
};

// Obtener un test de estrés de salida por ID de usuario
const getTestEstresSalida = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const test = await TestEstresSalida.findOne({
      where: { user_id },
    });

    if (!test) {
      return res.status(404).json({ message: "Test de salida no encontrado" });
    }

    return res.status(200).json(test);  // Asegura que se retorna una respuesta
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener el test de salida", error });
  }
};

// Actualizar un test de estrés de salida para estudiante
const updateTestEstresSalida = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const { estado, ...preguntas } = req.body;

    const test = await TestEstresSalida.update(
      { estado, ...preguntas },
      { where: { user_id } }
    );

    if (test[0] === 0) {
      return res.status(404).json({ message: "Test de salida no encontrado" });
    }

    return res.status(200).json({ message: "Test de salida actualizado exitosamente" });  // Asegura que se retorna una respuesta
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar el test de salida", error });
  }
};

export default {
  createTestEstresSalida,
  getTestEstresSalida,
  updateTestEstresSalida,
};
