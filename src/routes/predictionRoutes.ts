import { Router } from "express";
import { getPrediction } from "../controllers/Prediccion/predictionController";

const router = Router();

router.get("/predict", getPrediction);

export default router;
