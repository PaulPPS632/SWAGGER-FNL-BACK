import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, Model, Table, Length } from "sequelize-typescript";

import { User } from "../User/user";
import { EstresNiveles } from "./estres_niveles";

@Table({
  timestamps: false,
  tableName: "user_estres_sessions"
})
export class UserEstresSession extends Model {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER) 
  user_id!: number;

  @BelongsTo(() => User)
  user!: User;

  @AllowNull(true)
  @Length({min: 1, max:3})
  @Column(DataType.INTEGER)
  caritas!: number

  @ForeignKey(() => EstresNiveles)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  estres_nivel_id!: number;

  @BelongsTo(() => EstresNiveles)
  estres_nivel!: EstresNiveles; 


  @Default(DataType.NOW)
  @Column(DataType.DATE)
  created_at!: Date;

}
