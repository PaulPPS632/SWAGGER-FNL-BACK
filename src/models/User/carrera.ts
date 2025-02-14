
import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";


@Table({
  timestamps: false,
  tableName: "carrera",
})
export class Carrera extends Model {
    @AllowNull(true)
    @Column(DataType.TEXT)
    carrera!: string;
}
