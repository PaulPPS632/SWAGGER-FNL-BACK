import {
    Model,
    Column,
    DataType,
    Table,
    AllowNull,
    Unique,
    CreatedAt,
    UpdatedAt,
    HasMany,
  } from "sequelize-typescript";
  import { User } from "./user";
  
  @Table({
    timestamps: true,
    tableName: "roles"
  })
  export class Role extends Model {

    @AllowNull(false)
    @Unique(true)
    @Column(DataType.STRING)
    name!: string;
  
    @CreatedAt
    createdAt!: Date;
  
    @UpdatedAt
    updatedAt!: Date;
  
    @HasMany(() => User)
    users!: User[];
  }
  