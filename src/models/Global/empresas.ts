import { Column, DataType, Table, Model, Default } from "sequelize-typescript";

@Table({
    timestamps: true,
    tableName: "empresas"
})
export class Empresas extends Model {
 
    @Column(DataType.STRING)
    nombre!: string;

    @Column(DataType.STRING)
    ruc!: string;

    @Default(DataType.NOW) 
    @Column(DataType.DATE)
    createdAt!: Date;

    @Default(DataType.NOW) 
    @Column(DataType.DATE)
    updatedAt!: Date;
}