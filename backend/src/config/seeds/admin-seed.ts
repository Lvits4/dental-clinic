import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { UsersService } from '../../modules/users/services/users.service';
import { Role } from '../../common/enums/role.enum';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    const existing = await usersService.findByUsernameOrEmail('admin');
    if (existing) {
      console.log('Admin user already exists. Skipping seed.');
    }
  } catch {
    await usersService.create({
      username: 'admin',
      email: 'admin@dentalclinic.com',
      password: 'Admin123!',
      fullName: 'Administrador del Sistema',
      role: Role.ADMIN,
    });
    console.log('Admin user created successfully!');
    console.log('  Username: admin');
    console.log('  Password: Admin123!');
    console.log('  Role: admin');
  }

  await app.close();
}

bootstrap();
