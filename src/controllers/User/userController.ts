import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../models/User/user";
import path from "path";
import fs from "fs";
import { UserResponses } from "../../models/User/user_responses";
import { Hierarchical_level } from "../../models/User/hierarchical_level";
import { AgeRange } from "../../models/User/ageRange";
import Sequelize from "sequelize";
import { readFile, utils } from "xlsx";
import { generarPassword } from "../../utils/utils";

import { emailQueue } from "../../services/EmailQueue";
import { Message } from "../../models/ChatBot/message";
import { UserEstresSession } from "../../models/Clasificacion/userestressession";
import { Role } from "../../models/User/role";
import { Empresas } from "../../models/Global/empresas";
import { Gender } from "../../models/User/gender";
import { Area } from "../../models/User/area";
import { Sedes } from "../../models/User/sedes";

import { Op } from "sequelize";
import { Ciclo } from "../../models/User/ciclo";
import { StudentsResponses } from "../../models/User/studentsresponses";


class UserController {
  async login(req: any, res: any) {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({
        where: { username },
        include: [{ model: Role, as: 'role' },
          {model: Empresas, as: 'empresa' }
        ]
      });
      if (!user) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }
      if (!user.role) {
        return res.status(403).json({ error: "El usuario no tiene un rol asignado" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }
  
      const jwt_secret = process.env.JWT_SECRET || "";
      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role.name },
        jwt_secret,
        { expiresIn: "1h" }
      );
  
      return res.status(200).json({
        message: "Login exitoso",
        token,
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role.name,
        permisopoliticas: user.permisopoliticas,
        studentresponsebool: user.studentresponsebool,
        testestresbool: user.testestresbool,
        id_empresa: user.empresa_id,
        nombre_empresa: user.empresa.nombre,
        activo: user.activo
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
  

  async createUser(req: any, res: any) {
    const { username, password, email, empresa_id, role_id } = req.body;
    const file = req.file;

    const activo = true;
    
    try {
      if (!username || !password || !email || !role_id) {
        return res
          .status(400)
          .json({ error: "Todos los campos son obligatorios" });
      }
      
      const existingUser = await User.findOne({
          where: {
              [Op.or]: [{ username }, { email }]
          }
      });

      if (existingUser) {
          return res.status(409).json({ error: "El nombre de usuario o el correo ya están en uso" });
      }

      let profileImagePath = null;
      if (file) {
        const uploadDir = path.join(__dirname, "../imagenes");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        profileImagePath = `/imagenes/${file.filename}`;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        password: hashedPassword,
        email,
        profileImage: profileImagePath,
        created_at: new Date(),
        empresa_id,
        role_id,
        activo,
      });

      res
        .status(201)
        .json({ message: "Usuario creado correctamente.", data: user });
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }

  async getUserProfile(req: any, res: any) {
    try {
      const userProfile = await UserResponses.findOne({
        where: { user_id: req.params.id },
        include: [
          { model: User, attributes: ["username", "email", "profileImage", "empresa_id", "role_id"] },
          { model: Hierarchical_level, attributes: ["level"] },
          { model: AgeRange, attributes: ["age_range"] },
          { model: Gender, attributes: ["gender"] },
        ],
      });
  
      if (!userProfile) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
  
      // Obtener nivel de estrés si existe
      let userEstres = await UserEstresSession.findOne({
        where: { user_id: req.params.id },
        attributes: ["estres_nivel_id"],
      });
  
      // Obtener las fechas de mensajes enviados por el usuario
      const messageUserDates = await Message.findAll({
        where: { user_id: req.params.id },
        attributes: [[Sequelize.fn("DATE", Sequelize.col("created_at")), "unique_date"]],
        group: [Sequelize.fn("DATE", Sequelize.col("created_at"))],
        order: [[Sequelize.fn("DATE", Sequelize.col("created_at")), "ASC"]],
      });
  
      // Cálculo de días no usados
      const now = new Date();
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const dias_usados = messageUserDates.length || 0;
      const dias_no_usados = endDate.getDate() - dias_usados;
  
      // Respuesta JSON con datos seguros
      return res.json({
        username: userProfile.user?.username || "Sin nombre",
        email: userProfile.user?.email || "Sin email",
        hierarchicalLevel: userProfile.hierarchical_level?.level || "No especificado",
        age_range: userProfile.age_range?.age_range || "No especificado",
        gender: userProfile.gender?.gender || "No especificado",
        profileImage: userProfile.user?.profileImage || null,
        id_empresa: userProfile.user?.empresa_id || null,
        role_id: userProfile.user?.role_id || null,
        nivel_estres: userEstres?.estres_nivel_id || "No completó el test",
        dias_usados,
        dias_no_usados,
      });
    } catch (error) {
      console.error("Error al obtener el perfil de usuario:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getStudentProfile(req: any, res: any) {
    try {
      const userId = req.params.id;

      // Buscar perfil del estudiante en StudentsResponses
      let studentProfile = await StudentsResponses.findOne({
        where: { user_id: userId },
        include: [
          {
            model: User,
            attributes: ["username", "email", "profileImage", "empresa_id", "role_id"]
          },
          {
            model: Ciclo,
            attributes: ["ciclo"]
          },
          {
            model: AgeRange,
            attributes: ["age_range"]
          },
          {
            model: Gender,
            attributes: ["gender"]
          }
        ]
      });

      if (!studentProfile) {
        let studentProfile = await User.findOne({
          where: { id: userId },
        });

        if (!studentProfile) {
          return res.status(404).json({ error: "Usuario no encontrado" });
        }


        return res.json({
          username: studentProfile.username || "Sin nombre",
          email: studentProfile.email || "Sin email",
          ciclo: "No especificado",
          age_range: "No especificado",
          gender: "No especificado",
          profileImage: studentProfile.profileImage || null,
          id_empresa: studentProfile.empresa_id || null,
          role_id: studentProfile.role_id || null,
          nivel_estres: "No completó el test",
          dias_usados: "No Usado",
          dias_no_usados: "No Usado"
        });

      }

      // Obtener el último nivel de estrés registrado
      const userEstres = await UserEstresSession.findOne({
        where: { user_id: userId },
        attributes: ["estres_nivel_id"],
        order: [["created_at", "DESC"]] // por si hay más de uno, toma el más reciente
      });

      // Fechas en las que el usuario envió mensajes (únicas por día)
      const messageUserDates = await Message.findAll({
        where: { user_id: userId },
        attributes: [[Sequelize.fn("DATE", Sequelize.col("created_at")), "unique_date"]],
        group: [Sequelize.fn("DATE", Sequelize.col("created_at"))],
        order: [[Sequelize.fn("DATE", Sequelize.col("created_at")), "ASC"]]
      });

      // Cálculo de días usados y no usados en el mes actual
      const now = new Date();
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const dias_usados = messageUserDates.length;
      const dias_no_usados = endDate.getDate() - dias_usados;

      // Armar respuesta final
      return res.json({
        username: studentProfile.user?.username || "Sin nombre",
        email: studentProfile.user?.email || "Sin email",
        ciclo: studentProfile.ciclo?.ciclo || "No especificado",
        age_range: studentProfile.age_range?.age_range || "No especificado",
        gender: studentProfile.gender?.gender || "No especificado",
        profileImage: studentProfile.user?.profileImage || null,
        id_empresa: studentProfile.user?.empresa_id || null,
        role_id: studentProfile.user?.role_id || null,
        nivel_estres: userEstres?.estres_nivel_id || "No completó el test",
        dias_usados,
        dias_no_usados
      });

    } catch (error) {
      console.error("Error al obtener el perfil del estudiante:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
  

  async updateProfile(req: any, res: any) {
    const { id } = req.params;
    const { username, email, role_id } = req.body;

    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      if (username) user.username = username;
      if (email) user.email = email;
      if (role_id) user.role_id = role_id; 

      if (req.file) {
        const newProfileImagePath = `/imagenes/${req.file.filename}`;
        user.profileImage = newProfileImagePath;
      }

      await user.save();
      res
        .status(200)
        .json({ message: "Perfil actualizado correctamente.", data: user });
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }

  async getAllUsers(_req: any, res: any) {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      res.status(500).json({ error: "Error al obtener los usuarios" });
    }
  }

  async updateUser(req: any, res: any) {
    const { id } = req.params;
    const {
      username,
      email,
      password,
      permisopoliticas,
      funcyinteract,
      userresponsebool,
      studentresponsebool,
      testestresbool,
      role_id,
    } = req.body;

    try {
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      if (username) user.username = username;
      if (email) user.email = email;
      if (password) user.password = await bcrypt.hash(password, 10);
      if (permisopoliticas !== undefined)
        user.permisopoliticas = permisopoliticas;
      if (funcyinteract !== undefined) user.funcyinteract = funcyinteract;

      if (userresponsebool !== undefined) {
        user.userresponsebool =
          userresponsebool === true || userresponsebool === "true";
      }

      if (studentresponsebool !== undefined) {
        user.studentresponsebool =
        studentresponsebool === true || studentresponsebool === "true";
      }

      if (testestresbool !== undefined) {
        user.testestresbool =
          testestresbool === true || testestresbool === "true";
      }

      if (role_id) user.role_id = role_id;

      await user.save();

      res
        .status(200)
        .json({ message: "Usuario actualizado correctamente", data: user });
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getUserById(req: any, res: any) {
    const { id } = req.params;

    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }


  async registerBulk(req: any,res: any){
    try {
      const { empresa_id } = req.query;
      if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
      }

      // Leer el archivo subido
      const filePath = req.file.path;
      const workbook = readFile(filePath);
      const sheetName = workbook.SheetNames[0]; // Seleccionar la primera hoja
      const sheetData = utils.sheet_to_json(workbook.Sheets[sheetName]);

      const cant_user = await User.count({where: {empresa_id: empresa_id}}) //cantidad de usuarios que tiene actualmente

      //validar la cantidad maxima de usuarios a registrar
      const MAX_USERS = 53 - cant_user;

      if (sheetData.length > MAX_USERS) {
          return res.status(400).json({
              message: `Solo puede registrar ${MAX_USERS}, el archivo contiene más de ${MAX_USERS} usuarios. Por favor, reduzca la cantidad.`,
          });
      }

      const cargosDB = await Hierarchical_level.findAll({
          include: [{ model: Area, where: { empresa_id } }]
      });

      const sedesDB = await Sedes.findAll({ where: { empresa_id } });

      // Mapas para buscar rápido
      const cargoMap = new Map();
      cargosDB.forEach(c => cargoMap.set(`${c.level.toLowerCase()}|${c.area.area.toLowerCase()}`, c.id));

      const sedeMap = new Map();
      sedesDB.forEach(s => sedeMap.set(s.sede.toUpperCase(), s.id)); // Convertir a minúsculas


      // Filtrar las columnas necesarias
      const extractedData = await Promise.all(
          sheetData.map(async (row: any) => {
              const password = generarPassword(8);
              const hashedPassword = await bcrypt.hash(password, 10);

              // Validar Cargo y Sede
              const cargoKey = `${row.Cargo.toLowerCase()}|${row.Area.toLowerCase()}`;
              if (!cargoMap.has(cargoKey)) {
                  throw new Error(`Cargo o área inválidos: ${row.Cargo} - ${row.Area}`);
              }
              const hierarchical_level_id = cargoMap.get(cargoKey);

              if (!sedeMap.has(row.Sede.toUpperCase())) {
                  throw new Error(`Sede inválida: ${row.Sede}`);
              }
              const sede_id = sedeMap.get(row.Sede.toUpperCase());
              
              const [apellidos, nombres] = row["Apellidos, Nombres"].split(", ");
              const nombre = nombres.split(" ")[0]; // Primer nombre
              const apellido = apellidos.split(" ")[0]; // Primer apellido

              // Crear un username usando las primeras letras de ambos
              const username = `${apellido.toLowerCase().slice(0, 4)}${nombre.toLowerCase().slice(0, 4)}`;


              return {
                  username: username,
                  email: row.Correo,
                  password,
                  hashedPassword,
                  empresa_id,
                  hierarchical_level_id,
                  sede_id
              };
          })
      );

      const uniqueUsernames = new Set();
      const uniqueEmails = new Set();
      const duplicatesInFile = extractedData.filter((item) => {
        const isDuplicate = uniqueUsernames.has(item.username) || uniqueEmails.has(item.email);
        uniqueUsernames.add(item.username);
        uniqueEmails.add(item.email);
        return isDuplicate;
      });

      if (duplicatesInFile.length > 0) {
        return res.status(400).json({
          message: "Hay usuarios o correos duplicados en el archivo.",
          duplicatesInFile,
        });
      }

      const usernames = extractedData.map((item) => item.username);
      const emails = extractedData.map((item) => item.email);

      const usuariosExistentes = await User.findAll({
        where: {
            [Op.or]: [
                { username: { [Op.in]: usernames } },
                { email: { [Op.in]: emails } },
            ],
        },
      });

      if (usuariosExistentes.length > 0) {
        const duplicatesInDb = usuariosExistentes.map((usuario) => ({
            username: usuario.username,
            email: usuario.email,
        }));

        return res.status(400).json({
            message: "Hay usuarios o correos que ya existen en la base de datos.",
            duplicatesInDb,
        });
      }
      await User.bulkCreate( extractedData.map(({password, ...rest}) => ({
        ...rest,
        password: rest.hashedPassword,
        role_id: 1,
      })));

      const responseUsers = extractedData.map(user => ({
        username: user.username,
        password: user.password,  // Contraseña no encriptada
        email: user.email
      }));
  

      extractedData.forEach((user) => {
          console.log("enviado a bull")
          emailQueue.add({
            email: user.email,
            subject: "Bienvenido a la Experiencia: Reduzca su Estrés Laboral con FNL",
            body: `
              <p>Estimados participantes,</p>
              <p>Es un gusto saludarlos y darles la bienvenida al Piloto de la Versión 3 del App FNL (Funcional Neuro Laboral), cuyo objetivo es contribuir a la reducción del estrés laboral y mejorar el bienestar en el entorno de trabajo.</p>
              <p>Agradecemos su participación en esta fase de prueba, que nos permitirá seguir optimizando la herramienta. Según lo coordinado, adjuntamos sus credenciales de acceso: </p>
              <p>Usuario: ${user.username}</p>
              <p>Password: ${user.password}</p>
              <p>Las cuales estarán activas a partir de la próxima semana para que puedan comenzar a utilizar el aplicativo.</p>
              <p>Para el éxito de este piloto, su participación activa es clave. Por ello, hemos creado un grupo de WhatsApp para facilitar la comunicación, resolver dudas y compartir experiencias. Los invitamos a unirse a través del siguiente enlace:</p>
              <p><strong>🔗 <a href="https://chat.whatsapp.com/IMs4NVM66XdBqzgK5MxhWW">Unirse al grupo de WhatsApp</a></strong></p>
              <p>Nuevamente, gracias por ser parte de esta iniciativa. Quedamos atentos a sus comentarios y sugerencias.</p>
              <p>Saludos cordiales,</p>
              <p><strong>Javier Ruiz Santamaría</strong><br>CEO Fundador de FNL</p>
            `
          }, { attempts: 3 })
      })


      return res.status(200).json({ 
        message: `${extractedData.length} Usuarios registrados exitosamente.`,
        users: responseUsers // Array con los usuarios registrados, contraseñas no encriptadas y correos
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error processing file", error });
    }
  }
  

  async listCompanyUsers(req: any, res: any) {
    try {
      const userId = req.userId?.userId;
      if (!userId) {
          return res.status(400).json({ message: 'User ID is missing or invalid' });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (Number(page) - 1) * Number(limit);

      const currentUser = await User.findByPk(userId);
      if (!currentUser) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      
      // Define base where clause
      const whereClause = {
        empresa_id: currentUser.empresa_id,
        role_id: 1, // Excluir Administradores
        id: { [Op.notIn]: [1] } // Excluir Fancy
      };

      // Get all company locations (sedes) - corrected query
      const companyLocations = await Sedes.findAll({
        attributes: ['sede'],
        where: {
            empresa_id: currentUser.empresa_id
        },
        raw: true
    });
  
      // Execute count and find in parallel
      const [totalUsers, users] = await Promise.all([
        User.count({ where: whereClause }),
        User.findAll({
          attributes: ['id', 'username', 'email'],
          where: whereClause,
          include: [
            {
              model: UserResponses,
              required: false,
              attributes: [],
              include: [
                {
                  model: Hierarchical_level,
                  attributes: ['level'],
                  required: false
                },
                {
                  model: Sedes,
                  attributes: ['sede'],
                  required: false
                }
              ]
            },
            {
              model: UserEstresSession,
              attributes: [
                [Sequelize.fn('COALESCE', Sequelize.col('estres_nivel_id'), 0), 'estres_nivel_id']
              ],
              required: false
            }
          ],
          limit: Number(limit),
          offset,
          raw: true,
          nest: true
        }).then(users => {
          // Ordenar los resultados manualmente en caso de que el ORDER de Sequelize no sea suficiente
          return users.sort((a, b) => (b.userestressessions.estres_nivel_id ?? 0) - (a.userestressessions.estres_nivel_id ?? 0));
        })
      ]);

      return res.status(200).json({
          users: users.map(user => ({
              id: user.id,
              username: user.username,
              email: user.email,
              cargo: user.userresponses?.hierarchical_level?.level || 'Sin asignar',
              sede: user.userresponses?.sedes?.sede || 'Sin asignar',
              estres_nivel: user.userestressessions?.estres_nivel_id || 0,
          })),
          pagination: {
              total: totalUsers,
              page: Number(page),
              pages: Math.ceil(totalUsers / Number(limit))
          },
          sedes: companyLocations.map(location => location.sede)
      });

    } catch (error: any) {
        console.error('Error en listCompanyUsers:', error);
        return res.status(500).json({
            message: 'Error al obtener los usuarios',
            error: error.message
        });
    }
  }

  async listCompanyStudents(req: any, res: any) {
    try {
      const userId = req.userId?.userId;
      if (!userId) {
          return res.status(400).json({ message: 'User ID is missing or invalid' });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (Number(page) - 1) * Number(limit);

      const currentUser = await User.findByPk(userId);
      if (!currentUser) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      
      // Define base where clause
      const whereClause = {
        empresa_id: currentUser.empresa_id,
        role_id: 4, // Excluir Administradores
        id: { [Op.notIn]: [1] } // Excluir Fancy
      };


      // Execute count and find in parallel
      const [totalUsers, users] = await Promise.all([
        User.count({ where: whereClause }),
        User.findAll({
          attributes: ['id', 'username', 'email'],
          where: whereClause,
          include: [
            {
              model: StudentsResponses,
              required: false,
              attributes: ['seccion'],
              include: [
                {
                  model: Ciclo,
                  attributes: ['ciclo'],
                  required: false
                }
              ]
            },
            {
              model: UserEstresSession,
              attributes: [
                [Sequelize.fn('COALESCE', Sequelize.col('estres_nivel_id'), 0), 'estres_nivel_id']
              ],
              required: false
            }
          ],
          limit: Number(limit),
          offset,
          raw: true,
          nest: true
        }).then(users => {
          // Ordenar los resultados manualmente en caso de que el ORDER de Sequelize no sea suficiente
          return users.sort((a, b) => (b.userestressessions.estres_nivel_id ?? 0) - (a.userestressessions.estres_nivel_id ?? 0));
        })
      ]);

      return res.status(200).json({
          users: users.map(user => ({
              id: user.id,
              username: user.username,
              email: user.email,
              ciclo: user.studentresponses?.ciclo?.ciclo || 'Sin asignar',
              seccion: user.studentresponses?.seccion || 'Sin asignar',
              estres_nivel: user.userestressessions?.estres_nivel_id || 0,
          })),
          pagination: {
              total: totalUsers,
              page: Number(page),
              pages: Math.ceil(totalUsers / Number(limit))
          },
      });

    } catch (error: any) {
        console.error('Error en listCompanyUsers:', error);
        return res.status(500).json({
            message: 'Error al obtener los usuarios',
            error: error.message
        });
    }
  }

  async listEstresporSede(req: any, res: any) {
    try {
      const userId = req.userId?.userId;
      if (!userId) {
          return res.status(400).json({ message: 'User ID is missing or invalid' });
      }

      const currentUser = await User.findByPk(userId);
      if (!currentUser) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Definir cláusula WHERE base
      const whereClause = {
          empresa_id: currentUser.empresa_id,
          role_id: 1, // Excluir Administradores
          id: { [Op.notIn]: [1] } // Excluir Fancy
      };

      // Obtener usuarios y sesiones de estrés
      const users = await User.findAll({
          attributes: ['id', 'username', 'email'],
          where: whereClause,
          include: [
              {
                  model: UserResponses,
                  required: false,
                  attributes: [],
                  include: [
                      {
                          model: Hierarchical_level,
                          attributes: ['level'],
                          required: false
                      },
                      {
                          model: Sedes,
                          attributes: ['sede'],
                          required: false
                      }
                  ]
              },
              {
                  model: UserEstresSession,
                  attributes: ['estres_nivel_id'],
                  required: false
              }
          ],
          raw: true,
          nest: true
      });

      // Agrupar usuarios por sede y calcular niveles de estrés
      const sedesTotales: { [key: string]: { LEVE: number; MODERADO: number; ALTO: number; Pendiente: number } } = {};

      users.forEach(user => {
        const sede = user.userresponses?.sedes?.sede || 'sin_asignar'; // Usar sede por defecto si no está asignada
        const estresNivel = user.userestressessions?.estres_nivel_id || 'pendiente'; // Si no tiene nivel de estrés, se asigna 'pendiente'

        if (!sedesTotales[sede]) {
          sedesTotales[sede] = { LEVE: 0, MODERADO: 0, ALTO: 0, Pendiente: 0 };
        }

        // Contar el número de usuarios según el nivel de estrés
        if (estresNivel === 1) sedesTotales[sede].LEVE++;
        else if (estresNivel === 2) sedesTotales[sede].MODERADO++;
        else if (estresNivel === 3) sedesTotales[sede].ALTO++;
        else sedesTotales[sede].Pendiente++;
      });

      return res.status(200).json({
        sedes: sedesTotales,
      });

    } catch (error: any) {
      console.error('Error al obtener los usuarios por sede y nivel de estrés:', error);
      return res.status(500).json({
        message: 'Error al obtener los usuarios agrupados por sede',
        error: error.message
      });
    }
  }

  // Método para obtener permisos de un usuario
  async getPermisos(req: any, res: any) {
    try {
      const { user_id } = req.params;

      const user = await User.findOne({
        where: {
          id: user_id
        },
        attributes: ['permisopoliticas', 'userresponsebool', 'testestresbool']
      });

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Enviar solo los permisos del usuario
      res.status(200).json({
        permisos: {
          permisopoliticas: user.permisopoliticas,
          userresponsebool: user.userresponsebool,
          testestresbool: user.testestresbool
        }
      });

    } catch (error: any) {
      console.error('Error al obtener los permisos del usuario:', error);
      return res.status(500).json({
        message: 'Error al obtener los permisos',
        error: error.message
      });
    }
  }

  async getPermisoStudent(req: any, res: any) {
    try {
      const { user_id } = req.params;

      const user = await User.findOne({
        where: {
          id: user_id
        },
        attributes: ['permisopoliticas', 'studentresponsebool', 'testestresbool']
      });

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Enviar solo los permisos del usuario
      res.status(200).json({
        permisos: {
          permisopoliticas: user.permisopoliticas,
          studentresponsebool: user.studentresponsebool,
          testestresbool: user.testestresbool
        }
      });

    } catch (error: any) {
      console.error('Error al obtener los permisos del usuario:', error);
      return res.status(500).json({
        message: 'Error al obtener los permisos',
        error: error.message
      });
    }
  }
  
  async listStudentDetails(req: any, res: any) {
    try {
      const userId = req.userId?.userId;
      const currentUser = await User.findByPk(userId);
  
      if (!currentUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
  
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
  
      const whereClause = {
        empresa_id: currentUser.empresa_id,
        role_id: 4
      };
  
      // Conteo total de estudiantes
      const totalStudents = await User.count({ where: whereClause });
  
      // Obtener estudiantes con include
      const students = await User.findAll({
        where: whereClause,
        include: [
          {
            model: StudentsResponses,
            attributes: ['seccion'],
            include: [
              { model: Ciclo, attributes: ['ciclo'], required: false },
              { model: AgeRange, attributes: ['age_range'], required: false }
            ],
            required: false
          },
          {
            model: UserEstresSession,
            attributes: ['estres_nivel_id', 'created_at'],
            required: false,
            order: [['created_at', 'DESC']]
          }
        ],
        limit,
        offset,
        raw: true,
        nest: true
      });
  
      const result = students.map(s => ({
        id: s.id,
        username: s.username,
        email: s.email,
        age_range: s.studentresponses?.age_range?.age_range || 'Sin asignar',
        ciclo: s.studentresponses?.ciclo?.ciclo || 'Sin asignar',
        seccion: s.studentresponses?.seccion || 'Sin asignar',
        estres_entrada: s.userestressessions?.estres_nivel_id || 'Pendiente',
        estres_final: 'Pendiente' // Se deja fijo por ahora
      }));
  
      return res.status(200).json({
        users: result,
        pagination: {
          total: totalStudents,
          page,
          pages: Math.ceil(totalStudents / limit)
        }
      });
    } catch (error) {
      console.error("Error en listStudentDetails:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
  
  
}

export default new UserController();