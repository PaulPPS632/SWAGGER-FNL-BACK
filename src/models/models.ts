import { Message } from "./ChatBot/message";
import { EstresNiveles } from "./Clasificacion/estres_niveles";
//import { TipoTecnicas } from "./Clasificacion/tipotecnicas";
import { UserEstresSession } from "./Clasificacion/userestressession";
import { Empresas } from "./Global/empresas";
import { UserPrograma } from "./Program/userprograma";
import { TestEstres } from "./Test/test_estres";
import { TestEstresSalida } from "./Test/test_estres_salida";
import { AgeRange } from "./User/ageRange";
import { Gender } from "./User/gender";
import { Hierarchical_level } from "./User/hierarchical_level";
import { ResponsabilityLevel } from "./User/responsabilityLevel";
import { User } from "./User/user";
import { UserResponses } from "./User/user_responses";
import { Role } from "./User/role";
import { Tags } from "./Program/Tags";
import { Activitys } from "./Program/Activitys";
import { ActivityTags } from "./Program/ActivityTags";
import { Imagenes } from "./Program/Imagenes";
import { Area } from "./User/area";
import { Sedes } from "./User/sedes";
import { EstresContador } from "./Clasificacion/estres_contador";
import { EmocionesDiarias } from "./User/emocionesDiarias";
import { StudentsResponses } from "./User/studentsresponses";
import { Carrera } from "./User/carrera";
import { Ciclo } from "./User/ciclo";
import { Monedas } from "./Global/monedas";
import { ActivityStudents } from "./Program/ActivityStudents";
import { ActivityStudentTags } from "./Program/ActivityStudentTags";
import { StudentPrograma } from "./Program/studentprograma";

const models = [
  User,
  UserResponses,
  ResponsabilityLevel,
  Hierarchical_level,
  Gender,
  AgeRange,
  EstresNiveles,
  UserEstresSession,
  TestEstres,
  TestEstresSalida,
  Message,
  Empresas,
  Tags,
  Activitys,
  ActivityTags,
  UserPrograma,
  Role,
  Imagenes,
  Area,
  Sedes,
  EstresContador,
  EmocionesDiarias,
  StudentsResponses,
  Carrera,
  Ciclo,
  Monedas,
  ActivityStudents,
  ActivityStudentTags,
  StudentPrograma,
];
export default models;
