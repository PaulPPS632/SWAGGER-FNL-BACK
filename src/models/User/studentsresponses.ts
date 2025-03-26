
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  Default,
} from "sequelize-typescript";
import { User } from "./user";
import { AgeRange } from "./ageRange";
import { Gender } from "./gender";
import { Ciclo } from "./ciclo";

@Table({
  timestamps: false,
  tableName: "students_respones",
})
export class StudentsResponses extends Model {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  user_id!: number;

  @BelongsTo(() => User)
  user!: User;


  @ForeignKey(() => AgeRange)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  age_range_id!: number;

  @BelongsTo(() => AgeRange)
  age_range!: AgeRange;


  @ForeignKey(() => Ciclo)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  ciclo_id!: number;

  @BelongsTo(() => Ciclo)
  ciclo!: Ciclo;

  @ForeignKey(() => Gender)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  gender_id!: number;

  @BelongsTo(() => Gender)
  gender!: Gender;
  
  @Default(0)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  seccion!: number;

  @AllowNull(true)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  created_at!: Date;
}
