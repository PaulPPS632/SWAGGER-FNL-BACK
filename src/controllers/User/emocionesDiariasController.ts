import { EmocionesDiarias } from "../../models/User/emocionesDiarias";
import { EstresNiveles } from "../../models/Clasificacion/estres_niveles";

export class EmocionesDiariasController {
    static async registrarEmocion(req: any, res: any) {
        try {
            const { emocion, notaOpcional } = req.body;
            const userId = req.user.id;

            const fechaActual = new Date();

            const existeEmocion = await EmocionesDiarias.findOne({
                where: { userId, fecha: fechaActual },
            });
            if (existeEmocion) {
                return res
                    .status(400)
                    .json({ mensaje: "Ya registraste una emoción para hoy." });
            }

            let estresId;
            if (emocion === -1) {
                estresId = 1; // Valor para la carita triste
            } else if (emocion === 0) {
                estresId = 2; // Valor para la carita neutral
            } else if (emocion === 1) {
                estresId = 3; // Valor para la carita feliz
            } else {
                return res.status(400).json({ mensaje: "Valor de emoción no válido." });
            }

            const nuevaEmocion = await EmocionesDiarias.create({
                userId,
                fecha: fechaActual,
                emocion,
                estresId,
                notaOpcional,
            });

            return res.status(201).json(nuevaEmocion);
        } catch (error) {
            return res
                .status(500)
                .json({ mensaje: "Error al registrar la emoción.", error });
        }
    }

    static async obtenerEmocion(req: any, res: any) {
        try {
            const { fecha } = req.params;
            const userId = req.user.id; 

            const emocion = await EmocionesDiarias.findOne({
                where: { fecha, userId }, 
                include: [EstresNiveles], 
            });

            if (!emocion) {
                return res.status(404).json({ mensaje: "No hay registros para esta fecha." });
            }

            return res.status(200).json(emocion);
        } catch (error) {
            return res.status(500).json({ mensaje: "Error al obtener la emoción.", error });
        }
    }

    static async listarEmociones(req: any, res: any) {
        try {
            const userId = req.user.id; 

            const emociones = await EmocionesDiarias.findAll({
                where: { userId }, 
                include: [EstresNiveles],
                order: [["fecha", "DESC"]], 
            });

            return res.status(200).json(emociones);
        } catch (error) {
            return res.status(500).json({ mensaje: "Error al listar las emociones.", error });
        }
    }
}