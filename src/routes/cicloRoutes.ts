import { Router } from "express";
import { obtenerCiclos, obtenerCicloPorId, crearCiclo, actualizarCiclo, eliminarCiclo } from "../controllers/ciclo/cicloController";
//
const router = Router();
// @ts-ignore
router.get("/", obtenerCiclos);
// @ts-ignore
router.get("/:id", obtenerCicloPorId);
// @ts-ignore
router.post("/", crearCiclo);
// @ts-ignore
router.put("/:id", actualizarCiclo);
// @ts-ignore
router.delete("/:id", eliminarCiclo);

export default router;
