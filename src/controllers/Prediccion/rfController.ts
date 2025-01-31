import { Request, Response } from 'express';
import { entrenarModeloRF } from '../../services/rfService';

export const trainModeloRF = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id_empresa } = req.body;

        if (!id_empresa) {
            return res.status(400).json({ error: 'El id_empresa es requerido.' });
        }

        const resultado = await entrenarModeloRF(id_empresa);

        if (!resultado) {
            return res.status(500).json({ error: 'Error al entrenar el modelo.' });
        }

        return res.json(resultado);

    } catch (error) {
        console.error('error en `trainModeloRF`:', error);
        return res.status(500).json({ error: 'error interno en el servidor.' });
    }
};
