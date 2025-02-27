import { Request, Response } from "express";
import { Ciclo } from "../../models/User/ciclo";
// @ts-ignore
export const obtenerCiclos = async (req: Request, res: Response) => {
    try {
        const ciclos = await Ciclo.findAll();
        if (ciclos.length === 0) {
            return res.status(404).json({ mensaje: "No hay ciclos registrados" });
        }
        return res.status(200).json(ciclos);
    } catch (error) {
        return res.status(500).json({ error: "Error al obtener los ciclos" });
    }
};

export const obtenerCicloPorId = async (req: Request, res: Response) => {
    try {
        const ciclo = await Ciclo.findByPk(req.params.id);
        if (!ciclo) {
            return res.status(404).json({ error: "Ciclo no encontrado" });
        }
        return res.status(200).json(ciclo);
    } catch (error) {
        return res.status(500).json({ error: "Error al obtener el ciclo" });
    }
};

export const crearCiclo = async (req: Request, res: Response) => {
    try {
        const { ciclo } = req.body;
        if (!ciclo) {
            return res.status(400).json({ error: "El ciclo es requerido" });
        }
        const nuevoCiclo = await Ciclo.create({ ciclo });
        return res.status(201).json(nuevoCiclo);
    } catch (error) {
        return res.status(500).json({ error: "Error al crear el ciclo" });
    }
};

export const actualizarCiclo = async (req: Request, res: Response) => {
    try {
        const { ciclo } = req.body;
        if (!ciclo) {
            return res.status(400).json({ error: "El ciclo es requerido" });
        }
        const [actualizado] = await Ciclo.update({ ciclo }, { where: { id: req.params.id } });
        if (actualizado) {
            const cicloActualizado = await Ciclo.findByPk(req.params.id);
            return res.status(200).json(cicloActualizado);
        } else {
            return res.status(404).json({ error: "Ciclo no encontrado" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Error al actualizar el ciclo" });
    }
};

export const eliminarCiclo = async (req: Request, res: Response) => {
    try {
        const eliminada = await Ciclo.destroy({ where: { id: req.params.id } });
        if (eliminada) {
            return res.status(200).json({ mensaje: "Ciclo eliminado con éxito" });
        } else {
            return res.status(404).json({ error: "Ciclo no encontrado" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Error al eliminar  ciclo" });
    }
};
