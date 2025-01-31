import { Router } from 'express';
import { getHistorial, getPrediccion } from '../controllers/Prediccion/predictionController';

const router = Router();

router.get('/historico', getHistorial);
router.get('/predecir', getPrediccion);

export default router;
