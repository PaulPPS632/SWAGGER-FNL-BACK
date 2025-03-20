import { AgeRange } from "../../models/User/ageRange";
import { Area } from "../../models/User/area";
import { Gender } from "../../models/User/gender";
import { Hierarchical_level } from "../../models/User/hierarchical_level";
import { ResponsabilityLevel } from "../../models/User/responsabilityLevel";
import { Sedes } from "../../models/User/sedes";
import { User } from "../../models/User/user";

class MaintanceController {
  async RangeAge(_req: any, res: any) {
    try {
      const ageRanges = await AgeRange.findAll(); // Consulta la base de datos para obtener los datos
      res.json({ results: ageRanges });
    } catch (error) {
      res.status(500).json({ error: "Error al obtener rango de edades" });
    }
  }
  async Areas(req: any, res:any){
    try{
      const user_id = req.params.userid;
      
      const users = await User.findOne({
        where:{
          id: user_id
        },
        attributes: ["empresa_id"]
      })

      if (!users) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const areas = await Area.findAll({
        where:{
          empresa_id: users.empresa_id
        }
      })



      res.json({ results: areas });
    }catch (error) {
      res.status(500).json({ error: "Error al obtener rango de edades" });
    }
  }

  async VerAreas(req: any, res:any){
    try{
      const empresa_id = req.params.empresa_id;
      
      const areas = await Area.findAll({
        where:{
          empresa_id: empresa_id
        }
      })

      res.json({ results: areas });
    }catch (error) {
      res.status(500).json({ error: "Error al obtener rango de edades" });
    }
  }

  async Sedes(req: any, res:any){
    try{
      const user_id = req.params.userid;
      
      const users = await User.findOne({
        where:{
          id: user_id
        },
        attributes: ["empresa_id"]
      })

      if (!users) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const sedes = await Sedes.findAll({
        where:{
          empresa_id: users.empresa_id
        }
      })


      res.json({ results: sedes });
    }catch (error) {
      console.log(error)
      res.status(500).json({ error: "Error al obtener rango de edades" });
    }
  }

  async Hierarchical(req: any, res: any) {
    try {
      const area_id = req.params.area_id;
      const levels = await Hierarchical_level.findAll({
        where:{
          area_id: area_id
        }
      }); // Consulta a la base de datos
      res.json({ results: levels });
    } catch (error) {
      res.status(500).json({ error: "Error al obtener niveles jerárquicos" });
    }
  }
  async Responsability(_req: any, res: any) {
    try {
      const levels = await ResponsabilityLevel.findAll(); // Consulta la base de datos para obtener los datos
      res.json({ results: levels });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al obtener niveles de responsabilidad" });
    }
  }
  async Gender(_req: any, res: any) {
    try {
      const genders = await Gender.findAll(); // Consulta la base de datos para obtener los géneros
      res.json({ results: genders });
    } catch (error) {
      res.status(500).json({ error: "Error al obtener géneros" });
    }
  }
  


}
export default new MaintanceController();
