import { Request, Response } from "express";
import { TestAcademico } from "../../models/Test/test_academico";
import { AcademicoResponses } from "../../models/Test/academico_responses";
import { User } from "../../models/User/user";

class TestAcademicoController {
    async saveStudentResponse(_req: Request, _res: Response) {
        try {
        const { user_id, estado, ...preguntas } = _req.body;
    
        const test = await TestAcademico.create({
            user_id,
            estado,
            ...preguntas,
        });

        await User.update(
            { testacademicobool: true },  // Actualiza el campo test_academico a true
            { where: { id: user_id } }  // Asegúrate de que el user_id sea correcto
        );
    
        return _res.status(200).json(test);  // Asegura que se retorna una respuesta
        } catch (error) {
        return _res.status(500).json({ message: "Error al crear el test", error });
        }
    }

    async Save_responses(req: any, res: any) {
            try {
                const { user_id, nivel_estres, factor_1, factor_2, factor_3, factor_4 } = req.body;
                const createresp = await AcademicoResponses.create({
                    user_id,
                    nivel_estres,
                    factor_1,
                    factor_2,
                    factor_3,
                    factor_4
                });
                res.status(200).json({ message: "Respuesta guardada correctamente", data: createresp });
            } catch (error) {
                console.error("Error al guardar la respuesta:", error);
              res.status(500).json({ error: "Error al obtener niveles jerárquicos" });
            }
          }
    
    async Get_responses(req: any, res: any) {
            try {
                const { user_id } = req.params;
                const responses = await AcademicoResponses.findOne({ where: { user_id } });
                res.status(200).json(responses);
            } catch (error) {
              res.status(500).json({ error: "Error al obtener niveles jerárquicos" });
            }
          }
}

export default new TestAcademicoController();