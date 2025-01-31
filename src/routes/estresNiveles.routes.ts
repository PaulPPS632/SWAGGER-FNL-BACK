import { Router } from "express"
import EstresNivelController from "../controllers/Clasificacion/EstresNivelController";

const EstresNivelesRoutes = Router();

/**
 * Post track
 * @openapi
 * /estresniveles/{id}/nombre:
 *    get:
 *      tags:
 *        - Niveles de Estress
 *      summary: "Obtener nombre de nivel"
 *      description: Este endpoint para obtener el nombre del nivel
 *      parameters: 
 *        - name: id
 *          in: path
 *          description: ID para buscar
 *          required: true
 *      responses:
 *        '200':
 *          description: Retorna el nombre del nivel.
 *        '422':
 *          description: Error de validacion.
 */
EstresNivelesRoutes.get("/estresniveles/:id/nombre", EstresNivelController.getNombreById );

export default EstresNivelesRoutes;
