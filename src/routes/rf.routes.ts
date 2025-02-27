import { Router } from 'express';
import { trainModeloRF } from '../controllers/Prediccion/rfController';

const router = Router();

router.post('/train', async (req, res) => {
    try {
        await trainModeloRF(req, res);
    } catch (error) {
        console.error('error en la ruta /train:', error);
        res.status(500).json({ error: 'error interno en el servidor.' });
    }
});

export default router;
