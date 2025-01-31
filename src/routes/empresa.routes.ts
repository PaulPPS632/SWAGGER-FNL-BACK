import { Router } from "express";
import EmpresaController from "../controllers/Global/EmpresaController";

const EmpresaRouter = Router();
const empresaController = new EmpresaController();

EmpresaRouter.get("/:id", empresaController.getById)

export default EmpresaRouter;