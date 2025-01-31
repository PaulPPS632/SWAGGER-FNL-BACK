import { AllowNull, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Activitys } from "./Activitys";
import { Tags } from "./Tags";

@Table({
    tableName: "activitytags"
})
export class ActivityTags extends Model{
    
    @ForeignKey(() => Activitys)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    activity_id!: number;

    @ForeignKey(() => Tags)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    tags_id!: number;
    tag: any;
}