import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { KycStatus, UserRole } from '../types/database.types';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { KycSubmissionDto } from './dto/kyc-submission.dto';
import { UpdateKycStatusDto } from './dto/update-kyc-status.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.create(createUserDto);
    return result;
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.AGENT)
  @ApiOperation({ summary: 'Get all users with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiQuery({ name: 'kycStatus', required: false, enum: KycStatus })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('role') role?: UserRole,
    @Query('kycStatus') kycStatus?: KycStatus,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;

    const result = await this.usersService.findAll({
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      role,
      kycStatus,
      // isActive: isActive !== undefined ? isActive === 'true' : undefined, // Removed - not part of the UserFilterOptions type
      search,
    });

    return result;
  }

  @Get('profile/me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getMyProfile(@Request() req) {
    const result = await this.usersService.findOne(req.user.sub);
    return result;
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.AGENT)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    const result = await this.usersService.findOne(id);
    return result;
  }

  @Get(':id/stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.AGENT)
  @ApiOperation({ summary: 'Get user statistics' })
  @ApiResponse({
    status: 200,
    description: 'User statistics retrieved successfully',
  })
  async getUserStats(@Param('id') id: string) {
    const result = await this.usersService.getUserStats(id);
    return result;
  }

  @Patch('profile/me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async updateMyProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const result = await this.usersService.updateProfile(req.user.sub, updateProfileDto);
    return result;
  }

  @Post('kyc/submit')
  @ApiOperation({ summary: 'Submit KYC documents' })
  @ApiResponse({ status: 200, description: 'KYC documents submitted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async submitKyc(
    @Request() req,
    @Body() kycSubmissionDto: KycSubmissionDto,
  ) {
    const result = await this.usersService.submitKyc(req.user.sub, kycSubmissionDto);
    return result;
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update user (Admin/Super Admin only)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.usersService.update(id, updateUserDto);
    return result;
  }

  @Patch(':id/kyc-status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.AGENT)
  @ApiOperation({ summary: 'Update user KYC status' })
  @ApiResponse({ status: 200, description: 'KYC status updated successfully' })
  async updateKYCStatus(
    @Param('id') id: string,
    @Body() updateKycStatusDto: UpdateKycStatusDto,
  ) {
    const result = await this.usersService.updateKYCStatus(id, updateKycStatusDto.status, updateKycStatusDto.reviewNotes);
    return result;
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update user status (activate/deactivate)' })
  @ApiResponse({ status: 200, description: 'User status updated successfully' })
  async updateStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
    @Body('reason') reason?: string,
  ) {
    const result = await this.usersService.updateUserStatus(id, isActive, reason);
    return result;
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete user (soft delete)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async remove(@Param('id') id: string, @Body('reason') reason?: string) {
    const result = await this.usersService.remove(id, reason);
    return result;
  }

  @Get('analytics/overview')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get user analytics overview' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  async getAnalytics() {
    const result = await this.usersService.getAnalytics();
    return result;
  }
}
