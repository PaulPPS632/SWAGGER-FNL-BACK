import { Router } from "express";
import UserResponseController from "../controllers/User/userResponseController";

const UserResponseRoutes = Router();

// Definir las rutas para user_responses
/**
 * Post track
 * @openapi
 * /guardarUserResponses:
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
UserResponseRoutes.post('/guardarUserResponses', UserResponseController.saveUserResponse); // Ruta para guardar respuestas de usuarios

/**
 * Post track
 * @openapi
 * /userResponses:
 *    get:
 *      tags:
 *        - User Responses
 *      summary: "Lista todos los user responses"
 *      description: Este endpoint es para listar todos los user responses
 *      responses:
 *        '200':
 *          description: Retorna confirmacion y datos almacenados
 *        '422':
 *          description: Error de validacion.
 *        '500':
 *          description: Error interno del servidor
 */
UserResponseRoutes.get('/userResponses', UserResponseController.getAllUserResponses); // Ruta para obtener todas las respuestas de usuarios

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
UserResponseRoutes.get('/userResponses/:user_id', UserResponseController.getUserResponsesByUserId); 

export default UserResponseRoutes;