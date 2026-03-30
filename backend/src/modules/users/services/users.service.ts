import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });
    if (existing) {
      throw new ConflictException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const saved = await this.userRepository.save(user);
    delete (saved as any).password;
    return saved;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ where: { isActive: true } });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByUsernameOrEmail(identifier: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: [{ username: identifier }, { email: identifier }],
      select: ['id', 'username', 'email', 'password', 'fullName', 'role', 'isActive'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    Object.assign(user, updateUserDto);
    const saved = await this.userRepository.save(user);
    delete (saved as any).password;
    return saved;
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = false;
    const saved = await this.userRepository.save(user);
    delete (saved as any).password;
    return saved;
  }

  /**
   * Actualización por el propio usuario: sin role ni isActive.
   * Carga password para poder verificar y persistir sin borrarla por error.
   */
  async updateAccount(
    userId: string,
    dto: UpdateAccountDto,
  ): Promise<{ user: User; usernameChanged: boolean }> {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .addSelect('u.password')
      .where('u.id = :id', { id: userId })
      .getOne();

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const previousUsername = user.username;

    const hasNewPassword = dto.newPassword != null && dto.newPassword.length > 0;
    if (hasNewPassword) {
      if (!dto.currentPassword?.length) {
        throw new BadRequestException('Se requiere la contraseña actual');
      }
      const valid = await bcrypt.compare(dto.currentPassword, user.password);
      if (!valid) {
        throw new BadRequestException('La contraseña actual no es correcta');
      }
    }

    if (dto.username !== undefined && dto.username !== user.username) {
      const taken = await this.userRepository.findOne({ where: { username: dto.username } });
      if (taken && taken.id !== userId) {
        throw new ConflictException('El nombre de usuario ya está en uso');
      }
      user.username = dto.username;
    }

    if (dto.email !== undefined && dto.email !== user.email) {
      const taken = await this.userRepository.findOne({ where: { email: dto.email } });
      if (taken && taken.id !== userId) {
        throw new ConflictException('El correo ya está en uso');
      }
      user.email = dto.email;
    }

    if (dto.fullName !== undefined) {
      user.fullName = dto.fullName;
    }

    if (hasNewPassword) {
      user.password = await bcrypt.hash(dto.newPassword!, 10);
    }

    const saved = await this.userRepository.save(user);
    delete (saved as any).password;

    return {
      user: saved,
      usernameChanged: saved.username !== previousUsername,
    };
  }
}
