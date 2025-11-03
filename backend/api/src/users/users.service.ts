import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { KYCStatus, Prisma, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with profile
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        profile: {
          create: {
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            phoneNumber: userData.phoneNumber,
          },
        },
        wallet: {
          create: {
            balance: 0,
            currency: 'HTG', // Default to Haitian Gourde
          },
        },
      },
      include: {
        profile: true,
        wallet: true,
      },
    });

    // Remove password from response
    const { password: _, ...result } = user;
    return result;
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    role?: UserRole;
    kycStatus?: KYCStatus;
    isActive?: boolean;
  }) {
    const { skip, take, role, kycStatus, isActive } = params || {};

    const where: Prisma.UserWhereInput = {};

    if (role) where.role = role;
    if (kycStatus) where.kycStatus = kycStatus;
    if (isActive !== undefined) where.isActive = isActive;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        where,
        include: {
          profile: true,
          wallet: true,
          _count: {
            select: {
              sentTransactions: true,
              receivedTransactions: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    // Remove passwords from response
    const sanitizedUsers = users.map(({ password, ...user }) => user);

    return {
      data: sanitizedUsers,
      total,
      page: skip ? Math.floor(skip / (take || 10)) + 1 : 1,
      pageSize: take || 10,
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        wallet: true,
        kycDocuments: true,
        sentTransactions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        receivedTransactions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            sentTransactions: true,
            receivedTransactions: true,
            notifications: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        wallet: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...updateData } = updateUserDto;

    // If password is being updated, hash it
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        ...(hashedPassword && { password: hashedPassword }),
      },
      include: {
        profile: true,
        wallet: true,
      },
    });

    const { password: _, ...result } = updatedUser;
    return result;
  }

  async updateProfile(userId: string, profileData: any) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.profile.update({
      where: { userId },
      data: profileData,
    });
  }

  async updateKYCStatus(id: string, status: KYCStatus) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: { kycStatus: status },
      include: {
        profile: true,
      },
    });
  }

  async deactivate(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async activate(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Soft delete by deactivating
    return this.deactivate(id);
  }

  async getUserStats(id: string) {
    const user = await this.findOne(id);

    const [totalSent, totalReceived, totalTransactions] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { senderId: id, status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { receiverId: id, status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      this.prisma.transaction.count({
        where: {
          OR: [{ senderId: id }, { receiverId: id }],
        },
      }),
    ]);

    return {
      user: user,
      stats: {
        totalSent: totalSent._sum.amount || 0,
        totalReceived: totalReceived._sum.amount || 0,
        totalTransactions,
        walletBalance: user.wallet?.balance || 0,
      },
    };
  }
}
