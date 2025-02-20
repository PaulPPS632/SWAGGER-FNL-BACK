import { Request, Response } from "express";
import { predictStress } from "../../services/predictionService";

export const getPrediction = async (_req: Request, res: Response): Promise<void> => {
    try {
        const prediction = await predictStress();
        res.json(prediction);
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ error: err.message });
    }
};
