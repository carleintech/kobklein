import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserProfile, UserRole } from '../../types/database.types';
import { extractError } from '../../utils/error.utils';
import { AuthService } from './auth.service';
import { AdminOnly, Public } from './decorators/roles.decorator';
import { User, UserId } from './decorators/user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RolesGuard } from './guards/roles.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Create a new user account with email verification',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            roles: { type: 'array', items: { type: 'string' } },
            status: { type: 'string' },
            kycStatus: { type: 'string' },
            kycTier: { type: 'string' },
          },
        },
        token: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Registration failed - Invalid data',
  })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    try {
      const result = await this.authService.register(registerDto);
      return {
        success: true,
        data: {
          user: result.user,
          token: result.token,
        },
        message: result.message,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = extractError(error);
      throw new HttpException(
        {
          success: false,
          error: err.message,
          timestamp: new Date().toISOString(),
        },
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('login')
  @Public()
  @ApiOperation({
    summary: 'Authenticate user',
    description: 'Login with email and password to receive access token',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully authenticated',
    schema: {
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            roles: { type: 'array', items: { type: 'string' } },
            status: { type: 'string' },
            kycStatus: { type: 'string' },
            wallets: { type: 'array' },
          },
        },
        token: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 403, description: 'Account suspended or inactive' })
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto);
      return {
        success: true,
        data: {
          user: result.user,
          token: result.token,
        },
        message: result.message,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = extractError(error);
      throw new HttpException(
        {
          success: false,
          error: err.message,
          timestamp: new Date().toISOString(),
        },
        err.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Retrieve complete profile information for authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            roles: { type: 'array', items: { type: 'string' } },
            kycStatus: { type: 'string' },
            kycTier: { type: 'string' },
            wallets: { type: 'array' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  @ApiResponse({ status: 404, description: 'User profile not found' })
  async getProfile(@User() user: UserProfile) {
    try {
      // User is already populated by JWT strategy with full profile
      return {
        success: true,
        data: { user },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = extractError(error);
      throw new HttpException(
        {
          success: false,
          error: err.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('profile/:userId')
  @Public()
  @ApiOperation({
    summary: 'Get user profile by ID',
    description: 'Retrieve user profile information by user ID (for Supabase integration)',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            roles: { type: 'array', items: { type: 'string' } },
            kycStatus: { type: 'string' },
            kycTier: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User profile not found' })
  async getProfileById(@Param('userId') userId: string) {
    try {
      const user = await this.authService.getUserProfile(userId);
      return {
        success: true,
        data: { user },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = extractError(error);
      throw new HttpException(
        {
          success: false,
          error: err.message,
          timestamp: new Date().toISOString(),
        },
        err.status || HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('refresh')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Generate new access token for authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  async refreshToken(@UserId() userId: string) {
    try {
      const result = await this.authService.refreshToken(userId);
      return {
        success: true,
        data: { token: result.token },
        message: 'Token refreshed successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = extractError(error);
      throw new HttpException(
        {
          success: false,
          error: err.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout user',
    description: 'Invalidate user session and logout',
  })
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully',
  })
  async logout(@UserId() userId: string) {
    try {
      const result = await this.authService.logout(userId);
      return {
        success: true,
        message: result.message,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = extractError(error);
      throw new HttpException(
        {
          success: false,
          error: err.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('validate')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Validate JWT token',
    description: 'Verify token validity and return user context',
  })
  @ApiResponse({
    status: 200,
    description: 'Token is valid',
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  async validateToken(@User() user: UserProfile) {
    return {
      success: true,
      data: {
        user,
        isValid: true,
        validatedAt: new Date().toISOString(),
      },
      message: 'Token is valid',
      timestamp: new Date().toISOString(),
    };
  }

  // Password Management Endpoints

  @Post('password/reset')
  @Public()
  @ApiOperation({
    summary: 'Request password reset',
    description: 'Send password reset email to user',
  })
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string', format: 'email' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Reset email sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid email address' })
  async resetPassword(@Body() body: { email: string }) {
    try {
      const result = await this.authService.resetPassword(body.email);
      return {
        success: true,
        message: result.message,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = extractError(error);
      throw new HttpException(
        {
          success: false,
          error: err.message,
          timestamp: new Date().toISOString(),
        },
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch('password')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update password',
    description: 'Change user password',
  })
  @ApiBody({
    schema: {
      properties: {
        newPassword: { type: 'string', minLength: 8 },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid password format' })
  async updatePassword(
    @UserId() userId: string,
    @Body() body: { newPassword: string },
  ) {
    try {
      const result = await this.authService.updatePassword(
        userId,
        body.newPassword,
      );
      return {
        success: true,
        message: result.message,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = extractError(error);
      throw new HttpException(
        {
          success: false,
          error: err.message,
          timestamp: new Date().toISOString(),
        },
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('email/verify')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Send email verification',
    description: 'Send verification email to user',
  })
  @ApiResponse({ status: 200, description: 'Verification email sent' })
  async sendEmailVerification(@UserId() userId: string) {
    try {
      const result = await this.authService.sendEmailVerification(userId);
      return {
        success: true,
        message: result.message,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = extractError(error);
      throw new HttpException(
        {
          success: false,
          error: err.message,
          timestamp: new Date().toISOString(),
        },
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Role Management Endpoints (Admin Only)

  @Post('roles/:userId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AdminOnly()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Assign role to user',
    description: 'Assign a role to a user (Admin only)',
  })
  @ApiBody({
    schema: {
      properties: {
        role: { type: 'string', enum: Object.values(UserRole) },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Role assigned successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async assignRole(
    @Param('userId') targetUserId: string,
    @UserId() adminUserId: string,
    @Body() body: { role: UserRole },
  ) {
    try {
      const result = await this.authService.assignRole(
        targetUserId,
        body.role,
        adminUserId,
      );
      return {
        success: true,
        data: result,
        message: `Role ${body.role} assigned successfully`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = extractError(error);
      throw new HttpException(
        {
          success: false,
          error: err.message,
          timestamp: new Date().toISOString(),
        },
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('roles/:userId/:role')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AdminOnly()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Revoke role from user',
    description: 'Remove a role from a user (Admin only)',
  })
  @ApiResponse({ status: 200, description: 'Role revoked successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async revokeRole(
    @Param('userId') targetUserId: string,
    @Param('role') role: UserRole,
  ) {
    try {
      const result = await this.authService.revokeRole(targetUserId, role);
      return {
        success: true,
        data: result,
        message: `Role ${role} revoked successfully`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = extractError(error);
      throw new HttpException(
        {
          success: false,
          error: err.message,
          timestamp: new Date().toISOString(),
        },
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('sync-user')
  @Public()
  @ApiOperation({
    summary: 'Sync user from Supabase',
    description: 'Create or update user profile from Supabase authentication',
  })
  @ApiResponse({
    status: 200,
    description: 'User synced successfully',
    schema: {
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            roles: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid user data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  async syncUser(@Headers('authorization') authHeader: string) {
    try {
      // Extract JWT token from Authorization header
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new HttpException('Missing or invalid Authorization header', HttpStatus.UNAUTHORIZED);
      }

      const token = authHeader.replace('Bearer ', '');

      // Get user from Supabase using the JWT token
      const supabaseUser = await this.authService.getUserFromToken(token);

      // Sync user with extracted data from Supabase
      const result = await this.authService.syncUserFromSupabase({
        id: supabaseUser.id,
        email: supabaseUser.email,
        firstName: supabaseUser.user_metadata?.firstName || supabaseUser.user_metadata?.first_name || '',
        lastName: supabaseUser.user_metadata?.lastName || supabaseUser.user_metadata?.last_name || '',
        phoneNumber: supabaseUser.user_metadata?.phoneNumber || supabaseUser.user_metadata?.phone || '',
        role: supabaseUser.user_metadata?.role || UserRole.INDIVIDUAL,
      });

      return {
        success: true,
        data: { user: result.user },
        message: result.message,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = extractError(error);
      throw new HttpException(
        {
          success: false,
          error: err.message,
          timestamp: new Date().toISOString(),
        },
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('update-login')
  @Public()
  @ApiOperation({
    summary: 'Update user last login',
    description: 'Update the last login timestamp for a user',
  })
  @ApiResponse({ status: 200, description: 'Last login updated successfully' })
  async updateLastLogin(@Body() body: { userId: string }) {
    try {
      await this.authService.updateLastLogin(body.userId);
      return {
        success: true,
        message: 'Last login updated successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = extractError(error);
      throw new HttpException(
        {
          success: false,
          error: err.message,
          timestamp: new Date().toISOString(),
        },
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
