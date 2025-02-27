import axios from "axios";

export const predictStress = async (empresaId: number): Promise<any> => {
    try {
        console.log(`solicitando predicción para empresa_id: ${empresaId}`);

        const response = await axios.get(`http://127.0.0.1:8000/predict?id_empresa=${empresaId}`);
        return response.data;

    } catch (error: any) {
        console.error("wrror en la predicción:", error.message || error);
        throw new Error("no se pudo obtener la predicción");
    }
};
