import { Router } from "express";
import monedasController from "../controllers/Global/MonedasController"; // Sin llaves porque ya exportaste una instancia

const MonedasRouter = Router();

MonedasRouter.post("/monedas/insert", monedasController.insert_monedas);
MonedasRouter.get("/monedas/allmonedas", monedasController.get_all_monedas);
MonedasRouter.get("/monedas/usermonedas/:user_id", monedasController.get_monedas_by_user);
MonedasRouter.put("/monedas/update/:user_id", monedasController.update_monedas);
MonedasRouter.delete("/monedas/delete/:user_id", monedasController.delete_monedas);

export default MonedasRouter;
