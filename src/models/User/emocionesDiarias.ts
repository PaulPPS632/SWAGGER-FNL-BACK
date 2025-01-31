import {
  AllowNull,
  Column,
  DataType,
  ForeignKey,
  Length,
  Model,
  Table,
  BelongsTo,
} from "sequelize-typescript";
import { EstresNiveles } from "../Clasificacion/estres_niveles";
import { User } from "../User/user";

@Table({
  timestamps: false,
  tableName: "emociones_diarias",
})
export class EmocionesDiarias extends Model {
  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId!: number;

  @AllowNull(false)
  @Column({
    type: DataType.DATEONLY,
  })
  fecha!: Date;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  emocion!: number;

  @AllowNull(false)
  @ForeignKey(() => EstresNiveles)
  @Column({
    type: DataType.INTEGER,
  })
  estresId!: number;

  @BelongsTo(() => EstresNiveles)
  nivelEstres!: EstresNiveles;

  @AllowNull(true)
  @Length({ min: 2, max: 255 })
  @Column(DataType.STRING)
  notaOpcional!: string;
}