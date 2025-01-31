import { Router } from "express";
import SpeechTextController from "../controllers/Program/SpeechToTextController";

const SpeechTextRoutes = Router();

/**

 */
SpeechTextRoutes.get("/texttovoice", SpeechTextController.generateSpeech.bind(SpeechTextController));
//OpenaiRoutes.post("/ask", OpenaiController.getBotResponse);
export default SpeechTextRoutes;