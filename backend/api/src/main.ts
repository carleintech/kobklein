import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global API prefix
  app.setGlobalPrefix('api/v1');

  // Enable CORS for frontend communication
  const corsOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'https://kobklein.com',
    'https://www.kobklein.com',
    'https://kobklein.vercel.app',
  ];

  // Add CORS_ORIGIN from env (can be comma-separated)
  if (process.env.CORS_ORIGIN) {
    const envOrigins = process.env.CORS_ORIGIN.split(',').map(o => o.trim());
    corsOrigins.push(...envOrigins);
  }

  app.enableCors({
    origin: [...new Set(corsOrigins)].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('KobKlein API')
    .setDescription('Revolutionary Fintech Platform for Haiti')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('wallets', 'Wallet operations')
    .addTag('transactions', 'Transaction processing')
    .addTag('payments', 'Payment processing')
    .addTag('admin', 'Administrative functions')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.APP_PORT || 3001;
  await app.listen(port);

  console.log(`🚀 KobKlein API Server running on http://localhost:${port}`);
  console.log(`📚 API Base URL: http://localhost:${port}/api/v1`);
  console.log(
    `📚 API Documentation available at http://localhost:${port}/api/docs`,
  );
  console.log(`🔐 Auth endpoints available at http://localhost:${port}/api/v1/auth`);
  console.log(`   - POST /api/v1/auth/register`);
  console.log(`   - POST /api/v1/auth/login`);
  console.log(`   - GET /api/v1/auth/profile`);
}
bootstrap();
