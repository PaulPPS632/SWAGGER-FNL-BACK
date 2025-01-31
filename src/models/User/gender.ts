import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";

@Table({
  timestamps: false,
  tableName: "gender"
})
export class Gender extends Model {
  
  @AllowNull(false)
  @Column(DataType.STRING)
  gender!: string;
}
