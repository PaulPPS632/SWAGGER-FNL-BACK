import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";

@Table({
  timestamps: false,
  tableName: "age_range",
})
export class AgeRange extends Model {
  @AllowNull(false)
  @Column(DataType.STRING)
  age_range!: string;
}
