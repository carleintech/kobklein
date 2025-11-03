import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL'),
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY'),
    );
  }

  async register(registerDto: RegisterDto) {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      role = 'CLIENT',
    } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this email or phone already exists',
      );
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } =
      await this.supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
          phone,
          role,
        },
      });

    if (authError) {
      throw new ConflictException(authError.message);
    }

    // Create user in our database
    const user = await this.prisma.user.create({
      data: {
        id: authData.user.id,
        email,
        firstName,
        lastName,
        phone,
        role,
        emailVerified: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create default wallet for the user
    await this.prisma.wallet.create({
      data: {
        id: `wallet_${user.id}`,
        userId: user.id,
        currency: 'HTG',
        balance: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Authenticate with Supabase
    const { data: authData, error: authError } =
      await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get user from our database
    const user = await this.prisma.user.findUnique({
      where: { id: authData.user.id },
      include: {
        wallets: {
          where: { isActive: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        wallets: user.wallets,
      },
      token,
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        wallets: {
          where: { isActive: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async refreshToken(userId: string) {
    const user = await this.validateUser(userId);

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { token };
  }

  async logout(userId: string) {
    // Invalidate Supabase session
    const { error } = await this.supabase.auth.admin.signOut(userId);

    if (error) {
      console.error('Supabase logout error:', error);
    }

    return { message: 'Logged out successfully' };
  }
}
