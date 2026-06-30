import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

function normalizeName(name: string): string {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: { firstName: string; lastName: string; email: string; passwordHash: string }): Promise<User> {
    return this.prisma.user.create({
      data: {
        firstName: normalizeName(data.firstName),
        lastName: normalizeName(data.lastName),
        email: data.email.trim().toLowerCase(),
        password: data.passwordHash,
      },
    });
  }
}
