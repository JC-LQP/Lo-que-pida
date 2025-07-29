import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  CUSTOMER = 'customer',
  SELLER = 'seller',
  ADMIN = 'admin',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'The role of the user',
});

@ObjectType()
@Entity({ name: 'users' })
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true, length: 100 })
  email: string;

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

  @Field({ nullable: true })
  @Column({ name: 'firebase_uid', type: 'varchar', nullable: true, unique: true })
  firebaseUid?: string;

  @Field({ nullable: true })
  @Column({ name: 'profile_image', type: 'text', nullable: true })
  profileImage?: string;
}
