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
      search,
    });

    return result;
  }

  @Get('profile/me')
  async getMyProfile(@Request() req) {
    const result = await this.usersService.findOne(req.user.sub);
    return result;
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.AGENT)
  async findOne(@Param('id') id: string) {
    const result = await this.usersService.findOne(id);
    return result;
  }

  @Get(':id/stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.AGENT)
  async getUserStats(@Param('id') id: string) {
    const result = await this.usersService.getUserStats(id);
    return result;
  }

  @Patch('profile/me')
  async updateMyProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const result = await this.usersService.updateProfile(req.user.sub, updateProfileDto);
    return result;
  }

  @Post('kyc/submit')
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
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.usersService.update(id, updateUserDto);
    return result;
  }

  @Patch(':id/kyc-status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.AGENT)
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
  async remove(@Param('id') id: string, @Body('reason') reason?: string) {
    const result = await this.usersService.remove(id, reason);
    return result;
  }

  @Get('analytics/overview')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async getAnalytics() {
    const result = await this.usersService.getAnalytics();
    return result;
  }
}