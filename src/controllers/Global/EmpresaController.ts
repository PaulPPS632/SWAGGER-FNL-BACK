import { Empresas } from "../../models/Global/empresas";
import { User } from "../../models/User/user";
import { Sedes } from "../../models/User/sedes";
//import Sequelize from "sequelize";
import { UserResponses } from "../../models/User/user_responses";
import { Op } from 'sequelize';

class EmpresaController{

    async getById(req: any, res: any){
        try {
            const empresa = await Empresas.findByPk(req.params.id);
            if (!empresa) return res.status(404).json({ message: 'Empresa no encontrada' });
            res.status(200).json(empresa);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
   
    async getDistribucionSedePorEmpresa(req: any, res: any) {
        const empresaId = req.params.id;
       
        try {
            // First, verify if the empresa exists
            const empresa = await Empresas.findByPk(empresaId);
            if (!empresa) {
                return res.status(404).json({ message: 'Empresa no encontrada' });
            }

            // Get all users with their sede information
            const users = await User.findAll({
                where: {
                    empresa_id: empresaId,
                    role_id: 1, // Excluir Administradores
                    id: { [Op.notIn]: [1]} // Excluir Fancy
                },
                include: [{
                    model: UserResponses,
                    required: false,
                    include: [{
                        model: Sedes,
                        required: false,
                        where: { empresa_id: empresaId }
                    }],
                }],
                raw: true,
                nest: true
            });

            

            // Process the results to get the distribution
            const distribution: { [key: string]: number } = {};
            users.forEach((user: any) => {
                const sede = user.userresponses?.sedes?.sede || 'Pendiente';
                distribution[sede] = (distribution[sede] || 0) + 1;
            });

            const total = users.length;

            const resultado = {
                distribucion: distribution,
                total,
                detalles: users.map((user: any) => ({
                    username: user.username,
                    sede: user.userresponses?.sedes?.sede || 'Pendiente'
                }))
            };
   
            return res.status(200).json(resultado);
        } catch (error) {
            console.error('Error al obtener distribución por sedes:', error);
            return res.status(500).json({ 
                error: 'Error interno del servidor',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }


}
export default EmpresaController;