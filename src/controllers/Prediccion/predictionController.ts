import { Request, Response } from "express";
import { predictStress } from "../../services/predictionService";

export const getPrediction = async (req: Request, res: Response): Promise<void> => {
    try {
        const empresaIdStr = req.params.empresaId || req.query.empresaId as string;
        const empresaId = empresaIdStr ? parseInt(empresaIdStr, 10) : NaN;

        if (isNaN(empresaId)) {
            res.status(400).json({ error: "se requiere un empresaid válido." });
            return;
        }

        console.log(`🔹 Solicitando predicción para empresa_id: ${empresaId}`);

        const prediction = await predictStress(empresaId);
        res.json(prediction);
    } catch (error: any) {
        console.error("error en la predicción:", error.message || error);
        res.status(500).json({ error: "error al obtener la predicción." });
    }
};
