
import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Empresas } from "../Global/empresas";


@Table({
  timestamps: false,
  tableName: "carrera",
})
export class Carrera extends Model {
    @AllowNull(true)
    @Column(DataType.TEXT)
    carrera!: string;

    @ForeignKey(() => Empresas)
    @AllowNull(true)
    @Column(DataType.INTEGER)
    empresa_id!: number;
    
    @BelongsTo(() => Empresas)
    empresa!: Empresas;
}
