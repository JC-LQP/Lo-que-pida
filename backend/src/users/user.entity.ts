import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

/* The `export enum UserRole` block in the TypeScript code is defining an enumeration called `UserRole`
with three possible values: `CUSTOMER`, `SELLER`, and `ADMIN`. Each value is assigned a string
literal as its representation. This enum is used to represent different roles that a user can have
within the system. */
export enum UserRole {
  CUSTOMER = 'customer',
  SELLER = 'seller',
  ADMIN = 'admin',
}

/* The `registerEnumType` function call is used in this TypeScript code to register the `UserRole` enum
with the GraphQL schema. */
registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'The role of the user',
});

/* The User class defines a TypeScript entity representing a user with properties such as id, email,
passwordHash, fullName, role, isVerified, and createdAt. */
@ObjectType()
@Entity({ name: 'users' })
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true, length: 100 })
  email: string;

  // No se expone por seguridad
  @Column({ name: 'password_hash', type: 'text' })
  passwordHash: string;

  @Field({ nullable: true })
  @Column({ name: 'full_name', length: 100, nullable: true })
  fullName?: string;

  @Field(() => UserRole)
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Field()
  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
