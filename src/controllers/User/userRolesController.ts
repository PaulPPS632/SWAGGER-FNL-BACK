import { Role } from "../../models/User/role";

class RoleController {

    async createRole(req: any, res: any) {
        const { name } = req.body;

        try {
            if (!name) {
                return res.status(400).json({ error: "Nombre de rol obligatorio "});
            } 
            const role = await Role.create({ name });
            return res.status(201).json({ message: "Rol creado correctamente", data: role});
        } catch (error) {
            console.error("Error al crear el rol", error);
            return res.status(500).json({ error: "Error interno del servidor"});
        }
    }

    async getAllRoles(_req: any, res: any) {
        try {
            const roles = await Role.findAll();
            return res.status(200).json(roles);
        } catch (error) {
            console.error("error al obtener los roles", error);
            return res.status(500).json({error: "Error interno del servidor"})
        }
    }

    async updateRole(req: any, res: any) {
        const { id } = req.params;
        const { name } = req.body;

        try {
            const role = await Role.findByPk(id);
            if(!role){
                return res.status(404).json({ error: "Rol no encontrado "});
            }

            if (name) {
                role.name = name;
            }

            await role.save();
            return res.status(200).json ({ message: "Rol actualizado", data: role});
        } catch (error) {
            console.error("Error al actualizar el rol ", error);
            return res.status(500).json({ error: "Error interno del servidor"});
        }
    }

    async deleteRole(req: any, res: any) {
        const { id } = req.params

        try {
            const role = await Role.findByPk(id);
            if(!role){
                return res.status(404).json({ error: "Rol no encontrado"});
            }
        

        await role.destroy();
        return res.status(204).json();
        } catch (error) {
            console.error("Error al eliminar el rol: ", error);
            return res.status(500).json({ error: "Error interno del servidor"});
        }
    }
}

export default new RoleController();