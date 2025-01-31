import { Router } from "express";
import OpenaiController from "../controllers/ChatBot/OpenaiController";

const OpenaiRoutes = Router();
/**
 * Post track
 * @openapi
 * /ask:
 *    post:
 *      tags:
 *        - OpenAi
 *      summary: "Generacion de mensajes"
 *      description: Este endpoint para el chatbot funcy
 *      requestBody:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  prompt:
 *                      type: string
 *                  userId:
 *                      type: integer
 *      responses:
 *        '200':
 *          description: Retorna el mensaje
 *        '422':
 *          description: Error de validacion.
 */
OpenaiRoutes.post("/ask", OpenaiController.chat);
//OpenaiRoutes.post("/ask", OpenaiController.getBotResponse);
export default OpenaiRoutes;