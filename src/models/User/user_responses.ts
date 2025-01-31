
import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { User } from "./user";
import { AgeRange } from "./ageRange";
import { Hierarchical_level } from "./hierarchical_level";
import { ResponsabilityLevel } from "./responsabilityLevel";
import { Gender } from "./gender";
import { Sedes } from "./sedes";

@Table({
  timestamps: false,
  tableName: "user_responses",
})
export class UserResponses extends Model {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  user_id!: number;

  @BelongsTo(() => User)
  user!: User;


  @ForeignKey(() => AgeRange)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  age_range_id!: number;

  @BelongsTo(() => AgeRange)
  age_range!: AgeRange;


  @ForeignKey(() => Hierarchical_level)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  hierarchical_level_id!: number;

  @BelongsTo(() => Hierarchical_level)
  hierarchical_level!: Hierarchical_level;


  @ForeignKey(() => ResponsabilityLevel)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  responsability_level_id!: number;

  @BelongsTo(() => ResponsabilityLevel)
  responsability_level!: ResponsabilityLevel;


  @ForeignKey(() => Gender)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  gender_id!: number;

  @BelongsTo(() => Gender)
  gender!: Gender;
  
  @ForeignKey(() => Sedes)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  sedes_id!: number;

  @BelongsTo(() => Sedes)
  sedes!: Sedes;

  @CreatedAt
  created_at!: Date;
}
