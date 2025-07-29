import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import * as admin from 'firebase-admin';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Obtener todos los usuarios.
   */
  findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  /**
   * Buscar usuario por email.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  /**
   * Buscar usuario por Firebase UID.
   */
  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { firebaseUid } });
  }

  /**
   * Validar o crear usuario desde Firebase.
   */
  async validateOrCreateUser(
    firebaseUser: admin.auth.DecodedIdToken,
  ): Promise<User> {
    const { uid, email, name, picture } = firebaseUser;

    let user = await this.findByFirebaseUid(uid);

    if (!user) {
      user = this.userRepo.create({
        firebaseUid: uid,
        email: email ?? '',
        fullName: name ?? undefined,
        profileImage: picture ?? undefined,
        isVerified: true,
        role: UserRole.CUSTOMER, // ✅ enum correctamente referenciado
      });

      await this.userRepo.save(user);
    }

    return user;
  }

  /**
   * Crear un nuevo usuario si no existe.
   */
  async create(input: CreateUserInput): Promise<User> {
    const existing = await this.findByEmail(input.email);

    if (existing) {
      throw new ConflictException('El correo ya está registrado');
    }

    const user = this.userRepo.create({
      ...input,
      isVerified: true,
    });

    return this.userRepo.save(user);
  }

  /**
   * Buscar usuario por ID.
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  /**
   * Actualizar un usuario.
   */
  async update(id: string, input: UpdateUserInput): Promise<User> {
    const user = await this.findOne(id);
    const updated = Object.assign(user, input);
    return this.userRepo.save(updated);
  }

  /**
   * Eliminación suave (soft delete).
   */
  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    return this.userRepo.softRemove(user);
  }

  /**
   * Eliminación dura.
   */
  async deleteUser(id: string): Promise<boolean> {
    const result = await this.userRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
