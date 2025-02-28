import { Router } from "express";
import { getPrediction } from "../controllers/Prediccion/predictionController";

const router = Router();

router.get("/predict/:empresaId", getPrediction);

export default router;
