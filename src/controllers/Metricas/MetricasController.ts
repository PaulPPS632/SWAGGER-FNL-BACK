//import { Sequelize } from "sequelize-typescript";
//import {  Sequelize } from "sequelize";
//import { UserEstresSession } from "../../models/Clasificacion/userestressession";
import { User } from "../../models/User/user";
//import database from "../../config/database";
import { Message } from "../../models/ChatBot/message";
import { Op } from "sequelize";
import { endOfDay, startOfDay } from "date-fns";
import { EstresNiveles } from "../../models/Clasificacion/estres_niveles";
import { Empresas } from "../../models/Global/empresas";
import { EstresContador } from "../../models/Clasificacion/estres_contador";
import { UserResponses } from "../../models/User/user_responses";
import { Hierarchical_level } from "../../models/User/hierarchical_level";
//import moment from "moment";

class MetricasController {
  async TotalEmpleados(req: any, res: any) {
    try {

      const empresa_id = req.params.empresa_id;
      const cant = await User.count({
        where: {
          empresa_id,
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
      const startOfDayLocal = startOfDay(new Date());
      const endOfDayLocal = endOfDay(new Date());
      console.log("hoy: ", startOfDayLocal, endOfDayLocal);
      const cantidadMensajes = await Message.count({
        
        where: {
          user_id: {
            [Op.ne]: 1, // Excluye los mensajes enviados por el bot (user_id = 1)
          },
          created_at: {
            [Op.between]: [startOfDayLocal, endOfDayLocal], // Filtrar por fecha
          },
        },
        include: [
          {
            model: User,
            as: "sender", // Especificar el alias
            where: {
              empresa_id: empresa_id, // Filtrar por empresa_id
            },
          },
        ],
        group: ['user_id'],
      });
      return res.status(200).json({ cant: cantidadMensajes.length });
    }catch (error) {
      console.error("Error en EmpleadosUsaronFuncyHoy:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }


  async CausaEstres(req: any, res: any) {
    const areaId = req.params.areaId;  // ID del área que se pasa como parámetro
  
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
          hierarchical_level_id: hierarchicalLevelIds,  // Filtramos por los niveles jerárquicos
        },
        include: [
          {
            model: User,
            as: 'user',  // Asegúrate de tener bien definida la relación entre UserResponse y User
            required: true,  // Solo incluir respuestas que correspondan a un usuario
          },
          {
              model: Hierarchical_level,
              as: 'hierarchical_level',  // Asegúrate de definir bien la relación
              attributes: ['id', 'level']  // Solo necesitamos el ID y el nombre del cargo
          }
        ]
      });
  
      // Extraer los IDs de los usuarios de los niveles jerárquicos
      const userIds = usuariosEnArea.map(userResponse => userResponse.user_id);
  
      // Obtener los mensajes de esos usuarios
      const mensajes = await Message.findAll({
          where: { user_id: userIds },
          attributes: ["factor_psicosocial", "user_id"]
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
  
  

}


export default MetricasController;
