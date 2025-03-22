import {
    Table,
    Model,
    ForeignKey,
    Column,
    DataType,
  } from "sequelize-typescript";
  import { ActivityStudents } from "./ActivityStudents";
  import { Tags } from "./Tags";
  
  @Table({
    tableName: "activitystudenttags",
    timestamps: false, // opcional
  })
  export class ActivityStudentTags extends Model {
    @ForeignKey(() => ActivityStudents)
    @Column(DataType.INTEGER)
    activityStudentId!: number;
  
    @ForeignKey(() => Tags)
    @Column(DataType.INTEGER)
    tagId!: number;
  }