import { Router } from "express"
import MetricasController from "../controllers/Metricas/MetricasController";

const MetricasRouter = Router();
const metricasController = new MetricasController();
/**
 * Post track
 * @openapi
 * /users:
 *    get:
 *      tags:
 *        - Users
 *      summary: "Perfil del Usuario"
 *      description: Este endpoint es para obtener los datos para el Perfil 
 *      responses:
 *        '200':
 *          description: Retorna los Datos del Perfil
 *        '422':
 *          description: Error de validacion.
 */
MetricasRouter.get("/total_empleados/:empresa_id", metricasController.TotalEmpleados);

MetricasRouter.get("/EmpleadosEstressPorcentaje/:empresa_id", metricasController.EmpleadosEstressPorcentaje);

MetricasRouter.get("/UsanFuncyHoy/:empresa_id", metricasController.EmpleadosUsaronFuncy);

MetricasRouter.get("/CausasEstres/:areaId/:empresa_id", metricasController.CausaEstres);

MetricasRouter.get("/total_empl_estres/:empresa_id", metricasController.TotalEmplEstres);

MetricasRouter.get("/InteraccionApp/:empresa_id", metricasController.InteraccionApp);
MetricasRouter.get("/InteraccionApp/students/:empresa_id", metricasController.InteraccionAppStudents);
MetricasRouter.get("/InteraccionApp2/students/:dia/:empresa_id", metricasController.InteraccionAppStudents2);

MetricasRouter.get("/total_students_compl/students/:empresa_id", metricasController.Total_Students_compl);


MetricasRouter.get("/InteraccionApp2/:dia/:empresa_id", metricasController.InteraccionApp2);

MetricasRouter.get("/AlumnosSeccion/:seccion/:empresaId", metricasController.AlumnosSeccion);

MetricasRouter.get("/EstresSegunFuncy/:user_id", metricasController.EstresSegunFuncy);

MetricasRouter.get("/estrellasdia/:dia/:empresa_id", metricasController.EstrellasDia);

MetricasRouter.get("/estrellasdia/student/:dia/:empresa_id", metricasController.EstrellasDiaStudent);


MetricasRouter.get("/AlumnosEdad/:empresaId", metricasController.AlumnosEdad);

export default MetricasRouter;