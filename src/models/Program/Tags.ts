import { AllowNull, BelongsToMany, HasMany, Model, Table } from "sequelize-typescript";
import { Column, DataType } from "sequelize-typescript";
import { Activitys } from "./Activitys";
import { ActivityTags } from "./ActivityTags";
import { Imagenes } from "./Imagenes";

@Table({
    tableName: "tags"
})
export class Tags extends Model {
    
    @Column(DataType.STRING)
    nombre!: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    tipo!: string;

    @BelongsToMany(() => Activitys, () => ActivityTags)
    tags!: Activitys[];

    @HasMany(() => Imagenes)
    imagen!: Imagenes;
}