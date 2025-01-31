import { Empresas } from "../../models/Global/empresas";

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

}
export default EmpresaController;