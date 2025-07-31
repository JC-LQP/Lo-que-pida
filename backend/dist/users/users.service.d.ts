import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Seller } from '../sellers/entities/seller.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import * as admin from 'firebase-admin';
export declare class UsersService {
    private readonly userRepo;
    private readonly sellerRepo;
    constructor(userRepo: Repository<User>, sellerRepo: Repository<Seller>);
    findAll(): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
    findByFirebaseUid(firebaseUid: string): Promise<User | null>;
    validateOrCreateUser(firebaseUser: admin.auth.DecodedIdToken): Promise<User>;
    create(input: CreateUserInput): Promise<User>;
    findOne(id: string): Promise<User>;
    update(id: string, input: UpdateUserInput): Promise<User>;
    remove(id: string): Promise<User>;
    deleteUser(id: string): Promise<boolean>;
    findSellerByUserId(userId: string): Promise<Seller | null>;
}
