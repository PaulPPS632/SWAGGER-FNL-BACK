import { Request, Response } from 'express';
import { obtenerHistorialCompleto, predecirEstres } from '../../services/predictionService';

export const getHistorial = async (_req: Request, res: Response): Promise<void> => {
    const historial = await obtenerHistorialCompleto();
    if (!historial) {
        res.status(400).json({ error: 'No hay suficientes datos históricos.' });
        return;
    }
    res.json(historial);
};

export const getPrediccion = async (_req: Request, res: Response): Promise<void> => {
    const resultado = await predecirEstres();
    if (!resultado) {
        res.status(500).json({ error: 'Error al obtener datos o hacer predicción.' });
        return;
    }
    res.json(resultado);
};
