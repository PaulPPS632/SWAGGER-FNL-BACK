import {
    AllowNull,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
  } from "sequelize-typescript";
  import { User } from "../User/user";
  
  @Table({
    timestamps: false,
    tableName: "academico_responses",
  })
  export class AcademicoResponses extends Model {
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    user_id!: number;
  
    @BelongsTo(() => User)
    user!: User;
    
    @AllowNull(false)
    @Column(DataType.STRING)
    nivel_estres!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    factor_1!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    factor_2!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    factor_3!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    factor_4!: string;
    
  }
  