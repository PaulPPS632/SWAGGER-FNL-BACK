import { AgeRange } from "../../models/User/ageRange";
import { Area } from "../../models/User/area";
import { Gender } from "../../models/User/gender";
import { Hierarchical_level } from "../../models/User/hierarchical_level";
import { ResponsabilityLevel } from "../../models/User/responsabilityLevel";
import { Sedes } from "../../models/User/sedes";
import { User } from "../../models/User/user";

import { StudentsResponses } from "../../models/User/studentsresponses";
import { StudentPrograma } from "../../models/Program/studentprograma";
import {Op} from "sequelize"
import { Ciclo } from "../../models/User/ciclo";


class MaintanceController {
  async RangeAge(_req: any, res: any) {
    try {
      const ageRanges = await AgeRange.findAll(); // Consulta la base de datos para obtener los datos
      res.json({ results: ageRanges });
    } catch (error) {
      res.status(500).json({ error: "Error al obtener rango de edades" });
    }
  }

  async RangeAge2(_req: any, res: any) {
    try {
      const ageRanges = [
        { id: 1, age_range: "17 - 19" },
        { id: 2, age_range: "20 - 22" },
        { id: 3, age_range: "23 o más" },
      ];
  
      res.json({ results: ageRanges });
    } catch (error) {
      res.status(500).json({ error: "Error al obtener rango de edades" });
    }
  }
  

  async Seccion(_req: any, res: any) {
    try {
      const seccion = [
        { id: 1, seccion: "1" },
        { id: 2, seccion: "2" },
        { id: 3, seccion: "3" },
        { id: 4, seccion: "4" },
        { id: 5, seccion: "5" },
        { id: 5, seccion: "5" },
        { id: 6, seccion: "6" },
        { id: 7, seccion: "7" },
        { id: 8, seccion: "8" },
        { id: 9, seccion: "9" },
        { id: 10, seccion: "10" },
        { id: 11, seccion: "11" },
        { id: 12, seccion: "12" },
        { id: 13, seccion: "13" },
        { id: 14, seccion: "14" },
      ];
  
      res.json({ results: seccion });
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
  //Ultimos cambios
  async CompletedByAge(_req: any, res: any) {
    try {
      const completedUsers = await StudentPrograma.findAll({
        where: {
          completed_date: { [Op.ne]: null },
        },
        attributes: ["user_id"],
        group: ["user_id"],
      });

      const userIds = completedUsers.map((user) => user.user_id);

      const results = await StudentsResponses.findAll({
        where: {
          user_id: { [Op.in]: userIds },
        },
        include: [
          {
            model: AgeRange,
            attributes: ["id", "age_range"],
          },
        ],
      });

      res.json({ results });
    } catch (error) {
      console.error("Error al obtener filtros por edad:", error);
      res.status(500).json({ error: "Error al obtener los datos por edad" });
    }
  }

  async CompletedByCiclo(_req: any, res: any) {
    try {
      const completedUsers = await StudentPrograma.findAll({
        where: {
          completed_date: { [Op.ne]: null },
        },
        attributes: ["user_id"],
        group: ["user_id"],
      });

      const userIds = completedUsers.map((user) => user.user_id);

      const results = await StudentsResponses.findAll({
        where: {
          user_id: { [Op.in]: userIds },
        },
        include: [
          {
            model: Ciclo,
            attributes: ["id", "ciclo"],
          },
        ],
      });

      res.json({ results });
    } catch (error) {
      console.error("Error al obtener filtros por ciclo:", error);
      res.status(500).json({ error: "Error al obtener los datos por ciclo" });
    }
  }

  async CompletedByGender(_req: any, res: any) {
    try {
      const completedUsers = await StudentPrograma.findAll({
        where: {
          completed_date: { [Op.ne]: null },
        },
        attributes: ["user_id"],
        group: ["user_id"],
      });

      const userIds = completedUsers.map((user) => user.user_id);

      const results = await StudentsResponses.findAll({
        where: {
          user_id: { [Op.in]: userIds },
        },
        include: [
          {
            model: Gender,
            attributes: ["id", "gender"],
          },
        ],
      });

      res.json({ results });
    } catch (error) {
      console.error("Error al obtener filtros por género:", error);
      res.status(500).json({ error: "Error al obtener los datos por género" });
    }
  }

}
export default new MaintanceController();
