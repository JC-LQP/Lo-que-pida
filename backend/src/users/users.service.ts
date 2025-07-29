import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

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
   * Crear un nuevo usuario si no existe.
   */
  async create(input: CreateUserInput): Promise<User> {
    const existing = await this.findByEmail(input.email);

    if (existing) {
      throw new ConflictException('El correo ya está registrado');
    }

    const user = this.userRepo.create({
      ...input,
      passwordHash: '', // Firebase maneja el hash, dejamos campo vacío o lo eliminas si no usas
      isVerified: true, // Si el token de Firebase fue válido, asumimos que está verificado
    });

    return this.userRepo.save(user);
  }

  /**
   * Buscar usuario por ID.
   */
  async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  /**
   * Actualizar un usuario.
   */
  async update(id: number, input: UpdateUserInput): Promise<User> {
    const user = await this.findOne(id);
    const updated = Object.assign(user, input);
    return this.userRepo.save(updated);
  }

  /**
   * Eliminación suave (soft delete).
   */
  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    return this.userRepo.softRemove(user);
  }

  /**
   * Eliminación dura.
   */
  async deleteUser(id: number): Promise<boolean> {
    const result = await this.userRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
