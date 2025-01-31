import { Router } from "express";
import TestEstresController from "../controllers/Test/TestEstresController";

const TestEstresRoutes = Router();

/**
 * Post track
 * @openapi
 * /guardarTestEstres:
 *    post:
 *      tags:
 *        - Test Estress
 *      summary: "Crear test estress de un usuario"
 *      description: Este endpoint es para crear un test de estress
 *      responses:
 *        '200':
 *          description: Retorna confirmacion y datos almacenados
 *        '422':
 *          description: Error de validacion.
 */
TestEstresRoutes.post('/guardarTestEstres', TestEstresController.saveTestEstres); 

/**
 * Post track
 * @openapi
 * /listarTestEstres:
 *    get:
 *      tags:
 *        - Test Estress
 *      summary: "Listar todos los test de estress"
 *      description: Este endpoint es para listar todos los test de estress
 *      responses:
 *        '200':
 *          description: Retorna el listado de todos los test de estress
 *        '422':
 *          description: Error de validacion.
 */
TestEstresRoutes.get('/listarTestEstres', TestEstresController.getAllTestEstres); 

export default TestEstresRoutes; 