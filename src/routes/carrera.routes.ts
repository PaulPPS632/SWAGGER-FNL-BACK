import { Router } from 'express';
import * as carreraController from '../controllers/carrera/carreraController';

const router = Router();
// @ts-ignore
router.get('/:empresa_id', carreraController.obtenerCarreras);
// @ts-ignore
router.get('/:id/:empresa_id', carreraController.obtenerCarreraPorId);
// @ts-ignore
router.post('/', carreraController.crearCarrera);
// @ts-ignore
router.put('/:id/', carreraController.actualizarCarrera);
// @ts-ignore
router.delete('/:id/', carreraController.eliminarCarrera);

export default router;
