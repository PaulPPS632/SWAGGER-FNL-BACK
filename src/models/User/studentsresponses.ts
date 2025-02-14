
import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { User } from "./user";
import { AgeRange } from "./ageRange";
import { Gender } from "./gender";
import { Carrera } from "./carrera";

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

  @ForeignKey(() => Carrera)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  carrera_id!: number;

  @BelongsTo(() => Carrera)
  carrera!: Carrera;

  @ForeignKey(() => Gender)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  gender_id!: number;

  @BelongsTo(() => Gender)
  gender!: Gender;
  
  

  @CreatedAt
  created_at!: Date;
}
