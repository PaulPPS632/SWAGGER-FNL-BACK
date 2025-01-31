import { AllowNull, BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Tags } from "./Tags";
import { ActivityTags } from "./ActivityTags";

@Table({
    tableName: "activitys"
})
export class Activitys extends Model{

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

    @BelongsToMany(() => Tags, () => ActivityTags)
    tags!: Tags[];
}