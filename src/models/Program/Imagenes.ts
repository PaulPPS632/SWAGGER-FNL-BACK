import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Tags } from "./Tags";

@Table({
    tableName: "imagenes"
})
export class Imagenes extends Model {
    
    @ForeignKey(() => Tags)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    tags_id!: number;

    @BelongsTo(() => Tags)
    tag!: Tags;

    @AllowNull(false)
    @Column(DataType.STRING)
    url!: string;

}