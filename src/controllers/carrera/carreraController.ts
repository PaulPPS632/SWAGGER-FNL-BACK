import { Request, Response } from 'express';
import { Carrera } from '../../models/User/carrera';
// @ts-ignore
export const obtenerCarreras = async (req: Request, res: Response): Promise<Response> => {
    try {
        const empresa_id = req.params.empresa_id;
        const carreras = await Carrera.findAll({
            where:{
                empresa_id: empresa_id
            }
        });
        if (carreras.length === 0) {
            return res.status(404).json({ mensaje: 'No hay carreras registradas' });
        }
        return res.status(200).json({results: carreras});
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener las carreras' });
    }
};

export const obtenerCarreraPorId = async (req: Request, res: Response): Promise<Response> => {
    try {
        const empresa_id = req.params.empresa_id;
        const carrera = await Carrera.findOne({
            where:{
                empresa_id: empresa_id,
                id: req.params.id
            }
        });
        if (!carrera) {
            return res.status(404).json({ error: 'Carrera no encontrada' });
        }
        return res.status(200).json(carrera);
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener la carrera' });
    }
};

export const crearCarrera = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { carrera } = req.body;
        if (!carrera) {
            return res.status(400).json({ error: 'El nombre de la carrera es requerido' });
        }
        const nuevaCarrera = await Carrera.create({ carrera });
        return res.status(201).json(nuevaCarrera);
    } catch (error) {
        return res.status(500).json({ error: 'Error al crear la carrera' });
    }
};

export const actualizarCarrera = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { carrera } = req.body;
        if (!carrera) {
            return res.status(400).json({ error: 'El nombre de la carrera es requerido' });
        }

        const [actualizado] = await Carrera.update({ carrera }, { where: { id: req.params.id } });
        if (actualizado) {
            const carreraActualizada = await Carrera.findByPk(req.params.id);
            return res.status(200).json(carreraActualizada);
        } else {
            return res.status(404).json({ error: 'Carrera no encontrada' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error al actualizar la carrera' });
    }
};

export const eliminarCarrera = async (req: Request, res: Response): Promise<Response> => {
    try {
        const eliminada = await Carrera.destroy({ where: { id: req.params.id } });
        if (eliminada) {
            return res.status(200).json({ mensaje: 'Carrera eliminada con éxito' });
        } else {
            return res.status(404).json({ error: 'Carrera no encontrada' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error al eliminar  carrera' });
    }
};
