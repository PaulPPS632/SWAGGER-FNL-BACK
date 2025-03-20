import { Router } from "express";
import UserProgramaController from "../controllers/Program/UserProgramaController";

const UserProgramaRouter = Router();
const userprogramacontroller = new UserProgramaController()
// CRUD routes

/**
 * Post track
 * @openapi
 * /userprograma:
 *    get:
 *      tags:
 *        - UserPrograma
 *      summary: "Lista todos los registros de UserPrograma"
 *      description: Este endpoint es para listar todas las tecnicas
 *      responses:
 *        '200':
 *          description: Retorna un listado de tecnicas
 *        '422':
 *          description: Error de validacion.
 */
UserProgramaRouter.get('/', userprogramacontroller.getAll);

/**
 * GET track
 * @openapi
 * /userprograma/{user_id}/actividad/{activity_id}:
 *    get:
 *      tags:
 *        - UserPrograma
 *      summary: "Obtener start_date de un UserPrograma por actividad"
 *      description: Este endpoint es para obtener el start_date de un registro por user_id y activity_id
 *      parameters:
 *        - name: user_id
 *          in: path
 *          description: ID del usuario
 *          required: true
 *        - name: activity_id
 *          in: path
 *          description: ID de la actividad
 *          required: true
 *      responses:
 *        '200':
 *          description: Retorna el start_date del programa.
 *        '404':
 *          description: Programa no encontrado.
 *        '500':
 *          description: Error interno del servidor.
 */
UserProgramaRouter.get(
    '/:user_id/actividad/:dia',
    userprogramacontroller.getStartDateByActivity.bind(userprogramacontroller)
  );
  
/**
 * Post track
 * @openapi
 * /userprograma/{id}:
 *    get:
 *      tags:
 *        - UserPrograma
 *      summary: "Obtener un User Programa segun ID"
 *      description: Este endpoint es para obtener un User Programa
 *      parameters: 
 *        - name: id
 *          in: path
 *          description: ID de la tecnica
 *          required: true
 *      responses:
 *        '200':
 *          description: Retorna el nombre del nivel.
 *        '422':
 *          description: Error de validacion.
 */
UserProgramaRouter.get('/:id', userprogramacontroller.getById);

/**
 * Post track
 * @openapi
 * /userprograma/{id}:
 *    put:
 *      tags:
 *        - UserPrograma
 *      summary: "Actualizar un User Programa"
 *      description: Este endpoint para actualizar un User Programa, se necesita el id
 *      parameters: 
 *        - name: id
 *          in: path
 *          description: ID del UserPrograma
 *          required: true
 *      requestBody:
 *          content:
 *            application/octet-stream:
 *              schema:
 *                $ref: "#/components/schemas/userPrograma"
 *      responses:
 *        '200':
 *          description: Retorna datos actualizados
 *        '422':
 *          description: Error de validacion.
 */
UserProgramaRouter.put('/:id', userprogramacontroller.update);

/**
 * Post track
 * @openapi
 * /userprograma/{id}:
 *    delete:
 *      tags:
 *        - UserPrograma
 *      summary: "Eliminar User Programa"
 *      description: Este endpoint para eliminar un User Programa, se necesita el ID
 *      parameters: 
 *        - name: id
 *          in: path
 *          description: ID del User Programa
 *          required: true
 *      responses:
 *        '200':
 *          description: Retorna mensaje de confirmacion.
 *        '422':
 *          description: Error de validacion.
 */
UserProgramaRouter.delete('/:id', userprogramacontroller.delete);

/**
 * Post track
 * @openapi
 * /userprograma/user/{user_id}:
 *    get:
 *      tags:
 *        - UserPrograma
 *      summary: "Obtener un User Programa segun ID"
 *      description: Este endpoint es para obtener un User Programa
 *      parameters: 
 *        - name: user_id
 *          in: path
 *          description: ID de la tecnica
 *          required: true
 *      responses:
 *        '200':
 *          description: Retorna el nombre del nivel.
 *        '422':
 *          description: Error de validacion.
 */
UserProgramaRouter.get('/user/:user_id', userprogramacontroller.getByUserId);

/**
 * Post track
 * @openapi
 * /userprograma/report/{user_id}:
 *    post:
 *      tags:
 *        - UserPrograma
 *      summary: "Reporte de un Usuario"
 *      description: Este endpoint es para generar un reporte epecifico de un usuario
 *      parameters: 
 *        - name: user_id
 *          in: path
 *          description: ID de la tecnica
 *          required: true
 *      responses:
 *        '200':
 *          description: Retorna mensaje de confirmacion y lista de programas.
 *        '422':
 *          description: Error de validacion.
 */
UserProgramaRouter.post('/report/:user_id', userprogramacontroller.asignacionActivitys);


/**
 * Post track
 * @openapi
 * /userprograma/report/{user_id}:
 *    post:
 *      tags:
 *        - UserPrograma
 *      summary: "Reporte de un Usuario"
 *      description: Este endpoint es para generar un reporte epecifico de un usuario
 *      parameters: 
 *        - name: user_id
 *          in: path
 *          description: ID de la tecnica
 *          required: true
 *      responses:
 *        '200':
 *          description: Retorna mensaje de confirmacion y lista de programas.
 *        '422':
 *          description: Error de validacion.
 */
UserProgramaRouter.post('/report/students/:user_id', userprogramacontroller.asignacionActivityStudents);

/**
 * Post track
 * @openapi
 * /userprograma/getprogramcompleto/{user_id}:
 *    post:
 *      tags:
 *        - UserPrograma
 *      summary: "Lista de UserPrograma de un Usuario"
 *      description: Este endpoint es para listar los registros de UserPrograma filtrados por Usuario y ordenados por dia
 *      parameters: 
 *        - name: user_id
 *          in: path
 *          description: ID del usuario
 *          required: true
 *      responses:
 *        '200':
 *          description: Retorna lista de User Programa.
 *        '422':
 *          description: Error de validacion.
 */
UserProgramaRouter.post('/getprogramcompleto/:user_id', userprogramacontroller.getByUserIdAndOrderByDia);

/**
 * Post track
 * @openapi
 * /userprograma/{user_id}/{id}:
 *    post:
 *      tags:
 *        - UserPrograma
 *      summary: "Lista de UserPrograma de un Usuario"
 *      description: Este endpoint es para listar los registros de UserPrograma filtrados por Usuario y ordenados por dia
 *      parameters: 
 *        - name: user_id
 *          in: path
 *          description: ID del usuario
 *          required: true
 *        - name: id
 *          in: path
 *          description: ID del UserPrograma
 *          required: true
 *      requestBody:
 *          content:
 *            application/octet-stream:
 *              schema:
 *                type: object
 *                properties:
 *                  comentario:
 *                      type: string
 *                      example: "un comentario de ejemplo"
 *                  estrellas:
 *                      type: integer
 *                      example: 2
 *      responses:
 *        '200':
 *          description: Retorna lista de User Programa.
 *        '422':
 *          description: Error de validacion.
 */
UserProgramaRouter.put('/:user_id/:id', userprogramacontroller.updateByUserAndTecnica);

UserProgramaRouter.post('/generateActivitys', userprogramacontroller.generar);

/**
 * Post track
 * @openapi
 * /userprograma/estrellas/{userId}:
 *    get:
 *      tags:
 *        - UserPrograma
 *      summary: "Obtener estrellas"
 *      description: Este endpoint es para obtener las estrellas de un usuario
 *      parameters: 
 *        - name: userId
 *          in: path
 *          description: ID del usuario
 *          required: true
 *      responses:
 *        '200':
 *          description: Retorna las estrellas del usuario
 *        '422':
 *          description: Error de validacion.
 */
UserProgramaRouter.get('/estrellas/:userId', userprogramacontroller.getStars);

UserProgramaRouter.get('/:userId/act/:dia', userprogramacontroller.getActivityCompleted);
export default UserProgramaRouter;