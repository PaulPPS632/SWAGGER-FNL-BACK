import { AllowNull, BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Tags } from "./Tags";
import { ActivityStudentTags } from "./ActivityStudentTags";
@Table({
    tableName: "activitystudents"
})
export class ActivityStudents extends Model{

    @AllowNull(false)
    @Column(DataType.STRING)
    nombre_tecnica!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    tipo_tecnica!: string;
  
    @AllowNull(false)
    @Column(DataType.TEXT)
    descripcion!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    guia!: string;

    @Column(DataType.STRING)
    imagen_url!: string;

    @BelongsToMany(() => Tags, () => ActivityStudentTags)
    tags!: Tags[];
}