//import { Sequelize } from "sequelize-typescript";
//import {  Sequelize } from "sequelize";
//import { UserEstresSession } from "../../models/Clasificacion/userestressession";
import { User } from "../../models/User/user";
//import database from "../../config/database";
import { Message } from "../../models/ChatBot/message";
import { Op, Sequelize } from "sequelize";
import { EstresNiveles } from "../../models/Clasificacion/estres_niveles";
import { Empresas } from "../../models/Global/empresas";
import { EstresContador } from "../../models/Clasificacion/estres_contador";
import { UserResponses } from "../../models/User/user_responses";
import { Hierarchical_level } from "../../models/User/hierarchical_level";
import { UserPrograma } from "../../models/Program/userprograma";
import moment from "moment-timezone";
import { StudentPrograma } from "../../models/Program/studentprograma";
import { StudentsResponses } from "../../models/User/studentsresponses";
import { UserEstresSession } from "../../models/Clasificacion/userestressession";
import { AgeRange } from "../../models/User/ageRange";


//import moment from "moment";

class MetricasController {
  async TotalEmpleados(req: any, res: any) {
    try {

      const empresa_id = req.params.empresa_id;
      const cant = await User.count({
        where: {
          id: {
            [Op.ne]: 1, // Excluye los mensajes enviados por el bot (user_id = 1)
          },
          role_id: {
            [Op.ne]: 3, // Excluye los roles con id 3
          },
          empresa_id: empresa_id,
        },
      });
      if (!cant)
        return res.status(404).json({ message: "no se encontraron usuarios" });
      return res.status(200).json({ cant });
    } catch (error: any) {
      console.log("Error: ", error.message);
    }
  }
  
  async EmpleadosEstressPorcentaje(req: any, res: any) {
    try {
      const empresa_id = req.params.empresa_id;
      let porcentajeAlto = 0
      // Verificar si la empresa existe
      const empresa = await Empresas.findOne({ where: { id: empresa_id } });
      if (!empresa) {
        return res.status(404).json({ error: "Empresa no encontrada" });
      }
  
      // Obtener el total de empleados de la empresa
      const totalUsuarios = await User.count({
        where: { empresa_id: empresa_id },
      });
  
      if (totalUsuarios === 0) {
        return res.status(200).json({
          empresa: empresa.nombre,
          nivel_estres: "Alto",
          cantidad_nivel_alto: 0,
          total_usuarios_empresa: 0,
          porcentaje: 0,
          mensaje: "No hay empleados registrados en esta empresa",
        });
      }
  
      // Obtener la cantidad de empleados con nivel de estrés "Alto"
      const estresNivelAlto = await EstresContador.findOne({
        where: { estres_nivel_id: 3, empresa_id:  empresa_id},
      });
  
      if (!estresNivelAlto) {
        return res.status(404).json({ error: "Nivel de estrés 'Alto' no encontrado" });
      }
  
      const cantidadAlto = estresNivelAlto.cantidad || 0;
  
      if (cantidadAlto != 0){
         porcentajeAlto = (cantidadAlto / totalUsuarios) * 100;
      }

      // Responder con los datos
      return res.status(200).json({
        empresa: empresa.nombre,
        nivel_estres: "Alto",
        cantidad_nivel_alto: cantidadAlto,
        total_usuarios_empresa: totalUsuarios,
        porcentaje: porcentajeAlto.toFixed(2), // Limitar a 2 decimales
      });
    } catch (error: any) {
      console.error("Error: ", error.message);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
  

  async EmpleadosUsaronFuncy(req: any, res: any) {
    try {
      const empresa_id = req.params.empresa_id;

      // Obtener inicio y fin del día en zona horaria de Lima y convertir a UTC
      const todayLima = moment().tz("America/Lima").startOf("day");
      const startOfDayUTC = todayLima.clone().tz("UTC").toDate();
      const endOfDayUTC = todayLima.clone().tz("UTC").endOf("day").toDate();

      console.log(`Buscando mensajes entre ${startOfDayUTC} y ${endOfDayUTC}`);

      // Contar mensajes enviados por empleados (excluyendo user_id = 1) dentro del día
      const cantidadMensajes = await Message.count({
        where: {
          user_id: {
            [Op.ne]: 1, // Excluir mensajes del bot
          },
          created_at: {
            [Op.between]: [startOfDayUTC, endOfDayUTC], // Filtrar por fecha
          },
        },
        include: [
          {
            model: User,
            as: "sender", // Alias correcto
            where: {
              empresa_id: empresa_id, // Filtrar por empresa_id
            },
          },
        ],
        group: ["user_id"],
      });

      return res.status(200).json({ cant: cantidadMensajes.length });

    } catch (error) {
      console.error("Error en EmpleadosUsaronFuncy:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }



  async CausaEstres(req: any, res: any) {
    const areaId = req.params.areaId;  // ID del área que se pasa como parámetro
    const empresa_id = req.params.empresa_id;
    try {
      if (!areaId) {
        return res.status(400).json({ message: "El parámetro areaId es obligatorio." });
      }
  
      // Obtener todos los niveles jerárquicos asociados con el área
      const nivelesJerarquicos = await Hierarchical_level.findAll({
        where: {
          area_id: areaId,  // Filtramos por el area_id de la tabla 'hierarchical_level'
        },
      });
  
      // Extraer los ids de los niveles jerárquicos
      const hierarchicalLevelIds = nivelesJerarquicos.map(level => level.id);
  
      // Obtener los usuarios que están relacionados con esos niveles jerárquicos
      const usuariosEnArea = await UserResponses.findAll({
        where: {
          hierarchical_level_id: hierarchicalLevelIds, // Filtramos por los niveles jerárquicos
        },
        attributes: ["user_id"], // Solo traemos el user_id para evitar duplicados
        group: ["user_id"], // Agrupamos por user_id para evitar repeticiones
        include: [
          {
            model: User,
            as: "user", // Asegúrate de que la relación esté bien definida
            required: true, // Solo incluir respuestas que correspondan a un usuario
            where: {
                empresa_id: empresa_id
            }
          },
          {
            model: Hierarchical_level,
            as: "hierarchical_level", // Asegúrate de definir bien la relación
            attributes: ["id", "level"], // Solo necesitamos el ID y el nivel jerárquico
          },
        ],
      });
      
  
      // Extraer los IDs de los usuarios de los niveles jerárquicos
      const userIds = usuariosEnArea.map(userResponse => userResponse.user_id);
  
      // Obtener los mensajes de esos usuarios
      const mensajes = await Message.findAll({
        where: { user_id: userIds },
        attributes: ["factor_psicosocial", "user_id"],
        group: ["factor_psicosocial", "user_id"], // 🔴 Agrupar por factor y usuario
        include: [{
            model: User,
            as: "sender", // 🔴 Especificar alias
            where: {
                empresa_id: empresa_id
            }
        }]
    });
    
    
      const userCargoMap = new Map();
      usuariosEnArea.forEach(userResponse => {
            userCargoMap.set(userResponse.user_id, userResponse.hierarchical_level.level);
      });

      const causasMap = new Map<string, { count: number, cargos: Set<string> }>();

      mensajes.forEach(mensaje => {
            const factor = mensaje.factor_psicosocial;
            const cargo = userCargoMap.get(mensaje.user_id);

            if (!causasMap.has(factor)) {
                causasMap.set(factor, { count: 0, cargos: new Set() });
            }

            const causaData = causasMap.get(factor)!;
            causaData.count += 1;
            if (cargo) {
                causaData.cargos.add(cargo);
            }
        });

      // Convertir los datos a un array
      const causas = Array.from(causasMap.entries()).map(([factor, data]) => ({
            causa: factor,
            count: data.count,
            cargos_afectados: Array.from(data.cargos)  // Convertir Set a Array
        }));

      return res.status(200).json(causas);
  
    } catch (error) {
      console.error("Error al obtener las causas de estrés:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  

  
  
  async TotalEmplEstres(req: any, res: any) {
    try {
      const empresa_id = req.params.empresa_id;
  

      const nivestres = await EstresNiveles.findAll({
        attributes: ["id", "nombre"], 
        include: [
          {
            model: EstresContador,
            attributes: ["cantidad"],
            where: { empresa_id }, 
            required: false, 
          },
        ],
      });

      const response = nivestres.map((nivel) => ({
        nivel: nivel.nombre,
        cantidad: nivel.estres_contadores.length > 0
          ? nivel.estres_contadores[0].cantidad
          : 0, 
      }));
  
      // Enviar la respuesta
      res.status(200).json(response);
    } catch (error) {
      console.error("Error en TotalEmplEstres:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
  

  async InteraccionApp2(req: any, res: any) {
    try {
      const empresa_id = req.params.empresa_id;
      const dia = req.params.dia;

      // 1. Obtener los usuarios que pertenecen a la empresa
      const users = await User.findAll({
        where: { empresa_id: empresa_id }
      });

      if (!users || users.length === 0) {
        return res.status(404).json({ error: "No se encontraron usuarios para esta empresa" });
      }

      const todayLima = moment().tz("America/Lima").startOf("day");

      const startOfDayUTC = todayLima.clone().tz("UTC").format("YYYY-MM-DD HH:mm:ss");
      const endOfDayUTC = todayLima.clone().tz("UTC").endOf("day").format("YYYY-MM-DD HH:mm:ss");

      console.log(`Buscando actividades entre ${startOfDayUTC} y ${endOfDayUTC}`);

  
      // 2. Buscar las actividades completadas hoy por cada usuario, solo una vez por usuario
      const usuariosCompletaronHoy = await UserPrograma.findAll({
        where: {
          dia: dia,
          completed_date: { [Op.ne]: null }
        },
        include: [
          {
            model: User,
            required: true,
            where: { empresa_id: empresa_id },
            attributes: ['username'] 
          },
        ],
        raw: true, // 🔥 Devuelve datos en formato plano
        nest: true // 🔥 Anida correctamente las relaciones
      });


      const data = usuariosCompletaronHoy.map(item => ({
          user_id: item.user_id, // ✅ Ahora se puede acceder directamente sin `get()`
          username: item.user.username
      }));

      return res.status(200).json({data: data})
    } catch (error) {
      console.error("Error en InteraccionApp:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
  async EstresSegunFuncy(req: any, res: any){
    try{
      const user_id = req.params.user_id;

      const UserScore = await Message.findAll({
        where:{user_id: user_id},
        attributes:['score']
      })

      if (UserScore.length === 0) {
        return res.status(404).json({ message: "No hay Score disponible" });
      }

      // Extraer los valores de score del array de objetos
      const scores = UserScore.map((entry) => entry.score);
      
      // Calcular el promedio
      const averageScore =
        scores.reduce((acc, score) => acc + score, 0) / scores.length;

      const finalScore = averageScore > 0 ? 1 : averageScore < 0 ? -1 : 0;

      let nivel_estres = ""
      if (finalScore == 1){
        nivel_estres = "Leve"
      }else if(finalScore == 0){
        nivel_estres = "Moderado"
      }else {
        nivel_estres = "Alto"
      }

      return res.status(200).json({niv_estres: nivel_estres})
    } catch (error) {
      console.error("Error en InteraccionApp:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }


  async EstrellasDia(req: any, res: any){
    try{

      const dia = req.params.dia;
      const empresa_id = req.params.empresa_id;

      const estrellasCount = await UserPrograma.findAll({
        where:{
          dia: dia,
          completed_date: { [Op.ne]: null }
        },
        include: {
          model: User,
          required: true,
          where:{
            empresa_id: empresa_id
          }
        }
      })

      if (!estrellasCount){
        return res.status(404).json({ message: `Los usuarios de la empresa ${empresa_id} no han completado actividades` });
      }

      
      const totalEstrellas = estrellasCount.reduce((sum, item) => sum + (item.estrellas || 0), 0);
      const promedio = totalEstrellas / estrellasCount.length;

      return res.json({ promedioEstrellas: promedio.toFixed(2) });


    } catch (error) {
      console.error("Error en InteraccionApp:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }


  async EstrellasDiaStudent(req: any, res: any){
    try{

      const dia = req.params.dia;
      const empresa_id = req.params.empresa_id;

      const estrellasCount = await StudentPrograma.findAll({
        where:{
          sesion: dia,
          completed_date: { [Op.ne]: null }
        },
        include: {
          model: User,
          required: true,
          where:{
            empresa_id: empresa_id
          }
        }
      })

      if (!estrellasCount){
        return res.status(404).json({ message: `Los usuarios de la empresa ${empresa_id} no han completado actividades` });
      }

      
      const totalEstrellas = estrellasCount.reduce((sum, item) => sum + (item.estrellas || 0), 0);
      const promedio = totalEstrellas / estrellasCount.length;

      return res.json({ promedioEstrellas: promedio.toFixed(2) });


    } catch (error) {
      console.error("Error en InteraccionApp:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }


  async InteraccionApp(req: any, res: any) {
    try {
      const empresa_id = req.params.empresa_id;


      // 1. Obtener los usuarios que pertenecen a la empresa
      const users = await User.findAll({
        where: { empresa_id: empresa_id, 
          role_id: {
            [Op.ne]: 3,
          } }
      });

      if (!users || users.length === 0) {
        return res.status(404).json({ error: "No se encontraron usuarios para esta empresa" });
      }

      
      const usuariosCompletaron = await UserPrograma.findAll({
        where: {
          completed_date: {
            [Op.ne]: null, // Not Null
          },
          dia: {
            [Op.between]: [1, 21], // Filtrar solo días entre 1 y 21
          },
        },
        attributes: ["user_id"],
        group: ["user_id"],
        include: [
          {
            model: User,
            required: true,
            where: {
              empresa_id: empresa_id, // Filtrar por empresa
            },
          },
        ],
        having: Sequelize.literal('COUNT(DISTINCT dia) = 21'), // Asegura que haya completado en todos los días del 1 al 21
      });


      const totalUsuariosCompletaronHoy = usuariosCompletaron.length;
      const totalUsuarios = users.length;
      const usuariosNoCompletaronHoy = totalUsuarios - totalUsuariosCompletaronHoy;

      return res.status(200).json({
        totalUsuarios,
        totalUsuariosCompletaronHoy,
        usuariosNoCompletaronHoy,
      });

    } catch (error) {
      console.error("Error en InteraccionApp:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async InteraccionAppStudents(req: any, res: any) {
    try {
      const empresa_id = req.params.empresa_id;

      // 1. Obtener los usuarios que pertenecen a la empresa
      const users = await User.findAll({
        where: { empresa_id: empresa_id }
      });

      if (!users || users.length === 0) {
        return res.status(404).json({ error: "No se encontraron usuarios para esta empresa" });
      }
  
      // 2. Buscar las actividades completadas hoy por cada usuario, solo una vez por usuario
      const usuariosCompletaronHoy = await StudentPrograma.findAll({
        where: {
          completed_date: { [Op.ne]: null }
        },
        include: [
          {
            model: User,
            required: true,
            where: { empresa_id: empresa_id },
            attributes: ['username'] 
          },
        ],
        raw: true, // 🔥 Devuelve datos en formato plano
        nest: true // 🔥 Anida correctamente las relaciones
      });


      const data = usuariosCompletaronHoy.map(item => ({
          user_id: item.user_id, // ✅ Ahora se puede acceder directamente sin `get()`
          username: item.user.username
      }));

      return res.status(200).json({data: data})
    } catch (error) {
      console.error("Error en InteraccionApp:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }


  async InteraccionAppStudents2(req: any, res: any) {
    try {
      const empresa_id = req.params.empresa_id;
      const dia = req.params.dia;

      // 1. Obtener los usuarios que pertenecen a la empresa
      const users = await User.findAll({
        where: { empresa_id: empresa_id }
      });

      if (!users || users.length === 0) {
        return res.status(404).json({ error: "No se encontraron usuarios para esta empresa" });
      }
  
      // 2. Buscar las actividades completadas hoy por cada usuario, solo una vez por usuario
      const usuariosCompletaronHoy = await StudentPrograma.findAll({
        where: {
          sesion: dia,
          completed_date: { [Op.ne]: null }
        },
        include: [
          {
            model: User,
            required: true,
            where: { empresa_id: empresa_id },
            attributes: ['username'] 
          },
        ],
        raw: true, // 🔥 Devuelve datos en formato plano
        nest: true // 🔥 Anida correctamente las relaciones
      });


      const data = usuariosCompletaronHoy.map(item => ({
          user_id: item.user_id, // ✅ Ahora se puede acceder directamente sin `get()`
          username: item.user.username
      }));

      return res.status(200).json({data: data})
    } catch (error) {
      console.error("Error en InteraccionApp:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }


  async Total_Students_compl(req: any, res: any) {
    try {
      const empresa_id = req.params.empresa_id;


      // 1. Obtener los usuarios que pertenecen a la empresa
      const users = await User.findAll({
        where: { empresa_id: empresa_id, 
          role_id: {
            [Op.ne]: 3,
          } }
      });

      if (!users || users.length === 0) {
        return res.status(404).json({ error: "No se encontraron usuarios para esta empresa" });
      }

      
      const usuariosCompletaron = await StudentPrograma.findAll({
        where: {
          completed_date: {
            [Op.ne]: null, // Not Null
          },
          sesion: {
            [Op.between]: [1, 21], // Filtrar solo días entre 1 y 21
          },
        },
        attributes: ["user_id"],
        group: ["user_id"],
        include: [
          {
            model: User,
            required: true,
            where: {
              empresa_id: empresa_id, // Filtrar por empresa
            },
          },
        ],
        
      });


      const totalUsuariosCompletaronHoy = usuariosCompletaron.length;
      const totalUsuarios = users.length;
      const usuariosNoCompletaronHoy = totalUsuarios - totalUsuariosCompletaronHoy;

      return res.status(200).json({
        totalUsuarios,
        totalUsuariosCompletaronHoy,
        usuariosNoCompletaronHoy,
      });

    } catch (error) {
      console.error("Error en InteraccionApp:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async EmojisDia(req: any, res: any){
    try{

      const dia = req.params.dia;
      const empresa_id = req.params.empresa_id;

      const estrellasCount = await UserPrograma.findAll({
        where:{
          dia: dia,
          completed_date: { [Op.ne]: null }
        },
        include: {
          model: User,
          required: true,
          where:{
            empresa_id: empresa_id
          }
        }
      })

      if (!estrellasCount){
        return res.status(404).json({ message: `Los usuarios de la empresa ${empresa_id} no han completado actividades` });
      }

      
      const totalEstrellas = estrellasCount.reduce((sum, item) => sum + (item.estrellas || 0), 0);
      const promedio = totalEstrellas / estrellasCount.length;

      return res.json({ promedioEstrellas: promedio.toFixed(2) });


    } catch (error) {
      console.error("Error en InteraccionApp:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }


  async AlumnosSeccion(req: any, res: any){
    try{  
      const seccion = req.params.seccion;
      const empresaId = req.params.empresaId;
  
      const result = await UserEstresSession.findAll({
        attributes: [
          // Cálculo del promedio de estrés
          [
            Sequelize.literal(`
              (COUNT(CASE WHEN estres_nivel_id = 1 THEN 1 END) * 1 +
               COUNT(CASE WHEN estres_nivel_id = 2 THEN 1 END) * 2 +
               COUNT(CASE WHEN estres_nivel_id = 3 THEN 1 END) * 3) / 
              NULLIF(COUNT(*), 0)
            `), 
            'promedio_estres'
          ],
          // Contar los registros para cada nivel de estrés
          [
            Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN estres_nivel_id = 1 THEN 1 ELSE NULL END')),
            'LEVE'
          ],
          [
            Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN estres_nivel_id = 2 THEN 1 ELSE NULL END')),
            'MODERADO'
          ],
          [
            Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN estres_nivel_id = 3 THEN 1 ELSE NULL END')),
            'ALTO'
          ],
          // Contar todos los registros
          [
            Sequelize.fn('COUNT', Sequelize.literal('*')),
            'total_registros'
          ]
        ],
        include: [
          {
            model: User,
            attributes: [],
            where: { empresa_id: empresaId },
            required: true,
            include: [
              {
                model: StudentsResponses,
                attributes: ['seccion'],  // Incluir la 'seccion'
                where: { seccion: seccion },  // Filtrar por la 'seccion'
              }
            ]
          }
        ]
      });
      
          
      if (!result || result.length === 0) {
                return res.status(404).json({ 
                  error: 'No se encontraron registros para la fecha especificada' 
                });
              }
          
      const promedioData = {
                promedio_estres: Number(result[0].get('promedio_estres')).toFixed(2),
                desglose: {
                  LEVE: result[0].get('LEVE'),
                  MODERADO: result[0].get('MODERADO'),
                  ALTO: result[0].get('ALTO')
                },
                total_registros: result[0].get('total_registros')
              };
      return res.status(200).json(promedioData);
  
    } catch(error) {
      console.error("Error en AlumnosSeccion:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
  async AlumnosEdad(req: any, res: any) {
    try {
      const empresaId = req.params.empresaId;

      const result = await UserEstresSession.findAll({
        attributes: [
          [
            Sequelize.literal(`
              (COUNT(CASE WHEN estres_nivel_id = 1 THEN 1 END) * 1 +
               COUNT(CASE WHEN estres_nivel_id = 2 THEN 1 END) * 2 +
               COUNT(CASE WHEN estres_nivel_id = 3 THEN 1 END) * 3) / 
               NULLIF(COUNT(*), 0)
            `),
            'promedio_estres'
          ],
          [
            Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN estres_nivel_id = 1 THEN 1 ELSE NULL END')),
            'LEVE'
          ],
          [
            Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN estres_nivel_id = 2 THEN 1 ELSE NULL END')),
            'MODERADO'
          ],
          [
            Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN estres_nivel_id = 3 THEN 1 ELSE NULL END')),
            'ALTO'
          ],
          [
            Sequelize.fn('COUNT', Sequelize.literal('*')),
            'total_registros'
          ],
          [Sequelize.col('user.studentresponses.age_range.age_range'), 'rango_edad']
        ],
        include: [
          {
            model: User,
            attributes: [],
            required: true,
            where: { empresa_id: empresaId, role_id: 4 },
            include: [
              {
                model: StudentsResponses,
                as: 'studentresponses',
                attributes: [],
                include: [
                  {
                    model: AgeRange,
                    as: 'age_range',
                    attributes: []
                  }
                ]
              }
            ]
          }
        ],
        group: ['user.studentresponses.age_range.id'],
      });

      if (!result || result.length === 0) {
        return res.status(404).json({
          error: 'No se encontraron registros para la empresa especificada'
        });
      }

      const data = result.map((row: any) => ({
        promedio_estres: Number(row.get('promedio_estres')).toFixed(2),
        desglose: {
          LEVE: row.get('LEVE'),
          MODERADO: row.get('MODERADO'),
          ALTO: row.get('ALTO')
        },
        total_registros: row.get('total_registros'),
        rango_edad: row.get('rango_edad')
      }));

      return res.status(200).json(data);
    } catch (error) {
      console.error("Error en AlumnosEdad:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async EstresSalidaGeneral(req:any, res:any){
    
    try{
      const empresaId = req.params.empresaId;

      const result = await UserEstresSession.findOne({
        attributes: [
          [Sequelize.fn('COUNT', Sequelize.literal(`CASE WHEN estres_salida_nivel_id = 3 THEN 1 END`)), 'ALTO'],
          [Sequelize.fn('COUNT', Sequelize.literal(`CASE WHEN estres_salida_nivel_id = 2 THEN 1 END`)), 'MODERADO'],
          [Sequelize.fn('COUNT', Sequelize.literal(`CASE WHEN estres_salida_nivel_id = 1 THEN 1 END`)), 'LEVE']
        ],
        include: [{
          model: User,
          attributes: [],
          where: { empresa_id: empresaId },
          required: true
        }],
        raw: true // Agregar `raw: true` para que no devuelva un array de resultados con instancias de Sequelize, sino solo los datos
      });

      if (!result) {
            return res.status(404).json({ error: 'No hay niveles de estres de salida para esta empresa' });
      }

      return res.status(200).json(result);
      } catch (error) {
        console.error('Error al obtener el estrés de salida de la empresa:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
    
  }

  
  async EstresSalidaUsuario(req: any, res: any) {
    try {
      const userId = req.params.userId;

      const result: any = await UserEstresSession.findOne({
        attributes: [
          [Sequelize.fn('COUNT', Sequelize.literal(`CASE WHEN estres_salida_nivel_id = 3 THEN 1 END`)), 'ALTO'],
          [Sequelize.fn('COUNT', Sequelize.literal(`CASE WHEN estres_salida_nivel_id = 2 THEN 1 END`)), 'MODERADO'],
          [Sequelize.fn('COUNT', Sequelize.literal(`CASE WHEN estres_salida_nivel_id = 1 THEN 1 END`)), 'LEVE']
        ],
        include: [{
          model: User,
          attributes: [],
          where: { id: userId },
          required: true
        }],
        raw: true // Esto le dice a Sequelize que devuelva un objeto plano
      });

      if (!result) {
        return res.status(404).json({ error: 'No hay niveles de estrés para este usuario' });
      }

      // Ahora TypeScript permite acceder a ALTO, MODERADO, LEVE directamente
      const { ALTO, MODERADO, LEVE } = result;

      let nivelEstres = 'No tiene estres de salida'; 
      
      if (ALTO > 0) {
        nivelEstres = 'Alto';
      } else if (MODERADO > 0) {
        nivelEstres = 'Moderado';
      }else if (LEVE > 0) {
        nivelEstres = 'Leve';
      }

      return res.status(200).json({
        nivel_estres: nivelEstres
      });

    } catch (error) {
      console.error('Error al obtener el estrés de salida del usuario:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

}


export default MetricasController;
