import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";

@Table({
  timestamps: false,
  tableName: "modalidad"
})
export class Modalidad extends Model {
  
  @AllowNull(false)
  @Column(DataType.STRING)
  modalidad!: string;
}
