import { Router } from "express";
import TestEstresEstudiantesController from "../controllers/Test/TestEstresEstudiantesController";

const TestEstresEstudiantesRoutes = Router();

/**
 * Crear test de estrés
 * @openapi
 * /guardarTestEstresEstudiante:
 *    post:
 *      tags:
 *        - Test Estres Estudiantes
 *      summary: "Crear test de estrés para un estudiante"
 *      description: Este endpoint es para crear un test de estrés de un estudiante.
 *      responses:
 *        '200':
 *          description: Retorna la confirmación y los datos almacenados.
 *        '500':
 *          description: Error al crear el test.
 */
TestEstresEstudiantesRoutes.post('/guardarTestEstresEstudiante', (req, res) => {
  // Llamada al controlador con _req y _res
  TestEstresEstudiantesController.createTestEstresEstudiante(req, res);
});

/**
 * Obtener test de estrés por usuario
 * @openapi
 * /listarTestEstresEstudiante/{user_id}:
 *    get:
 *      tags:
 *        - Test Estres Estudiantes
 *      summary: "Obtener test de estrés de un estudiante"
 *      description: Este endpoint obtiene el test de estrés de un estudiante por su ID.
 *      parameters:
 *        - name: user_id
 *          in: path
 *          required: true
 *          description: ID del usuario del estudiante.
 *      responses:
 *        '200':
 *          description: Retorna los datos del test de estrés.
 *        '404':
 *          description: Test no encontrado.
 */
TestEstresEstudiantesRoutes.get('/listarTestEstresEstudiante/:user_id', (req, res) => {
  // Llamada al controlador con _req y _res
  TestEstresEstudiantesController.getTestEstresEstudiante(req, res);
});

/**
 * Actualizar test de estrés para estudiante
 * @openapi
 * /actualizarTestEstresEstudiante/{user_id}:
 *    put:
 *      tags:
 *        - Test Estres Estudiantes
 *      summary: "Actualizar test de estrés de un estudiante"
 *      description: Este endpoint permite actualizar un test de estrés para un estudiante."
 *      parameters:
 *        - name: user_id
 *          in: path
 *          required: true
 *          description: ID del usuario del estudiante.
 *      responses:
 *        '200':
 *          description: Test actualizado exitosamente.
 *        '404':
 *          description: Test no encontrado.
 */
TestEstresEstudiantesRoutes.put('/actualizarTestEstresEstudiante/:user_id', (req, res) => {
  // Llamada al controlador con _req y _res
  TestEstresEstudiantesController.updateTestEstresEstudiante(req, res);
});

export default TestEstresEstudiantesRoutes;
