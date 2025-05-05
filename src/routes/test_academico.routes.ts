import { Router } from "express";
import TestAcademicoController from "../controllers/Test/TestAcademico";

const TestAcademicoRoutes = Router();

/**
 * Guardar test académico
 * @openapi
 * /guardarTestAcademico:
 *    post:
 *      tags:
 *        - Test Academico
 *      summary: "Guardar test académico"
 *      description: Este endpoint es para guardar el test académico de un estudiante.
 *      responses:
 *        '200':
 *          description: Retorna la confirmación y los datos almacenados.
 *        '500':
 *          description: Error al guardar el test.
 */
TestAcademicoRoutes.post('/guardarTestAcademico', (req, res) => {
  TestAcademicoController.saveStudentResponse(req, res);
});

/**
 * Guardar respuestas del test académico
 * @openapi
 * /guardarRespuestasAcademico:
 *    post:
 *      tags:
 *        - Test Academico
 *      summary: "Guardar respuestas del test académico"
 *      description: Este endpoint es para guardar las respuestas del test académico de un estudiante.
 *      responses:
 *        '200':
 *          description: Retorna la confirmación y los datos almacenados.
 *        '500':
 *          description: Error al guardar las respuestas.
 */
TestAcademicoRoutes.post('/guardarRespuestasAcademico', (req, res) => {
  TestAcademicoController.Save_responses(req, res);
});


/**
 * Obtener respuestas del test académico por user_id
 * @openapi
 * /obtenerRespuestasAcademico/{user_id}:
 *    get:
 *      tags:
 *        - Test Academico
 *      summary: "Obtener respuestas del test académico por user_id"
 *      description: Este endpoint es para obtener las respuestas del test académico de un estudiante por su user_id.
 *      parameters:
 *        - name: user_id
 *          in: path
 *          required: true
 *          description: ID del usuario.
 *          schema:
 *            type: integer
 *      responses:
 *        '200':
 *          description: Retorna las respuestas del test académico.
 *        '500':
 *          description: Error al obtener las respuestas.
 */

TestAcademicoRoutes.get('/obtenerRespuestasAcademico/:user_id', (req, res) => {
  TestAcademicoController.Get_responses(req, res);
});

export default TestAcademicoRoutes;