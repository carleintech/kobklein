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
  Query,
  RawBodyRequest,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PaymentMethod, PaymentStatus, Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ProcessStripePaymentDto } from './dto/process-stripe-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT, Role.MERCHANT, Role.DISTRIBUTOR, Role.DIASPORA)
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @Request() req: any,
  ) {
    try {
      return await this.paymentsService.create(createPaymentDto, req.user.id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create payment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('stripe/process')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT, Role.MERCHANT, Role.DISTRIBUTOR, Role.DIASPORA)
  async processStripePayment(
    @Body() processStripePaymentDto: ProcessStripePaymentDto,
    @Request() req: any,
  ) {
    try {
      return await this.paymentsService.processStripePayment(
        processStripePaymentDto,
        req.user.id,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Payment processing failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('stripe/webhook')
  async handleStripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    try {
      if (!signature) {
        throw new HttpException(
          'Missing Stripe signature',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.paymentsService.handleStripeWebhook(
        signature,
        req.rawBody,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Webhook processing failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post(':id/confirm')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT, Role.MERCHANT, Role.DISTRIBUTOR, Role.DIASPORA)
  async confirmPayment(@Param('id') id: string, @Request() req: any) {
    try {
      return await this.paymentsService.confirmPayment(id, req.user.id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Payment confirmation failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    Role.CLIENT,
    Role.MERCHANT,
    Role.DISTRIBUTOR,
    Role.DIASPORA,
    Role.ADMIN,
  )
  async findAll(@Request() req: any, @Query() query: any) {
    const { page = 1, limit = 20, status, method } = query;

    // Admins can see all payments, others see only their own
    const userId = req.user.role === Role.ADMIN ? undefined : req.user.id;

    return await this.paymentsService.findAll({
      userId,
      page: parseInt(page),
      limit: parseInt(limit),
      status: status as PaymentStatus,
      method: method as PaymentMethod,
    });
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DISTRIBUTOR)
  async findUserPayments(@Param('userId') userId: string, @Query() query: any) {
    const { page = 1, limit = 20, status, method } = query;

    return await this.paymentsService.findAll({
      userId,
      page: parseInt(page),
      limit: parseInt(limit),
      status: status as PaymentStatus,
      method: method as PaymentMethod,
    });
  }

  @Get('analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DISTRIBUTOR, Role.MERCHANT)
  async getAnalytics(@Request() req: any, @Query() query: any) {
    const { startDate, endDate, groupBy = 'day' } = query;

    // Merchants and distributors see only their own analytics
    const userId = req.user.role === Role.ADMIN ? undefined : req.user.id;

    return await this.paymentsService.getPaymentAnalytics({
      userId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      groupBy,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    Role.CLIENT,
    Role.MERCHANT,
    Role.DISTRIBUTOR,
    Role.DIASPORA,
    Role.ADMIN,
  )
  async findOne(@Param('id') id: string, @Request() req: any) {
    const payment = await this.paymentsService.findOne(id);

    // Check ownership or admin role
    if (req.user.role !== Role.ADMIN && payment.userId !== req.user.id) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return payment;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    Role.ADMIN,
    Role.CLIENT,
    Role.MERCHANT,
    Role.DISTRIBUTOR,
    Role.DIASPORA,
  )
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
    @Request() req: any,
  ) {
    try {
      return await this.paymentsService.update(
        id,
        updatePaymentDto,
        req.user.id,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update payment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string, @Request() req: any) {
    return await this.paymentsService.remove(id, req.user.id);
  }
}
