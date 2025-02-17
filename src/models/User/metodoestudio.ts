import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";

@Table({
  timestamps: false,
  tableName: "metodo-estudio"
})
export class MetodoEstudio extends Model {
  
  @AllowNull(false)
  @Column(DataType.STRING)
  metodoestudio!: string;
}
