import { Op } from "sequelize";
import { Message } from "../../models/ChatBot/message";
import { User } from "../../models/User/user";
import axios from "axios";
import { UserPrograma } from "../../models/Program/userprograma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatMessage } from "../../interfaces/ChatMessage";
import { Activitys } from "../../models/Program/Activitys";
import { ActivityTags } from "../../models/Program/ActivityTags";
import { getKeyGemini } from "../../config/KeysGemini";
import { Imagenes } from "../../models/Program/Imagenes";
import { ActivityStudentTags } from "../../models/Program/ActivityStudentTags";
import { ActivityStudents } from "../../models/Program/ActivityStudents";

class OpenaiController {
  countTokens(text: string) {
    return text.split(" ").length;
  }
  //a futuro crear nueva clase para cada conexion a un modelo diferente. en esta clase solo se quedaria los insert y validacion de datos
  generateProgramsWithGemini = async (
    user_id: number,
    username: string,
    age_range: string,
    hierarchical_level: string,
    responsability_level: string,
    gender: string,
    estres_nivel: string,
    resumenRespuestas: string
  ) => {
    const apiKey = getKeyGemini();
    const genAI = new GoogleGenerativeAI(apiKey);
    const generationConfig = {
      responseMimeType: "application/json",
    };
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig,
    });

    const rangos = [
      {
        min: "1",
        max: "3",
        tipotecnica: "Tecnicas de Relajacion",
      },
      {
        min: "4",
        max: "7",
        tipotecnica: "Tecnicas de Relajacion",
      },
      {
        min: "8",
        max: "10",
        tipotecnica: "Reestructuracion Cognitiva",
      },
      {
        min: "11",
        max: "14",
        tipotecnica: "Reestructuracion Cognitiva",
      },
      {
        min: "15",
        max: "18",
        tipotecnica: "Técnicas de Programación Neurolingüística",
      },
      {
        min: "19",
        max: "21",
        tipotecnica: "Técnicas de Programación Neurolingüística",
      },
    ];
    for (const element of rangos) {
      const prompt = `
      Deberás tener encuenta la siguiente información, te servirá:
      Datos del usuario:
        - Nombre: ${username}
        - Edad: ${age_range}
        - Nivel jerárquico: ${hierarchical_level}
        - Nivel de responsabilidad: ${responsability_level}
        - Género: ${gender}
        - Nivel de estrés: ${estres_nivel}
  
        Respuestas al test de estrés:
        ${resumenRespuestas}
        Genera un programa personalizado para los días ${element.min} a ${element.max} siento el tipo de tecnica ${element.tipotecnica} asegurate de generar solo 1 programa por dia.
        Este programa debe:
        - Ser gradual y compatible con las actividades cotidianas del usuario.
        - Contener técnicas realizables sin necesidad de elementos externos.
        - Incluir un mínimo de 15 pasos detallados y fáciles de seguir por técnica.
  
        Responde en formato JSON estrictamente válido:
        [
          {
            "día": (número del día, tipo int),
            "nombre_técnica": "Nombre de la técnica",
            "tipo_técnica": "Subtítulo breve de la técnica",
            "descripción": "Inicia motivando al usuario por su nombre y explica regularmente la técnica.",
            "guía": ["Paso 1: Descripción del paso...", "Paso 2: Descripción del paso...", ..., "Paso 15: Descripción del paso..."]
          }
        ]
  
        Nota: Solo responde con el JSON válido, y sin saltos de linea ni \`\`\`, response un texto plano listo para parsear.
      `;
      let intentos = 0;
      let flag = false;
      while (intentos < 10 && !flag) {
        try {
          const result = await model.generateContent(prompt);
          console.log(
            `--------------------${element.min}-${element.max}-----------------------`
          );
          console.log(result.response.text());
          const resultGroup = JSON.parse(result.response.text());
          console.log(resultGroup);

          const registros = resultGroup.map((item: any) => ({
            user_id: user_id,
            dia: item.día,
            nombre_tecnica: item.nombre_técnica,
            tipo_tecnica: item.tipo_técnica,
            descripcion: item.descripción,
            guia: JSON.stringify(item.guía),
            start_date: item.día === 1 ? new Date() : null,
            completed_date: null,
            comentario: item.comentario || null,
            estrellas: item.estrellas || 3,
          }));
          await UserPrograma.bulkCreate(registros);
          flag = true;
        } catch (error: any) {
          console.log("error al parsear respuesta de gemini: ", error.message);
          intentos++;
        }
      }
    }
  };
  generateActivitys = async (tags: any, cant: number) => {
    try {
      const formattedTags = JSON.stringify(tags, null, 2);
      const prompt = `
      Genera ${cant} actividades técnicas psicológicas diseñadas para reducir el estrés laboral. Usa la información proporcionada a continuación para crear actividades efectivas:
  
      - **Tags relacionados**:
        ${formattedTags}
  
      - **Requisitos para la actividad**:
        - Debe ser gradual y compatible con las actividades cotidianas del usuario.
        - Contener técnicas realizables sin necesidad de elementos externos.
        - Incluir un mínimo de 15 pasos detallados y fáciles de seguir.
        - Cuando te dirigas al usuario usa la palabra 'USER'
        - Estas actividades deben poder ser realizadas en 5 a 10 minutos y en un espacio de trabajo como una oficina, evita actividades que requieran de un espacio amplio.
  
      **Formato de respuesta**: Devuelve estrictamente un JSON válido, sin saltos de línea, \`\`\`, ni texto adicional, listo para ser procesado. Usa el siguiente formato como plantilla:
  
      [
        {
          "nombre_tecnica": "Nombre de la técnica",
          "tipo_tecnica": "Subtítulo breve de la técnica",
          "descripcion": "Motiva al usuario usando su nombre y explica claramente la técnica.",
          "guia": [
            "Paso 1: Descripción del paso...",
            "Paso 2: Descripción del paso...",
            "...",
            "Paso 15: Descripción del paso..."
          ]
        }
      ]`;
  
      const apiKey = getKeyGemini();
      const genAI = new GoogleGenerativeAI(apiKey);
      const generationConfig = {
        responseMimeType: "application/json",
      };
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig,
      });
      let intentos = 0;
      let flag = false;
      let resultJSON;
      while (intentos < 10 && !flag) {
        try {
          const result = await model.generateContent(prompt);
          resultJSON = JSON.parse(result.response.text().trim());
          flag = true;
        } catch (error: any) {
          console.log("error al parsear respuesta de gemini: ", error.message);
          intentos++;
        }
      }
      const registros = await Activitys.bulkCreate(
        resultJSON.map((item: any) => ({
          nombre_tecnica: item.nombre_tecnica,
          tipo_tecnica: item.tipo_tecnica,
          descripcion: item.descripcion,
          guia: JSON.stringify(item.guia),
        }))
      );
  
      const activityTags: { activity_id: number; tags_id: number }[] = [];
      const imageUrls: { activity_id: number; imagen_url: string }[] = [];

      const filteredTags = tags.filter((tag: any) => tag.tipo === "Tipo Tecnica");
      const tagIds = filteredTags.map((tag: any) => tag.id);
      const images = await Imagenes.findAll({
        where: { tags_id: tagIds },
        order: [["id", "ASC"]],
      });

      registros.forEach((activity) => {
        tags.forEach((tag: any) => {
          activityTags.push({
            activity_id: activity.id,
            tags_id: tag.id,
          });
  
          const tagImages = images.filter((image) => image.tags_id === tag.id);
          if (tagImages.length > 0) {
            const randomIndex = Math.floor(Math.random() * tagImages.length); 
            imageUrls.push({
              activity_id: activity.id,
              imagen_url: tagImages[randomIndex].url,
            });
          }
        });
      });

      for (const imageUrl of imageUrls) {
        await Activitys.update(
          { imagen_url: imageUrl.imagen_url },
          { where: { id: imageUrl.activity_id } }
        );
      }
  
      await ActivityTags.bulkCreate(activityTags);
  
      return { cant, prompt, resultado: resultJSON };
    } catch (error) {
      console.error(error);
      return { error: error };
    }
  };

  generateActivityStudents = async (tags: any, cant: number) => {
    try {
      const formattedTags = JSON.stringify(tags, null, 2);
      const prompt = `
      Genera ${cant} actividades técnicas psicológicas diseñadas para reducir el estrés estudiantil. Usa la información proporcionada a continuación para crear actividades efectivas:
  
      - **Tags relacionados**:
        ${formattedTags}
  
      - **Requisitos para la actividad**:
        - Debe ser gradual y compatible con las actividades cotidianas del usuario.
        - Contener técnicas realizables sin necesidad de elementos externos.
        - Incluir un mínimo de 15 pasos detallados y fáciles de seguir.
        - Cuando te dirigas al usuario usa la palabra 'USER'
        - Estas actividades deben poder realizarse en 5 a 10 minutos y en un entorno común para estudiantes, como un aula, biblioteca, pasillo escolar o en casa. Evita actividades que requieran de un espacio amplio o equipamiento especializado.
  
      **Formato de respuesta**: Devuelve estrictamente un JSON válido, sin saltos de línea, \`\`\`, ni texto adicional, listo para ser procesado. Usa el siguiente formato como plantilla:
  
      [
        {
          "nombre_tecnica": "Nombre de la técnica",
          "tipo_tecnica": "Subtítulo breve de la técnica",
          "descripcion": "Motiva al usuario usando su nombre y explica claramente la técnica.",
          "guia": [
            "Paso 1: Descripción del paso...",
            "Paso 2: Descripción del paso...",
            "...",
            "Paso 15: Descripción del paso..."
          ]
        }
      ]`;
  
      const apiKey = getKeyGemini();
      const genAI = new GoogleGenerativeAI(apiKey);
      const generationConfig = {
        responseMimeType: "application/json",
      };
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig,
      });
      let intentos = 0;
      let flag = false;
      let resultJSON;
      while (intentos < 10 && !flag) {
        try {
          const result = await model.generateContent(prompt);
          resultJSON = JSON.parse(result.response.text().trim());
          flag = true;
        } catch (error: any) {
          console.log("error al parsear respuesta de gemini: ", error.message);
          intentos++;
        }
      }
      const registros = await ActivityStudents.bulkCreate(
        resultJSON.map((item: any) => ({
          nombre_tecnica: item.nombre_tecnica,
          tipo_tecnica: item.tipo_tecnica,
          descripcion: item.descripcion,
          guia: JSON.stringify(item.guia),
        }))
      );
  
      const activityTags: { activityStudentId: number; tagId: number }[] = [];
      const imageUrls: { activity_id: number; imagen_url: string }[] = [];

      const filteredTags = tags.filter((tag: any) => tag.tipo === "Tipo Tecnica");
      const tagIds = filteredTags.map((tag: any) => tag.id);
      const images = await Imagenes.findAll({
        where: { tags_id: tagIds },
        order: [["id", "ASC"]],
      });

      registros.forEach((activity) => {
        tags.forEach((tag: any) => {
          activityTags.push({
            activityStudentId: activity.id,
            tagId: tag.id,
          });
  
          const tagImages = images.filter((image) => image.tags_id === tag.id);
          if (tagImages.length > 0) {
            const randomIndex = Math.floor(Math.random() * tagImages.length); 
            imageUrls.push({
              activity_id: activity.id,
              imagen_url: tagImages[randomIndex].url,
            });
          }
        });
      });

      for (const imageUrl of imageUrls) {
        await ActivityStudents.update(
          { imagen_url: imageUrl.imagen_url },
          { where: { id: imageUrl.activity_id } }
        );
      }
  
      await ActivityStudentTags.bulkCreate(activityTags);
  
      return { cant, prompt, resultado: resultJSON };
    } catch (error) {
      console.error(error);
      return { error: error };
    }
  };
  
  
  generatePrograms = async (
    user_id: number,
    username: string,
    age_range: string,
    hierarchical_level: string,
    responsability_level: string,
    gender: string,
    estres_nivel: string,
    resumenRespuestas: string
  ) => {
    const apiKey = process.env.OPENAI_API_KEY;
    const url = "https://api.openai.com/v1/chat/completions";

    // Dividir prompts en tres partes
    const prompts = [
      {
        seccion: "Días 1-3",
        tipo: "Técnicas de relajación",
        prompt: `
          Genera un programa personalizado para los días 1 a 3 (Técnicas de Relajación).
          Este programa debe:
          - Ser gradual y compatible con las actividades cotidianas del usuario.
          - Contener técnicas realizables sin necesidad de elementos externos.
          - Incluir un mínimo de 15 pasos detallados y fáciles de seguir por técnica.
    
          Responde en formato JSON estrictamente válido:
          [
            {
              "día": (número del día, tipo int),
              "nombre_técnica": "Nombre de la técnica",
              "tipo_técnica": "Subtítulo breve de la técnica",
              "descripción": "Inicia motivando al usuario por su nombre y explica regularmente la técnica.",
              "guía": ["Paso 1: Descripción del paso...", "Paso 2: Descripción del paso...", ..., "Paso 15: Descripción del paso..."]
            }
          ]
    
          Nota: Solo responde con el JSON válido.
        `,
      },
      {
        seccion: "Días 4-6",
        tipo: "Técnicas de relajación",
        prompt: `
          Genera un programa personalizado para los días 4 a 6 (Técnicas de relajación).
          Este programa debe:
          - Ser gradual y compatible con las actividades cotidianas del usuario.
          - Contener técnicas realizables sin necesidad de elementos externos.
          - Incluir un mínimo de 15 pasos detallados y fáciles de seguir por técnica.
    
          Responde en formato JSON estrictamente válido:
          [
            {
              "día": (número del día, tipo int),
              "nombre_técnica": "Nombre de la técnica",
              "tipo_técnica": "Subtítulo breve de la técnica",
              "descripción": "Inicia motivando al usuario por su nombre y explica regularmente la técnica.",
              "guía": ["Paso 1: Descripción del paso...", "Paso 2: Descripción del paso...", ..., "Paso 15: Descripción del paso..."]
            }
          ]
    
          Nota: Solo responde con el JSON válido.
        `,
      },
      {
        seccion: "Días 7-9",
        tipo: "Reestructuación Cognitiva",
        prompt: `
          Genera un programa personalizado para los días 7 a 9 (Técnica de Reestructuación Cognitiva).
          Este programa debe:
          - Ser gradual y compatible con las actividades cotidianas del usuario.
          - Contener técnicas realizables sin necesidad de elementos externos.
          - Incluir un mínimo de 15 pasos detallados y fáciles de seguir por técnica.
    
          Responde en formato JSON estrictamente válido:
          [
            {
              "día": (número del día, tipo int),
              "nombre_técnica": "Nombre de la técnica",
              "tipo_técnica": "Subtítulo breve de la técnica",
              "descripción": "Inicia motivando al usuario por su nombre y explica regularmente la técnica.",
              "guía": ["Paso 1: Descripción del paso...", "Paso 2: Descripción del paso...", ..., "Paso 15: Descripción del paso..."]
            }
          ]
  
          Nota: Solo responde con el JSON válido.
        `,
      },
      {
        seccion: "Días 10-12",
        tipo: "Reestructuación Cognitiva",
        prompt: `
            Genera un programa personalizado para los días 10 a 12 (Técnica de Reestructuación Cognitiva).
            Este programa debe:
            - Ser gradual y compatible con las actividades cotidianas del usuario.
            - Contener técnicas realizables sin necesidad de elementos externos.
            - Incluir un mínimo de 15 pasos detallados y fáciles de seguir por técnica.
      
            Responde en formato JSON estrictamente válido:
            [
              {
                "día": (número del día, tipo int),
                "nombre_técnica": "Nombre de la técnica",
                "tipo_técnica": "Subtítulo breve de la técnica",
                "descripción": "Inicia motivando al usuario por su nombre y explica regularmente la técnica.",
                "guía": ["Paso 1: Descripción del paso...", "Paso 2: Descripción del paso...", ..., "Paso 15: Descripción del paso..."]
              }
            ]
    
            Nota: Solo responde con el JSON válido.
          `,
      },
      {
        seccion: "Días 13-15",
        tipo: "Reestructuación Cognitiva",
        prompt: `
            Genera un programa personalizado para los días 13 a 15 (Técnica de Reestructuación Cognitiva).
            Este programa debe:
            - Ser gradual y compatible con las actividades cotidianas del usuario.
            - Contener técnicas realizables sin necesidad de elementos externos.
            - Incluir un mínimo de 15 pasos detallados y fáciles de seguir por técnica.
      
            Responde en formato JSON estrictamente válido:
            [
              {
                "día": (número del día, tipo int),
                "nombre_técnica": "Nombre de la técnica",
                "tipo_técnica": "Subtítulo breve de la técnica",
                "descripción": "Inicia motivando al usuario por su nombre y explica regularmente la técnica.",
                "guía": ["Paso 1: Descripción del paso...", "Paso 2: Descripción del paso...", ..., "Paso 15: Descripción del paso..."]
              }
            ]
    
            Nota: Solo responde con el JSON válido.
          `,
      },
      {
        seccion: "Días 16-18",
        tipo: "Técnicas de PNL",
        prompt: `
            Genera un programa personalizado para los días 16 a 18 (Técnicas de PNL).
            Este programa debe:
            - Ser gradual y compatible con las actividades cotidianas del usuario.
            - Contener técnicas realizables sin necesidad de elementos externos.
            - Incluir un mínimo de 15 pasos detallados y fáciles de seguir por técnica.
      
            Responde en formato JSON estrictamente válido:
            [
              {
                "día": (número del día, tipo int),
                "nombre_técnica": "Nombre de la técnica",
                "tipo_técnica": "Subtítulo breve de la técnica",
                "descripción": "Inicia motivando al usuario por su nombre y explica regularmente la técnica.",
                "guía": ["Paso 1: Descripción del paso...", "Paso 2: Descripción del paso...", ..., "Paso 15: Descripción del paso..."]
              }
            ]
    
            Nota: Solo responde con el JSON válido.
          `,
      },
      {
        seccion: "Días 19-21",
        tipo: "Técnicas de PNL",
        prompt: `
            Genera un programa personalizado para los días 19 a 21 (Técnicas de PNL).
            Este programa debe:
            - Ser gradual y compatible con las actividades cotidianas del usuario.
            - Contener técnicas realizables sin necesidad de elementos externos.
            - Incluir un mínimo de 15 pasos detallados y fáciles de seguir por técnica.
      
            Responde en formato JSON estrictamente válido:
            [
              {
                "día": (número del día, tipo int),
                "nombre_técnica": "Nombre de la técnica",
                "tipo_técnica": "Subtítulo breve de la técnica",
                "descripción": "Inicia motivando al usuario por su nombre y explica regularmente la técnica.",
                "guía": ["Paso 1: Descripción del paso...", "Paso 2: Descripción del paso...", ..., "Paso 15: Descripción del paso..."]
              }
            ]
    
            Nota: Solo responde con el JSON válido.
          `,
      },
    ];

    for (const { seccion, prompt } of prompts) {
      let structuredPrompt = {
        role: "user",
        content: prompt,
      };

      let systemContext = {
        role: "system",
        content: `
        Para cada solicitud deberás tener encuenta la siguiente información, te servirá:
        
        Datos del usuario:
          - Nombre: ${username}
          - Edad: ${age_range}
          - Nivel jerárquico: ${hierarchical_level}
          - Nivel de responsabilidad: ${responsability_level}
          - Género: ${gender}
          - Nivel de estrés: ${estres_nivel}
    
          Respuestas al test de estrés:
          ${resumenRespuestas}
        
        `,
      };

      let gptResponse = await axios.post(
        url,
        {
          model: "gpt-4",
          messages: [systemContext, structuredPrompt],
          temperature: 0.2, // Respuestas más coherentes y precisas
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      const gptResponsedata =
        gptResponse.data.choices[0].message.content.trim();
      console.debug(`Respuesta de GPT para ${seccion}:`, gptResponsedata);
      // Validar y parsear JSON
      try {
        //Intentaremos subir la data tan pronto la tengamos lista.
        // programas.push(...JSON.parse(gptResponse));

        let resultGroup = JSON.parse(gptResponsedata);

        const registros = resultGroup.map((item: any) => ({
          user_id: user_id,
          dia: item.día,
          nombre_tecnica: item.nombre_técnica,
          tipo_tecnica: item.tipo_técnica,
          descripcion: item.descripción,
          guia: JSON.stringify(item.guía),
          start_date: item.día === 1 ? new Date() : null,
          completed_date: null,
          comentario: item.comentario || null,
          estrellas: item.estrellas || 3,
        }));

        // Insertar registros en la base de datos
        await UserPrograma.bulkCreate(registros);
      } catch (error) {
        console.error(`Error al parsear JSON para ${seccion}:`, error);
      }
    }
  };
  analyzeMessage = async (mensaje: any) => {
    const apiKey = process.env.OPENAI_API_KEY;
    const url = "https://api.openai.com/v1/chat/completions";

    const systemMessage = {
      role: "system",
      content: `
    Analiza el siguiente mensaje, de parte de los usuarios de nuestra app para ayuda psicológica en el trabajo:
    Responde en formato JSON estrictamente válido:
      {
        "sentimiento": "Positivo" (El mensaje tiene un tono optimista o alegre) o "Negativo" (El mensaje tiene un tono triste, enojado o preocupado) o "Neutral"(El mensaje no refleja emociones claras),
        "factor_psicosocial": "Relación interpersonal" (e.g., problemas con jefe o compañeros) o "Estrés laboral" (e.g., carga laboral, falta de tiempo) o "Salud emocional" (e.g., sentirse triste, desmotivado) o "Ninguno" (si el mensaje no menciona ningún factor específico),
      }
    `,
    };

    const message = {
      role: "user",
      content: mensaje,
    };

    try {
      const response = await axios.post(
        url,
        {
          model: "gpt-4",
          messages: [systemMessage, message],
          temperature: 0.2, // Respuestas más coherentes y precisas
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const rpta = JSON.parse(response.data.choices[0].message.content.trim());

      switch (rpta["sentimiento"]) {
        case "Negativo":
          rpta["score"] = -1;
          break;
        case "Positivo":
          rpta["score"] = 1;
          break;
        default: //Neutral
          rpta["score"] = 0;
          break;
      }

      rpta["message_length"] = mensaje.length;

      return rpta;
    } catch (error: any) {
      console.error(
        "Error al obtener respuesta del bot:",
        error.response?.data || error.message
      );
      throw new Error(
        `Error al obtener respuesta del bot: ${
          error.response?.data?.error?.message || error.message
        }`
      );
    }
  };
  getBotResponse = async (req: any, res: any) => {
    const { prompt, userId } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;
    const url = "https://api.openai.com/v1/chat/completions";
    const MAX_TOKENS = 100; // Máximo de tokens para la respuesta

    if (!prompt || typeof prompt !== "string") {
      throw new Error("Invalid prompt");
    }

    try {
      // Obtener el usuario por userId para obtener el username
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const username = user.username; // Obtiene el username

      // Obtener historial de mensajes del usuario
      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { user_id: userId, user_id_receptor: 1 },
            { user_id: 1, user_id_receptor: userId },
          ],
        },
        order: [["created_at", "ASC"]],
      });

      // Imprimir los mensajes obtenidos
      console.log("Mensajes obtenidos:", messages);

      // Convertir historial de mensajes a formato adecuado para OpenAI
      const chatHistory = messages.map((msg) => ({
        role: msg.user_id === userId ? "user" : "assistant",
        content: msg.content,
      }));

      // Imprimir el historial de chat
      console.log("Historial de chat formateado:", chatHistory);

      // Agregar el prompt actual al historial
      chatHistory.push({ role: "user", content: prompt });

      // Configurar el mensaje del sistema
      const systemMessage = {
        role: "system",
        content: `
        Tu nombre es Funcy, un asistente de IA especializado en apoyo psicológico y bienestar emocional. Tu propósito es ofrecer orientación comprensiva y práctica a ${username}, quien puede estar enfrentando estrés laboral o emocional. 
    
        **Instrucciones Clave**:
    
        1. **Escucha Activa**: Comienza cada interacción validando las emociones y experiencias de ${username}. Usa frases como "Entiendo que esto puede ser difícil para ti".
    
        2. **Diagnóstico Situacional**: Pregunta de manera clara y específica sobre la situación actual del usuario. Usa preguntas abiertas para comprender su contexto y preocupaciones: 
           - "¿Qué aspectos de tu trabajo te están causando más estrés en este momento?"
           - "¿Puedes compartir más sobre lo que te está preocupando?"
    
        3. **Técnicas Psicológicas Avanzadas**: Ofrece técnicas basadas en evidencia, como:
           - **Reestructuración Cognitiva**: Ayuda a identificar y desafiar pensamientos negativos. Ejemplo: "¿Has considerado cómo tus pensamientos pueden estar influyendo en tu estrés? Vamos a explorar eso juntos".
           - **Técnicas de Regulación Emocional**: Propón métodos como la identificación de emociones y su regulación. Ejemplo: "Reconocer tus emociones es el primer paso para gestionarlas. ¿Qué emociones estás sintiendo ahora mismo?"
    
        4. **Acciones Concretas**: Brinda recomendaciones claras y específicas que el usuario pueda implementar. Por ejemplo:
           - "Dedica unos minutos a escribir tus pensamientos sobre la situación. Esto puede ayudarte a clarificar tus sentimientos".
           - "Considera establecer límites claros en el trabajo. ¿Cómo podrías hacerlo en tu caso?"
    
        5. **Fomento de la Resiliencia**: Ofrece estrategias para desarrollar habilidades de afrontamiento. Por ejemplo:
           - "Practicar el autocuidado regular es vital. ¿Qué actividades disfrutas que podrían ayudarte a relajarte y recuperar energías?"
    
        6. **Seguimiento y Apoyo Continuo**: Cierra cada sesión con un recordatorio de que estás ahí para apoyarlo. Por ejemplo:
           - "Recuerda que puedes volver aquí siempre que necesites hablar. Estoy aquí para ayudarte en este proceso."
    
        Evita sugerencias superficiales o generales. Cada respuesta debe ser rica en contenido, relevante y orientada a la acción, asegurando que ${username} sienta que está recibiendo apoyo práctico y emocional de calidad.
      `,
      };

      // Limitar el historial a solo los mensajes más recientes para que no supere el límite de tokens
      let totalTokens = this.countTokens(systemMessage.content) + MAX_TOKENS;
      const limitedChatHistory = [];

      for (let i = chatHistory.length - 1; i >= 0; i--) {
        const messageTokens = this.countTokens(chatHistory[i].content);
        if (totalTokens + messageTokens <= 4096) {
          // Asegúrate de que no supere el límite
          limitedChatHistory.unshift(chatHistory[i]);
          totalTokens += messageTokens;
        } else {
          break; // Detén la iteración si se excede el límite
        }
      }

      // Mensaje de éxito para la lectura del historial
      console.log("Historial leído correctamente:", limitedChatHistory);

      // Enviar todo el historial limitado y el mensaje del sistema en una sola solicitud
      const response = await axios.post(
        url,
        {
          model: "gpt-4",
          messages: [systemMessage, ...limitedChatHistory],
          max_tokens: 1500, // Permitir respuestas más largas
          temperature: 0.2, // Respuestas más coherentes y precisas
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      return res.json({
        response: response.data.choices[0].message.content.trim(),
      });
    } catch (error: any) {
      console.error(
        "Error al obtener respuesta del bot:",
        error.response?.data || error.message
      );
      throw new Error(
        `Error al obtener respuesta del bot: ${
          error.response?.data?.error?.message || error.message
        }`
      );
    }
  };
  analyzeMessageWithGemini = async (mensaje: any) => {
    const apiKey = getKeyGemini();

    const prompt = `
    Analiza el siguiente mensaje, de parte de los usuarios de nuestra app para ayuda psicológica en el trabajo:
    ${mensaje}

    -Responde en formato JSON estrictamente válido, response un texto plano listo para parsear usando JSON.parse(), el formato es el siguiente:
      {
        "sentimiento": "Positivo" (El mensaje tiene un tono optimista o alegre) o "Negativo" (El mensaje tiene un tono triste, enojado o preocupado) o "Neutral"(El mensaje no refleja emociones claras),
        "factor_psicosocial": "Relación interpersonal" (e.g., problemas con jefe o compañeros) o "Estrés laboral" (e.g., carga laboral, falta de tiempo) o "Salud emocional" (e.g., sentirse triste, desmotivado) o "Ninguno" (si el mensaje no menciona ningún factor específico),
      }
    `;

    try {
      const genAI = new GoogleGenerativeAI(apiKey);

      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1500,
        responseMimeType: "application/json",
      };
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        generationConfig,
      });
      const result = await model.generateContent(prompt);

      console.log(result.response.text());
      const rpta = JSON.parse(result.response.text());

      switch (rpta["sentimiento"]) {
        case "Negativo":
          rpta["score"] = -1;
          break;
        case "Positivo":
          rpta["score"] = 1;
          break;
        default: //Neutral
          rpta["score"] = 0;
          break;
      }

      rpta["message_length"] = mensaje.length;
      console.log("analisis: ", rpta);
      return rpta;
    } catch (error: any) {
      console.error(
        "Error al obtener respuesta del bot:",
        error.response?.data || error.message
      );
      throw new Error(
        `Error al obtener respuesta del bot: ${
          error.response?.data?.error?.message || error.message
        }`
      );
    }
  };
  chat = async (req: any, res: any) => {
    const { prompt, userId } = req.body;
    const apiKey = getKeyGemini();
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
      // Obtener el usuario por userId para obtener el username
      const user = await User.findByPk(userId);

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const username = user.username;

      const messages = await Message.findAll({
        where: {
          [Op.or]: [{ user_id: userId }, { user_id_receptor: userId }],
        },

        offset: 2,
      });
      let chatHistory: ChatMessage[] = [];
      if (messages.length !== 0) {
        chatHistory = messages.map((msg) => ({
          role: msg.user_id === userId ? "user" : "model",
          parts: [{ text: msg.content }],
        }));
      }
      const systemMessage = `
Tu nombre es Funcy, una IA entrenada exclusivamente para ofrecer apoyo psicológico y manejo del estrés laboral a ${username}. Tu propósito es proporcionar orientación empática, práctica y basada en evidencia para reducir el estrés relacionado con el trabajo.

**Instrucciones Clave:**

1. **Identidad Fija:** Eres Funcy, una IA especializada en apoyo psicológico para el estrés laboral. Si te preguntan quién eres, responde: "Soy Funcy, una IA diseñada para ayudarte con el estrés laboral."
2. **Validación Emocional:** Reconoce y valida las emociones del usuario. Ejemplo: "Entiendo que la presión en el trabajo puede sentirse abrumadora."
3. **Enfoque en Soluciones:** Proporciona estrategias prácticas y específicas de inmediato, sin hacer preguntas. Ejemplo: "Para manejar la carga laboral, prueba priorizar tareas y tomar pausas cortas de 5 minutos cada hora."
4. **Técnicas Basadas en Evidencia:** Utiliza métodos como reestructuración cognitiva, regulación emocional o técnicas de afrontamiento laboral. Ejemplo: "Identificar una tarea clave y completarla primero puede darte una sensación de control."
5. **Consejos Prácticos:** Ofrece recomendaciones claras y aplicables. Ejemplo: "Hablar con tu jefe para ajustar plazos puede reducir la presión."
6. **Refuerzo Positivo:** Promueve la resiliencia y el autocuidado. Ejemplo: "Dedicar tiempo a desconectar del trabajo te ayudará a recargar energías."
7. **Cierre de Apoyo:** Finaliza cada interacción reafirmando tu disponibilidad. Ejemplo: "Estoy aquí para ayudarte con el estrés laboral cuando lo necesites."

**Análisis Requerido:**
- **Sentimiento:** Identifica el sentimiento expresado (Positivo, Negativo, Neutral).
- **Factor Psicosocial:** Determina la causa principal del estrés laboral, seleccionando entre: Carga de trabajo, Falta de control y autonomía, Inseguridad laboral, Jornadas laborales excesivas, Relaciones interpersonales conflictivas, Estilo de liderazgo inadecuado, Falta de reconocimiento y recompensa, Condiciones físicas y ambientales inadecuadas, Desequilibrio trabajo-vida personal, Causas externas, Ninguno.

**Estructura del JSON de Respuesta:**
{
    "respuesta": "...",
    "analisis": {
        "sentimiento": "Positivo" | "Negativo" | "Neutral",
        "factor_psicosocial": "Carga de trabajo" | "Falta de control y autonomía" | "Inseguridad laboral" | "Jornadas laborales excesivas" | "Relaciones interpersonales conflictivas" | "Estilo de liderazgo inadecuado" | "Falta de reconocimiento y recompensa" | "Condiciones físicas y ambientales inadecuadas" | "Desequilibrio trabajo-vida personal" | "Causas externas" | "Ninguno"
    }
}

**Modo de Respuesta:**
- Responde en formato JSON estrictamente válido.
- Limítate exclusivamente a temas de estrés laboral. Si el mensaje no está relacionado con estrés laboral, responde únicamente: "Lo siento, soy Funcy, y solo puedo ayudarte con temas relacionados con el estrés laboral."
- No hagas preguntas bajo ninguna circunstancia, incluso si parece necesario para clarificar.

**Consideraciones Adicionales:**
- **Empatía:** Asegura que las respuestas sean reconfortantes y centradas en soluciones prácticas.
- **Confidencialidad:** No solicites información personal ni detalles sensibles.
- **Limitaciones:** No respondas a temas fuera del estrés laboral. Usa la respuesta estándar para cualquier tema no relacionado.

**Ejemplo de Interacción Válida:**
**Usuario:** Estoy agotado porque mi jefe me asignó más tareas y no tengo tiempo para nada.
**Respuesta:**
{
    "respuesta": "Entiendo que la sobrecarga de tareas puede ser agotadora. Para manejarlo, prueba dividir tus tareas en bloques pequeños y tomar pausas cortas para recargar. También podrías discutir con tu jefe la priorización de tareas. Estoy aquí para ayudarte con el estrés laboral cuando lo necesites.",
    "analisis": {
        "sentimiento": "Negativo",
        "factor_psicosocial": "Carga de trabajo"
    }
}

**Ejemplo de Interacción No Relacionada:**
**Usuario:** ¿Cuánto es 2+2?
**Respuesta:**
{
    "respuesta": "Lo siento, soy Funcy, y solo puedo ayudarte con temas relacionados con el estrés laboral.",
    "analisis": {
        "sentimiento": "Neutral",
        "factor_psicosocial": "Ninguno"
    }
}
`;


      console.log(systemMessage)
      const generationConfig = {
        responseMimeType: "application/json",
        maxOutputTokens: 1500,
        temperature: 0.5,
      };
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-8b",
        systemInstruction: systemMessage,
      });
      console.log(chatHistory);
      const chat = model.startChat({
        history: chatHistory.length > 0 ? chatHistory : undefined,
        generationConfig
      });

      const result = await chat.sendMessage(prompt);

      if (!result) return res.status(500).json({ message: "error al consultar Gemini" });
      const responseGemini = result.response.text();
      const reponseJSON = JSON.parse(responseGemini);
      
      //const analisis = await this.analyzeMessageWithGemini(prompt);
      let score = 0;
      switch (reponseJSON.analisis.sentimiento) {
        case "Negativo":
          score = -1;
          break;
        case "Positivo":
          score = 1;
          break;
        default: //Neutral
          score = 0;
          break;
      };
      const message_length = prompt.length;

      await Message.bulkCreate([
        {
          content: prompt,
          user_id: userId,
          user_id_receptor: 1,
          score,
          message_length,
          factor_psicosocial: reponseJSON.analisis.factor_psicosocial,
          sentimientos: reponseJSON.analisis.sentimiento,
        },
        {
          content: reponseJSON.respuesta,
          user_id: 1,
          user_id_receptor: userId, // Incrementar 1 ms
        },
      ]);
      return res.status(201).json({
        response: reponseJSON.respuesta,
        apikey: apiKey,
        respuesta: reponseJSON
      });

      //chatHistory.push({ role: "user", parts:[{text:prompt}] });
    } catch (error: any) {
      console.log("error: ", error.message);
    }
  };
}
export default new OpenaiController();
