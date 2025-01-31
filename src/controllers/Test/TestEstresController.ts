import { TestEstres } from "../../models/Test/test_estres";

class TestEstresController {
  async saveTestEstres(req: any, res: any) {
    try {
      const nuevaRespuesta = await TestEstres.create(req.body);
      res.status(200).json(nuevaRespuesta);
    } catch (error) {
      console.log(error); // Ver el error exacto
      res
        .status(400)
        .json({ error: "No se pudo guardar la respuesta del test de estrés." });
    }
  } 
  async getAllTestEstres(_req: any, res: any) {
    try {
      const respuestas = await TestEstres.findAll();
      res.status(200).json(respuestas);
    } catch (error) {
      res
        .status(500)
        .json({
          error: "No se pudieron recuperar las respuestas del test de estrés.",
        });
    }
  }
}
export default new TestEstresController();
