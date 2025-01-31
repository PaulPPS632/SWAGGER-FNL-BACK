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
  tableName: "sedes",
})
export class Sedes extends Model {

  @AllowNull(false)
  @Column(DataType.STRING)
  sede!: string;

  @ForeignKey(() => Empresas)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  empresa_id!: number;
  
  @BelongsTo(() => Empresas)
  empresa!: Empresas;
}
