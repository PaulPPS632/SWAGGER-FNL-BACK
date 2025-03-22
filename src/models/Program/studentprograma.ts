import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, Length, Model, Table } from "sequelize-typescript";
import { User } from "../User/user";
import { ActivityStudents } from "./ActivityStudents";

@Table({
  timestamps: false,
  tableName: "studentprograma"
})
export class StudentPrograma extends Model {
  
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  user_id!: number;

  @BelongsTo(() => User)
  user!: User;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  sesion!: number;

  @ForeignKey(() => ActivityStudents)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  activity_id!: number;

  @BelongsTo(() => ActivityStudents)
  activity!: ActivityStudents;

  @AllowNull(true)
  @Column(DataType.TEXT)
  comentario!: string;

  @AllowNull(true)
  @Length({min: 1, max:5})
  @Column(DataType.INTEGER)
  estrellas!: number

  @AllowNull(true)
  @Default(null)
  @Column(DataType.DATE)
  start_date!: Date;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.DATE)
  completed_date!: Date;
}
