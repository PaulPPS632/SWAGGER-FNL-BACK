import { Router } from "express";
import StudentResponseController from "../controllers/User/studentResponseController";

const StudentResponseRoutes = Router();

// Definir las rutas para user_responses
/**
 * Post track
 * @openapi
 * /guardarStudentResponses:
 *    post:
 *      tags:
 *        - User Responses
 *      summary: "Registrar user responses"
 *      description: Este endpoint es para Registrar el usuario responses
 *      requestBody:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/userResponse"
 *      responses:
 *        '200':
 *          description: Retorna confirmacion y datos almacenados
 *        '422':
 *          description: Error de validacion.
 */
StudentResponseRoutes.post('/guardarStudentResponses', StudentResponseController.saveStudentResponse); // Ruta para guardar respuestas de usuarios

/**
 * Post track
 * @openapi
 * /userResponses/{userId}:
 *    get:
 *      tags:
 *        - User Responses
 *      summary: "Lista todos los user responses de un user"
 *      description: Este endpoint es para listar todos los user responses de un usuario segun ID
 *      parameters: 
 *        - name: userId
 *          in: path
 *          description: ID del usuario necesario
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *        '200':
 *          description: Retorna todos los user responses de un usuario
 *        '422':
 *          description: Error de validacion.
 *        '500':
 *          description: Error interno del servidor
 */
StudentResponseRoutes.get('/studentResponses/:user_id', StudentResponseController.getStudentResponsesByUserId); 


export default StudentResponseRoutes;