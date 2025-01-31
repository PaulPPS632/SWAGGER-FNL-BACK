import database from '../config/database';
import * as tf from '@tensorflow/tfjs-node';
import * as path from 'path';

let model: tf.LayersModel | null = null;

export const cargarModelo = async (): Promise<void> => {
    try {
        console.log("Cargando modelo...");

        const modelPath = `file://${path.resolve(__dirname, '../../modelo_estres_tfjs/model.json')}`;

        model = await tf.loadLayersModel(modelPath);
        console.log('Modelo cargado correctamente.');
    } catch (error) {
        console.error('Error al cargar el modelo:', error);
    }
};

export const obtenerHistorialCompleto = async (): Promise<{ fecha: string, promedio_caritas: number }[] | null> => {
    try {
        const connection = database.getConnection();
        if (!connection) {
            console.error('No se pudo obtener la conexión con la base de datos.');
            return null;
        }

        const [rows]: any = await connection.query(
            `SELECT DATE(created_at) as fecha, ROUND(AVG(caritas), 2) as promedio_caritas
             FROM user_estres_sessions
             WHERE caritas IS NOT NULL
             GROUP BY fecha
             ORDER BY fecha;`
        );

        if (rows.length < 14) {
            console.warn('No hay suficientes datos históricos para hacer predicciones.');
            return null;
        }

        return rows.map((row: any) => ({
            fecha: row.fecha,
            promedio_caritas: parseFloat(row.promedio_caritas)
        }));
    } catch (error) {
        console.error('Error al obtener datos de MySQL:', error);
        return null;
    }
};

export const predecirEstres = async (): Promise<{ historico: number[], prediccion: { fecha: string, caritas_predicho: number }[] } | null> => {
    if (!model) {
        console.error('El modelo no ha sido cargado. Intentando cargarlo nuevamente...');
        await cargarModelo();
        if (!model) {
            console.error('No se pudo cargar el modelo.');
            return null;
        }
    }

    const historial = await obtenerHistorialCompleto();
    if (!historial) return null;

    const caritas_values = historial.map(row => row.promedio_caritas);
    if (caritas_values.length < 7) return null;

    const X_input = tf.tensor3d([caritas_values.slice(-7).map(x => [x])], [1, 7, 1]);
    const prediccionTensor = model.predict(X_input) as tf.Tensor;
    const valoresPredichos = Array.from(prediccionTensor.dataSync());

    const fechaUltimaBD = new Date(historial[historial.length - 1].fecha);
    let nuevasPredicciones = valoresPredichos.map((valor, i) => {
        let fecha = new Date(fechaUltimaBD);
        fecha.setDate(fechaUltimaBD.getDate() + i + 1);
        return { fecha: fecha.toISOString().split('T')[0], caritas_predicho: valor };
    });

    return { historico: caritas_values.slice(-7), prediccion: nuevasPredicciones };
};


