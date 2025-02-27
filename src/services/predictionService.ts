import axios from "axios";

export const predictStress = async (): Promise<any> => {
    try {
        const response = await axios.get("http://127.0.0.1:8000/predict");
        return response.data;
    } catch (error) {
        console.error("Error en la predicción:", error);
        throw new Error("No se pudo obtener la predicción");
    }
};
