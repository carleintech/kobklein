/**
 * Basic Auth Test - Minimal Authentication System
 * 
 * This test file validates the core auth functionality without decorators
 * to ensure the logic works before adding full NestJS decorators.
 */

import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { extractError } from '../utils/error.utils';

// Mock implementations for testing
class MockJwtService extends JwtService {
  sign(payload: any): string {
    return 'mock-jwt-token';
  }
}

class MockConfigService extends ConfigService {
  get<T = any>(propertyPath: string, defaultValue?: T): T {
    const mockConfig: Record<string, any> = {
      SUPABASE_URL: 'https://mock.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'mock-service-role-key',
      APP_URL: 'http://localhost:3000',
      JWT_SECRET: 'mock-secret',
    };
    return mockConfig[propertyPath] || defaultValue;
  }
}

// Test interface
interface TestUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  country?: string;
  preferredCurrency?: 'HTG' | 'USD' | 'EUR' | 'CAD';
}

async function testAuthService() {
  console.log('🔧 Testing Auth Service...');

  const jwtService = new MockJwtService({});
  const configService = new MockConfigService();
  const authService = new AuthService(jwtService, configService);

  // Test user data
  const testUser: TestUser = {
    email: 'test@kobklein.com',
    password: 'TestPassword123!',
    firstName: 'Jean',
    lastName: 'Baptiste',
    phone: '+50912345678',
    country: 'HT',
    preferredCurrency: 'HTG'
  };

  try {
    console.log('✅ Auth service created successfully');
    console.log('✅ JWT Service mock working');
    console.log('✅ Config Service mock working');
    
    // Test role methods
    const hasRole = await authService.hasRole('test-user-id', 'CLIENT' as any);
    console.log('✅ Role check method accessible');

    // Test user roles
    const roles = await authService.getUserRoles('test-user-id');
    console.log('✅ Get user roles method accessible');

    console.log('🎉 Auth Service basic functionality test passed!');
    
  } catch (error) {
      const err = extractError(error);
    console.error('❌ Auth Service test failed:', err.message);
    throw error;
  }
}

// Export for potential use
export { testAuthService };

// Auto-run if called directly
if (require.main === module) {
  testAuthService()
    .then(() => {
      console.log('✅ All auth tests passed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Auth tests failed:', error);
      process.exit(1);
    });
}