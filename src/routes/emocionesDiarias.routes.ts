import { Router } from "express";
import { EmocionesDiariasController } from "../controllers/User/emocionesDiariasController";
import verifyUserId from "../middlewares/verifyuserId";

const router = Router();

// Registrar una emoción diaria
/**
 * @openapi
 * /emociones_diarias:
 *   post:
 *     tags:
 *       - Emociones Diarias
 *     summary: "Registrar una emoción diaria"
 *     description: "Este endpoint es para registrar una nueva emoción diaria"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emocion:
 *                 type: integer
 *               notaOpcional:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       '201':
 *         description: Retorna la emoción diaria registrada
 *       '400':
 *         description: Ya registraste una emoción para esta fecha
 *       '500':
 *         description: Error al registrar la emoción
 */
router.post("/emociones_diarias", verifyUserId, EmocionesDiariasController.registrarEmocion); // Middleware agregado

// Obtener una emoción diaria por fecha
/**
 * @openapi
 * /emociones_diarias/{fecha}:
 *   get:
 *     tags:
 *       - Emociones Diarias
 *     summary: "Obtener una emoción diaria por fecha"
 *     description: "Este endpoint es para obtener la emoción diaria registrada en una fecha específica"
 *     parameters:
 *       - name: fecha
 *         in: path
 *         required: true
 *         description: Fecha de la emoción (formato YYYY-MM-DD)
 *     responses:
 *       '200':
 *         description: Retorna la emoción diaria
 *       '404':
 *         description: No hay registros para esta fecha
 *       '500':
 *         description: Error al obtener la emoción
 */
router.get("/emociones_diarias/:fecha", verifyUserId, EmocionesDiariasController.obtenerEmocion); // Middleware agregado si se necesita el userId

// Listar todas las emociones diarias
/**
 * @openapi
 * /emociones_diarias:
 *   get:
 *     tags:
 *       - Emociones Diarias
 *     summary: "Listar todas las emociones diarias"
 *     description: "Este endpoint es para listar todas las emociones diarias registradas"
 *     responses:
 *       '200':
 *         description: Retorna una lista de todas las emociones diarias
 *       '500':
 *         description: Error al listar las emociones
 */
router.get("/emociones_diarias", verifyUserId, EmocionesDiariasController.listarEmociones); // Middleware agregado si se necesita el userId

export default router;
