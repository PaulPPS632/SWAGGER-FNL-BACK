import {
  AllowNull,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  BelongsTo,
} from "sequelize-typescript";
import { Area } from "./area";

@Table({
  timestamps: false,
  tableName: "hierarchical_level",
})
export class Hierarchical_level extends Model {
  @AllowNull(false)
  @Column(DataType.STRING)
  level!: string;

  @ForeignKey(() => Area)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  area_id!: number;

  @BelongsTo(() => Area)
  area!: Area;
}
