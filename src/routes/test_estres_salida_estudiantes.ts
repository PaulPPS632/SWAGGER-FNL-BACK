import { Router } from "express";
import TestEstresSalidaController from "../controllers/Test/TestEstresSalidaEstudiantesController";

const TestEstresSalidaRoutes = Router();

/**
 * Crear test de estrés de salida
 * @openapi
 * /guardarTestEstresSalida:
 *    post:
 *      tags:
 *        - Test Estres Salida
 *      summary: "Crear test de estrés de salida para un estudiante"
 *      description: Este endpoint es para crear un test de estrés de salida de un estudiante.
 *      responses:
 *        '200':
 *          description: Retorna la confirmación y los datos almacenados.
 *        '500':
 *          description: Error al crear el test de salida.
 */
TestEstresSalidaRoutes.post('/guardarTestEstresSalida', (req, res) => {
  // Llamada al controlador con _req y _res
  TestEstresSalidaController.createTestEstresSalida(req, res);
});

/**
 * Obtener test de estrés de salida por usuario
 * @openapi
 * /listarTestEstresSalida/{user_id}:
 *    get:
 *      tags:
 *        - Test Estres Salida
 *      summary: "Obtener test de estrés de salida de un estudiante"
 *      description: Este endpoint obtiene el test de estrés de salida de un estudiante por su ID.
 *      parameters:
 *        - name: user_id
 *          in: path
 *          required: true
 *          description: ID del usuario del estudiante.
 *      responses:
 *        '200':
 *          description: Retorna los datos del test de estrés de salida.
 *        '404':
 *          description: Test de salida no encontrado.
 */
TestEstresSalidaRoutes.get('/listarTestEstresSalida/:user_id', (req, res) => {
  // Llamada al controlador con _req y _res
  TestEstresSalidaController.getTestEstresSalida(req, res);
});

/**
 * Actualizar test de estrés de salida para estudiante
 * @openapi
 * /actualizarTestEstresSalida/{user_id}:
 *    put:
 *      tags:
 *        - Test Estres Salida
 *      summary: "Actualizar test de estrés de salida de un estudiante"
 *      description: Este endpoint permite actualizar un test de estrés de salida para un estudiante.
 *      parameters:
 *        - name: user_id
 *          in: path
 *          required: true
 *          description: ID del usuario del estudiante.
 *      responses:
 *        '200':
 *          description: Test de salida actualizado exitosamente.
 *        '404':
 *          description: Test de salida no encontrado.
 */
TestEstresSalidaRoutes.put('/actualizarTestEstresSalida/:user_id', (req, res) => {
  // Llamada al controlador con _req y _res
  TestEstresSalidaController.updateTestEstresSalida(req, res);
});

export default TestEstresSalidaRoutes;
