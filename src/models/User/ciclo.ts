
import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";


@Table({
  timestamps: false,
  tableName: "ciclo",
})
export class Ciclo extends Model {
    @AllowNull(true)
    @Column(DataType.TEXT)
    ciclo!: string;
}
