import {
    AllowNull,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Length,
    Model,
    Table,
  } from "sequelize-typescript";
  import { User } from "../User/user";
  
  @Table({
    timestamps: false,
    tableName: "test_academico",
  })
  export class TestAcademico extends Model {
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    user_id!: number;
  
    @BelongsTo(() => User)
    user!: User;
  
    @AllowNull(true)
    @Column(DataType.INTEGER)
    pregunta_1!: number;
  
    @AllowNull(true)
    @Column(DataType.INTEGER)
    pregunta_2!: number;
  
    @AllowNull(true)
    @Column(DataType.INTEGER)
    pregunta_3!: number;
  
    @AllowNull(true)
    @Column(DataType.INTEGER)
    pregunta_4!: number;
  
    @AllowNull(true)
    @Column(DataType.INTEGER)
    pregunta_5!: number;
  
    @AllowNull(true)
    @Column(DataType.INTEGER)
    pregunta_6!: number;
  
    @AllowNull(true)
    @Column(DataType.INTEGER)
    pregunta_7!: number;
  
    @AllowNull(true)
    @Column(DataType.INTEGER)
    pregunta_8!: number;
    
    @AllowNull(true)
    @Column(DataType.INTEGER)
    pregunta_9!: number;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    pregunta_10!: number;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    pregunta_11!: number;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    pregunta_12!: number;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    pregunta_13!: number;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    pregunta_14!: number;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    pregunta_15!: number;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    pregunta_16!: number;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    pregunta_17!: number;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    pregunta_18!: number;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    pregunta_19!: number;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    pregunta_20!: number;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    pregunta_21!: number;

    @AllowNull(true)
    @Length({ min: 2, max: 20 })
    @Column(DataType.STRING)
    estado!: string;
  }
  