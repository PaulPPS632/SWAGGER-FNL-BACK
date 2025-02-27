import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execPromise = promisify(exec);

export const entrenarModeloRF = async (id_empresa: number) => {
    try {
        console.log(`entrenando modelo RandomForest para empresa ${id_empresa}...`);

        const scriptPath = path.resolve(__dirname, '../../modelo/modelo_entrenamiento.py');

        console.log(`ejecutando script en: ${scriptPath}`);

        const command = `python "${scriptPath}" ${id_empresa}`;

        const { stdout, stderr } = await execPromise(command);

        if (stderr) {
            console.error("error en la ejecución de Python:", stderr);
            return { error: "Error en el modelo." };
        }

        console.log("respuesta del entrenamiento:", stdout);
        return JSON.parse(stdout.replace(/\r\n|\r|\n/g, ''));
    } catch (error) {
        console.error('errr al entrenar el modelo:', error);
        return { error: "no se pudo entrenar el modelo." };
    }
};
