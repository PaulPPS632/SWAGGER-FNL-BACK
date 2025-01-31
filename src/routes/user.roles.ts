import {Router} from "express";
import RoleController from "../controllers/User/userRolesController";

const role_router = Router();

role_router.post("/roles", RoleController.createRole);
role_router.get("/roles", RoleController.getAllRoles);
role_router.put("/roles/:id", RoleController.updateRole);
role_router.delete("/roles/:id", RoleController.deleteRole);

export default role_router;