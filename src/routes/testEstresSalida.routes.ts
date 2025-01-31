import { Router } from "express";
import TestEstresSalidaController from "../controllers/Test/TestEstresSalidaController";

const TestEstresSalidaRoutes = Router();

/**
 * Post track
 * @openapi
 * /guardarTestEstresSalida:
 *    post:
 *      tags:
 *        - Test Estress Salida
 *      summary: "Crear test estress de salida para un usuario"
 *      description: Este endpoint es para crear un test de estress
 *      responses:
 *        '200':
 *          description: Retorna confirmacion y datos almacenados
 *        '422':
 *          description: Error de validacion.
 */
TestEstresSalidaRoutes.post('/guardarTestEstresSalida', TestEstresSalidaController.saveTestEstresSalida); 

/**
 * Post track
 * @openapi
 * /listarTestEstresSalida:
 *    get:
 *      tags:
 *        - Test Estress Salida
 *      summary: "Listar todos los test de estress de salida"
 *      description: Este endpoint es para listar todos los test de estress de salida
 *      responses:
 *        '200':
 *          description: Retorna el listado de todos los test de estress de salida
 *        '422':
 *          description: Error de validacion.
 */
TestEstresSalidaRoutes.get('/listarTestEstresSalida', TestEstresSalidaController.getAllTestEstresSalida); 

export default TestEstresSalidaRoutes;