import { AllowNull, Column, DataType, Model, Table , ForeignKey, BelongsTo } from "sequelize-typescript";
//import { UserEstresSession } from "./userestressession";
import { Empresas } from "../Global/empresas";
import { EstresNiveles } from "./estres_niveles";

@Table({
  timestamps: false,
  tableName: "estres_contador"
})
export class EstresContador extends Model {

  @AllowNull(false)
  @Column(DataType.INTEGER)
  cantidad!: number;

  @ForeignKey(() => EstresNiveles)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  estres_nivel_id!: number;
      
  @BelongsTo(() => EstresNiveles) 
  estres_nivel!: EstresNiveles;

  @ForeignKey(() => Empresas)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  empresa_id!: number;
      
  @BelongsTo(() => Empresas)
  empresa!: Empresas;
}
