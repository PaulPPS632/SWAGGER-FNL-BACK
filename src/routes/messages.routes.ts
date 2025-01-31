import { Router } from "express";
import MessageController from "../controllers/ChatBot/MessageController";

const MessagesRoutes = Router();

/**
 * Post track
 * @openapi
 * /messages:
 *    get:
 *      tags:
 *        - Messages
 *      summary: "Listar todos los mensajes"
 *      description: Este endpoint es para obtener todos los mensajes registrados de todos los usuarios
 *      responses:
 *        '200':
 *          description: Retorna todos los mensajes registrados
 *        '422':
 *          description: Error de validacion.
 */
MessagesRoutes.get('/messages', MessageController.getAllMessages);

/**
 * Post track
 * @openapi
 * /messages/filtered:
 *    get:
 *      tags:
 *        - Messages
 *      summary: "filtrar los mensajes"
 *      description: Este endpoint es para obtener los mensajes registrados segun el filtro enviado
 *      parameters: 
 *        - name: userId
 *          in: query
 *          description: ID del tipo de tecnica
 *          required: true
 *        - name: limit
 *          in: query
 *          description: Numero de mensajes por lote
 *        - name: offset
 *          in: query
 *          description: Desplazamiento inicial
 *      responses:
 *        '200':
 *          description: Retorna los mensajes filtrados
 *        '422':
 *          description: Error de validacion.
 */
MessagesRoutes.get('/messages/filtered', MessageController.getFilteredMessages);

/**
 * Post track
 * @openapi
 * /guardarMensaje:
 *    post:
 *      tags:
 *        - Messages
 *      summary: "Crear Message"
 *      description: Este endpoint es almacenar un nuevo mensaje
 *      requestBody:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  content:
 *                      type: string
 *                      example: un mensaje de prueba
 *                  userId:
 *                      type: integer
 *                      example: 5
 *      responses:
 *        '200':
 *          description: Retorna un mensaje de confirmacion y la data almacenada
 *        '422':
 *          description: Error de validacion.
 */
MessagesRoutes.post('/guardarMensaje', MessageController.saveMessage);

/**
 * Post track
 * @openapi
 * /guardarMensajeFromBot:
 *    post:
 *      tags:
 *        - Messages
 *      summary: "Crear Message"
 *      description: Este endpoint es almacenar un nuevo mensaje del bot
 *      requestBody:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  content:
 *                      type: string
 *                      example: un mensaje de prueba
 *                  userId:
 *                      type: integer
 *                      example: 1
 *      responses:
 *        '200':
 *          description: Retorna un mensaje de confirmacion y la data almacenada
 *        '422':
 *          description: Error de validacion.
 */
MessagesRoutes.post('/guardarMensajeFromBot', MessageController.saveMessageFromBot);


/**
 * Post track
 * @openapi
 * /getstatsfuncy:
 *    get:
 *      tags:
 *        - Messages
 *      summary: "Obtener estadisticas de uso de funcy"
 *      description: Este endpoint es para obtener los dias de uso y no uso de funcy
 *      responses:
 *        '200':
 *          description: Retorna un json con las stadisticas
 *        '500':
 *          description: Error al obtener la informacion.
 */
MessagesRoutes.get('/getstatsfuncy', MessageController.getStatsFuncy);

export default MessagesRoutes;
