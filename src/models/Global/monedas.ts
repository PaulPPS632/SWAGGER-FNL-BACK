import { Column, DataType, Table, Model, ForeignKey, AllowNull, BelongsTo, Default } from "sequelize-typescript";
import { User } from "../User/user";

@Table({
    timestamps: true,
    tableName: "monedas"
})


export class Monedas extends Model {
 
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    user_id!: number;
    
    @BelongsTo(() => User)
    user!: User;


    @Default(0)
    @Column(DataType.INTEGER)
    cantidad!: number;


}