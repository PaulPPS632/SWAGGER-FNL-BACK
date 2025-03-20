import { addDays } from "date-fns";
import { UserEstresSession } from "../../models/Clasificacion/userestressession";
import { UserPrograma } from "../../models/Program/userprograma";
import { User } from "../../models/User/user";
import { UserResponses } from "../../models/User/user_responses";
import OpenaiController from "../ChatBot/OpenaiController";
import { AgeRange } from "../../models/User/ageRange";
import { ResponsabilityLevel } from "../../models/User/responsabilityLevel";
import { Gender } from "../../models/User/gender";
import { Hierarchical_level } from "../../models/User/hierarchical_level";
import { EstresNiveles } from "../../models/Clasificacion/estres_niveles";
import { Tags } from "../../models/Program/Tags";
import { Op } from "sequelize";
import { Activitys } from "../../models/Program/Activitys";
import { StudentsResponses } from "../../models/User/studentsresponses";
import { Carrera } from "../../models/User/carrera";
import { Ciclo } from "../../models/User/ciclo";

class UserProgramaController {
  respuestaMap: Record<string, string>;
  preguntasDefiniciones: Record<string, string>;
  constructor() {
    this.respuestaMap = {
      1: "Nunca",
      2: "Raras veces",
      3: "Ocasionalmente",
      4: "Algunas veces",
      5: "Frecuentemente",
      6: "Generalmente",
      7: "Siempre",
    };
    this.preguntasDefiniciones = {
      pregunta_1:
        "Tener que hacer reportes tanto para sus jefes como para las personas de su equipo le preocupa, porque siente que debe cumplir con las expectativas de todos y eso le genera tensión.",
      pregunta_2:
        "Si no puede controlar lo que sucede en su área de trabajo, se frustra, ya que le gusta tener todo bajo control y organizado.",
      pregunta_3:
        "Si no cuenta con el equipo necesario para hacer su trabajo, se siente estresado porque no puede hacerlo de la mejor manera.",
      pregunta_4:
        "Cuando su jefe no lo apoya o no habla bien de él frente a otros superiores, se siente solo y preocupado, pensando que no lo valoran.",
      pregunta_5:
        "Si siente que su jefe no lo trata con respeto o no valora su trabajo, le causa mucho estrés.",
      pregunta_6:
        "No sentirse parte de un equipo de trabajo unido le hace sentirse aislado y preocupado por no poder colaborar eficientemente con otros.",
      pregunta_7:
        "Cuando su equipo de trabajo no lo apoya en alcanzar sus metas, se siente estresado y frustrado.",
      pregunta_8:
        "Sentir que su equipo de trabajo no tiene buena reputación dentro de la empresa le provoca estrés, ya que desea que su equipo sea valorado.",
      pregunta_9:
        "La falta de claridad en la forma de trabajar dentro de la empresa le genera confusión y estrés.",
      pregunta_10:
        "Las políticas impuestas por la gerencia que dificultan su trabajo le causan frustración y estrés.",
      pregunta_11:
        "Cuando siente que no tiene suficiente control sobre su trabajo, igual que sus compañeros, se siente estresado y sin poder sobre lo que sucede.",
      pregunta_12:
        "Si percibe que su supervisor no se preocupa por su bienestar, se siente menospreciado y estresado.",
      pregunta_13:
        "No contar con el conocimiento técnico necesario para competir en la empresa le genera una sensación de inseguridad y estrés.",
      pregunta_14:
        "No tener un espacio privado para trabajar en tranquilidad le incomoda y le estresa.",
      pregunta_15:
        "La carga de papeleo excesivo en la empresa le resulta abrumadora y le provoca estrés.",
      pregunta_16:
        "La falta de confianza de su supervisor en su trabajo le hace sentir inseguro y estresado.",
      pregunta_17:
        "Si su equipo de trabajo está desorganizado, se siente ansioso porque no puede trabajar de manera efectiva.",
      pregunta_18:
        "Cuando su equipo no lo protege de las demandas laborales injustas de los jefes, se siente desamparado y estresado.",
      pregunta_19:
        "La falta de dirección clara y objetivos definidos en la empresa le genera estrés e incertidumbre.",
      pregunta_20:
        "Si siente que su equipo lo presiona demasiado, se estresa porque siente que no puede cumplir con todo.",
      pregunta_21:
        "Cuando no respetan a sus superiores, a él mismo, o a las personas que están por debajo de él, siente estrés e incomodidad.",
      pregunta_22:
        "Si su equipo de trabajo no le brinda apoyo técnico cuando lo necesita, se siente frustrado y estresado.",
      pregunta_23:
        "La falta de tecnología adecuada para realizar un trabajo de calidad le genera una gran presión y estrés.",
    };
  }

  createAndGenerateReport = async (req: any, res: any) => {
    const { user_id } = req.params; // Obtener el user_id de los parámetros de la URL
    let data = req.body; // Obtener el map pasado en el cuerpo de la solicitud

    // Eliminar 'estado' y 'user_id' del map
    delete data["estado"];
    delete data["user_id"];

    try {
      // Obtener datos del usuario, nivel de estrés y respuestas
      const user = await User.findOne({
        where: { id: user_id },
        attributes: ["username", "email"],
        include: [
          {
            model: UserResponses,
            include: [
              {
                model: AgeRange,
              },
              {
                model: Hierarchical_level,
              },
              {
                model: Gender,
              },
              {
                model: ResponsabilityLevel,
              },
            ],
          },
          {
            model: UserEstresSession,
            include: [
              {
                model: EstresNiveles,
              },
            ],
          },
        ],
      });

      if (!user) {
        return res.status(404).json({
          error: "No se encontraron los datos requeridos del usuario.",
        });
      }
      const estres_nivel =
        user?.userestressessions.estres_nivel.nombre ?? "Desconocido";
      const age_range =
        user?.userresponses.age_range.age_range ?? "Desconocido";
      const hierarchical_level =
        user?.userresponses.hierarchical_level.level ?? "Desconocido";
      const responsability_level =
        user?.userresponses.responsability_level.level ?? "Desconocido";
      const gender = user?.userresponses.gender.gender || "Desconocido";

      const respuesta = this.generarTextorespuestas(data);
      
      await OpenaiController.generateProgramsWithGemini(
        user_id,
        user.username,
        age_range,
        hierarchical_level,
        responsability_level,
        gender,
        estres_nivel,
        respuesta
      );
      console.log(
        "Registros insertados correctamente en la tabla UserPrograma"
      );
      res.status(200).json({
        message: "Programa generado correctamente.",
      });
    } catch (error) {
      console.error("Error al generar el programa del usuario:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  };

  generarTextorespuestas = (respuestas: Record<string, string>) => {
    let textoFinal = "";

    // Iterar sobre las claves del objeto respuestas
    for (const key in respuestas) {
      if (respuestas.hasOwnProperty(key)) {
        const pregunta = this.preguntasDefiniciones[key];
        const respuesta = this.respuestaMap[respuestas[key]];

        // Concatenar la pregunta y la respuesta
        textoFinal += `Pregunta: ${pregunta} - Respuesta: ${respuesta}\n`;
      }
    }

    return textoFinal;
  };
  asignacionActivitys = async (req: any, res: any) => {
    const { user_id } = req.params; // Obtener el user_id de los parámetros de la URL
    try {
      const user = await User.findOne({
        where: { id: user_id },
        attributes: ["username", "email"],
        include: [
          {
            model: UserResponses,
            include: [
              {
                model: AgeRange,
              },
              {
                model: Hierarchical_level,
              },
              {
                model: Gender,
              },
              {
                model: ResponsabilityLevel,
              },
            ],
          },
          {
            model: UserEstresSession,
            include: [
              {
                model: EstresNiveles,
              },
            ],
          },
        ],
      });

      if (!user) {
        return res.status(404).json({
          error: "No se encontraron los datos requeridos del usuario.",
        });
      }
      const estres_nivel =
        user?.userestressessions.estres_nivel.nombre ?? "Desconocido";
      const age_range =
        user?.userresponses.age_range.age_range ?? "Desconocido";
      const hierarchical_level =
        user?.userresponses.hierarchical_level.level ?? "Desconocido";
      const responsability_level =
        user?.userresponses.responsability_level.level ?? "Desconocido";
      const gender = user?.userresponses.gender.gender || "Desconocido";

      const tags = [
        {
          tipo: "Nivel de Estres",
          nombre: estres_nivel,
        },
        {
          tipo: "Rango de Edad",
          nombre: age_range,
        },
        {
          tipo: "Genero",
          nombre: gender,
        },
        {
          tipo: "Jerarquia de Puesto de trabajo",
          nombre: hierarchical_level,
        },
        {
          tipo: "Nivel de Responsabilidad en el trabajo",
          nombre: responsability_level,
        },
      ];
      const conditions = tags.map((tag: { nombre: string; tipo: string }) => ({
        nombre: tag.nombre,
        tipo: tag.tipo,
      }));
      const tagsDB = await Tags.findAll({
        where: {
          [Op.or]: conditions,
        },
        attributes: ["id", "nombre", "tipo"],
      });
      const userTagIds = tagsDB.map((tag) => tag.id);
      const activities = await Activitys.findAll({
        include: {
          model: Tags,
          where: { id: { [Op.in]: userTagIds } },
        },
      });

      const matchedActivities = activities.map((activity) => {
        const matchScore = activity.tags.filter((tag) =>
          tagsDB.some((userTag) => userTag.id === tag.id)
        ).length;
        return { activity, matchScore };
      });
      matchedActivities.sort((a, b) => b.matchScore - a.matchScore);
      const selectedActivities = matchedActivities
        .slice(0, 21)
        .map((item) => item.activity);
      // Crear los registros para la tabla UserPrograma
      const userProgramRecords = selectedActivities.map((activity, index) => ({
        user_id: user_id,
        activity_id: activity.id,
        dia: index + 1, // Día del 1 al 21
        start_date: index + 1 === 1 ? new Date() : null,
      }));

      // Registrar las actividades en UserPrograma
      await UserPrograma.bulkCreate(userProgramRecords);
      return res.status(200).json({ seleccionados: selectedActivities });
    } catch (error) {
      console.error("Error al asignar los programas del usuario:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  };

  asignacionActivityStudents = async (req: any, res: any) => {
    const { user_id } = req.params; // Obtener el user_id de los parámetros de la URL
    try {
      const user = await User.findOne({
        where: { id: user_id },
        attributes: ["username", "email"],
        include: [
          {
            model: StudentsResponses,
            include: [
              {
                model: AgeRange,
              },
              {
                model: Carrera,
              },
              {
                model: Ciclo,
              },
              {
                model: Gender,
              },
            ],
          },
          {
            model: UserEstresSession,
            include: [
              {
                model: EstresNiveles,
              },
            ],
          },
        ],
      });

      if (!user) {
        return res.status(404).json({
          error: "No se encontraron los datos requeridos del usuario.",
        });
      }
      const estres_nivel =
        user?.userestressessions.estres_nivel.nombre ?? "Desconocido";
      const age_range =
        user?.studentresponses.age_range.age_range ?? "Desconocido";
      const carrera =
        user?.studentresponses.carrera.carrera ?? "Desconocido";
      const ciclo =
        user?.studentresponses.ciclo.ciclo ?? "Desconocido";
      const gender = user?.studentresponses.gender.gender || "Desconocido";

      const tags = [
        {
          tipo: "Nivel de Estres",
          nombre: estres_nivel,
        },
        {
          tipo: "Rango de Edad",
          nombre: age_range,
        },
        {
          tipo: "Genero",
          nombre: gender,
        },
        {
          tipo: "Carrera",
          nombre: carrera,
        },
        {
          tipo: "Ciclo",
          nombre: ciclo,
        },
      ];
      const conditions = tags.map((tag: { nombre: string; tipo: string }) => ({
        nombre: tag.nombre,
        tipo: tag.tipo,
      }));
      const tagsDB = await Tags.findAll({
        where: {
          [Op.or]: conditions,
        },
        attributes: ["id", "nombre", "tipo"],
      });
      const userTagIds = tagsDB.map((tag) => tag.id);
      const activities = await Activitys.findAll({
        include: {
          model: Tags,
          where: { id: { [Op.in]: userTagIds } },
        },
      });

      const matchedActivities = activities.map((activity) => {
        const matchScore = activity.tags.filter((tag) =>
          tagsDB.some((userTag) => userTag.id === tag.id)
        ).length;
        return { activity, matchScore };
      });
      matchedActivities.sort((a, b) => b.matchScore - a.matchScore);
      const selectedActivities = matchedActivities
        .slice(0, 21)
        .map((item) => item.activity);
      // Crear los registros para la tabla UserPrograma
      const userProgramRecords = selectedActivities.map((activity, index) => ({
        user_id: user_id,
        activity_id: activity.id,
        dia: index + 1, // Día del 1 al 21
        start_date: index + 1 === 1 ? new Date() : null,
      }));

      // Registrar las actividades en UserPrograma
      await UserPrograma.bulkCreate(userProgramRecords);
      return res.status(200).json({ seleccionados: selectedActivities });
    } catch (error) {
      console.error("Error al asignar los programas del usuario:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  };


  generar = async (req: any, res: any) => {
    const { tags, cant } = req.body;
    try {
      if (cant > 5)
        return res
          .status(500)
          .json({
            error: "no puede generar mas de 5 actividades en una consulta",
          });
      const conditions = tags.map((tag: { nombre: string; tipo: string }) => ({
        nombre: tag.nombre,
        tipo: tag.tipo,
      }));
      const existingTags = await Tags.findAll({
        where: {
          [Op.or]: conditions,
        },
      });
      const existingTagSet = new Set(
        existingTags.map((tag) =>
          JSON.stringify({ nombre: tag.nombre, tipo: tag.tipo })
        )
      );

      // Filtrar los nuevos tags que no existen en la base de datos
      const newTags = tags.filter(
        (tag: { nombre: string; tipo: string }) =>
          !existingTagSet.has(
            JSON.stringify({ nombre: tag.nombre, tipo: tag.tipo })
          )
      );

      if (newTags.length > 0) {
        await Tags.bulkCreate(newTags);
        const ActualExistingTags = await Tags.findAll({
          where: {
            [Op.or]: conditions,
          },
          attributes: ["id", "nombre", "tipo"],
        });
        const respuesta = await OpenaiController.generateActivitys(
          ActualExistingTags,
          cant
        );
        return res
          .status(200)
          .json({ message: "Operación completada" , status: respuesta});
      } else {
        const respuesta = await OpenaiController.generateActivitys(
          existingTags,
          cant
        );
        return res
          .status(200)
          .json({ message: "Operación completada", status: respuesta });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "error interno del servidor" });
    }
  };

  async getStartDateByActivity(req: any, res: any) {
    const { user_id, dia } = req.params; // Obtener user_id y activity_id de los parámetros

    console.log(user_id, dia)
    try {
      // Buscar el registro con el user_id y activity_id
      const userPrograma = await UserPrograma.findOne({
        where: {
          user_id: user_id,
          dia: dia,
        },
        attributes: ["start_date", "completed_date"],
      });
      if (!userPrograma) {
        return res.status(404).json({ error: "Programa no encontrado para el usuario y actividad especificados." });
      }
      // Retornar el start_date
      res.status(200).json({
        start_date: userPrograma.start_date,
        completed_date: userPrograma.completed_date, // Devolver si ya fue completado
      });

    } catch (error) {
      console.error("Error al obtener el start_date:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }

  async getByUserId(req: any, res: any) {
    const { user_id } = req.params; // Obtener el user_id de los parámetros
    try {
      const userProgramas = await UserPrograma.findAll({
        where: { user_id }, // Filtrar por user_id
      });

      if (userProgramas.length === 0) {
        return res
          .status(404)
          .json({ error: "No se encontraron programas para este usuario" });
      }

      res.status(200).json(userProgramas);
    } catch (error: any) {
      console.error("Error al obtener los programas de usuario:", error); // Imprimir el error en la consola
      res.status(500).json({
        error: `Error al obtener los programas de usuario: ${error.message}`,
      }); // Enviar el mensaje de error
    }
  }

  async updateByUserAndTecnica(req: any, res: any) {
    const { user_id, id } = req.params; // Obtener user_id y ide de los parámetros
    const { comentario, estrellas, caritas } = req.body; // Obtener los campos que se quieren actualizar del body

    try {
      // Buscar el registro basado en user_id y
      const userPrograma = await UserPrograma.findOne({
        where: {
          user_id: user_id,
          id: id,
        },
      });

      const userEstresSession = await UserEstresSession.findOne({
        where: { user_id: user_id }
      });

      if (!userPrograma) {
        return res.status(404).json({ error: "Programa no encontrado" });
      }

      if (!userEstresSession) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }


      if (caritas === 3) {
            userEstresSession.caritas = 1; // Cambiar carita feliz a carita triste
        } else if (caritas === 1) {
            userEstresSession.caritas = 3; // Cambiar carita triste a carita feliz
        } else {
            userEstresSession.caritas = caritas; // Si no es 1 ni 3, asignar el valor directamente
        }

      // Actualizar los campos comentario y estrellas si se pasan en el body
      userPrograma.comentario = comentario || userPrograma.comentario;
      userPrograma.estrellas = estrellas !== undefined ? estrellas : userPrograma.estrellas;

 
      // Guardar los cambios en la base de datos
      if (userPrograma.completed_date == null)
        userPrograma.completed_date = new Date();

      //Guardar la fecha de creacion de los datos
      if (userEstresSession.created_at == null)
        userEstresSession.created_at = new Date();

      await userEstresSession.save();
      await userPrograma.save();

      const nextProgram = await UserPrograma.findOne({
        where: {
          user_id: user_id,
          dia: userPrograma.dia + 1,
        },
      });

      if (nextProgram) {
        nextProgram.start_date = addDays(new Date(), 1);
        await nextProgram.save();
      }

      res.status(200).json({
        message: "Programa actualizado con éxito",
        userPrograma,
      });
    } catch (error) {
      console.error("Error al actualizar el programa de usuario:", error);
      res
        .status(500)
        .json({ error: "Error al actualizar el programa de usuario" });
    }
  }

  // Obtener todos los registros de UserPrograma filtrados por user_id y ordenados por 'dia'
  async getByUserIdAndOrderByDia(req: any, res: any) {
    const { user_id } = req.params;
    try {
      // Obtener los programas del usuario
      const userProgramas = await UserPrograma.findAll({
        where: { user_id },
        include: [
          {
            model: Activitys
          }
        ],
        order: [["dia", "ASC"]],
      });

      if (userProgramas.length === 0) {
        return res
          .status(404)
          .json({ error: "No se encontraron programas para este usuario" });
      }
      const respuesta = userProgramas.map((programa) => ({
        id: programa.id,
            user_id: programa.user_id,
            dia: programa.dia,
            nombre_tecnica:programa.activity.nombre_tecnica,
            tipo_tecnica: programa.activity.tipo_tecnica,
            descripcion:programa.activity.descripcion,
            guia: programa.activity.guia,
            comentario: programa.comentario,
            estrellas: programa.estrellas,
            start_date: programa.start_date,
            completed_date: programa.completed_date,
            url_img: programa.activity.imagen_url
      }));
      res.status(200).json({ userProgramas:respuesta }); // Responder con los datos de ambas tablas
    } catch (error: any) {
      console.error("Error al obtener los programas de usuario:", error);
      res.status(500).json({
        error: `Error al obtener los programas de usuario: ${error.message}`,
      });
    }
  }

  // Obtener todos los registros de UserPrograma
  async getAll(_req: any, res: any) {
    try {
      const userProgramas = await UserPrograma.findAll();
      res.status(200).json(userProgramas);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al obtener los programas de usuario" });
    }
  }

  // Obtener un registro de UserPrograma por ID
  async getById(req: any, res: any) {
    const { id } = req.params;
    try {
      const userPrograma = await UserPrograma.findByPk(id);
      if (!userPrograma) {
        return res.status(404).json({ error: "Programa no encontrado" });
      }
      res.status(200).json(userPrograma);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al obtener el programa de usuario" });
    }
  }

  // Actualizar un registro de UserPrograma por ID
  async update(req: any, res: any) {
    const { id } = req.params;
    const { user_id, dia } = req.body;
    try {
      const userPrograma = await UserPrograma.findByPk(id);
      if (!userPrograma) {
        return res.status(404).json({ error: "Programa no encontrado" });
      }

      userPrograma.user_id = user_id || userPrograma.user_id;
      userPrograma.dia = dia || userPrograma.dia;

      await userPrograma.save();
      res.status(200).json(userPrograma);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al actualizar el programa de usuario" });
    }
  }

  // Eliminar un registro de UserPrograma por ID
  async delete(req: any, res: any) {
    const { id } = req.params;
    try {
      const userPrograma = await UserPrograma.findByPk(id);
      if (!userPrograma) {
        return res.status(404).json({ error: "Programa no encontrado" });
      }

      await userPrograma.destroy();
      res.status(204).json({ message: "Programa eliminado con éxito" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al eliminar el programa de usuario" });
    }
  }
  async getStars(req: any, res: any) {
    const userId = req.params.userId;
    try {
      const completedActivities = await UserPrograma.findAll({
        where: {
          user_id: userId, 
          completed_date: { [Op.ne]: null }, 
        },
        attributes: ['completed_date','estrellas', ],
        order: [['estrellas', 'DESC']], 
      });
  
      return res.status(200).json(completedActivities); 
    } catch (error) {
      console.error('Error al obtener actividades completadas:', error);
      return res.status(500).json({ error: 'Error al obtener actividades completadas' }); 
    }
  }
  async getActivityCompleted (req: any, res: any) {
    const { userId, dia } = req.params;

    try {
      const userPrograma = await UserPrograma.findOne({
        where: {
          user_id: userId,
          dia: dia,
        },
        attributes: ['completed_date'], 
      });

      if (userPrograma) {
        const isCompleted = userPrograma.completed_date !== null;
        res.status(200).json({ isCompleted });
      } else {
        res.status(200).json({ isCompleted: false });
      }
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
}
export default UserProgramaController;
