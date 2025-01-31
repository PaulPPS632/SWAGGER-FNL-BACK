import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";

@Table({
  timestamps: false,
  tableName: "responsability_level",
})
export class ResponsabilityLevel extends Model {
  @AllowNull(false)
  @Column(DataType.STRING)
  level!: string;
}
