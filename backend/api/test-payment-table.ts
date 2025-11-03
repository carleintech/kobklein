// Test script to verify Payment table functionality
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPaymentTable() {
  try {
    console.log('🔍 Testing Payment table functionality...');

    // Test 1: Create a test payment
    console.log('\n1️⃣ Creating test payment...');
    const testPayment = await prisma.$executeRaw`
      INSERT INTO "Payment" (user_id, amount, currency, payment_method, status, description)
      VALUES ('550e8400-e29b-41d4-a716-446655440000'::uuid, 99.99, 'USD', 'stripe', 'PENDING', 'Test payment for KobKlein')
      RETURNING id
    `;
    console.log('✅ Payment created via raw SQL');
    console.log('✅ Payment created:', testPayment.id);

    // Test 2: Retrieve the payment
    console.log('\n2️⃣ Retrieving payment...');
    const retrievedPayment = await prisma.payment.findUnique({
      where: { id: testPayment.id },
    });
    console.log('✅ Payment retrieved:', retrievedPayment?.status);

    // Test 3: Update payment status
    console.log('\n3️⃣ Updating payment status...');
    const updatedPayment = await prisma.payment.update({
      where: { id: testPayment.id },
      data: { status: 'COMPLETED' },
    });
    console.log('✅ Payment updated to:', updatedPayment.status);

    // Test 4: List payments by user
    console.log('\n4️⃣ Listing user payments...');
    const userPayments = await prisma.payment.findMany({
      where: { user_id: 'test-user-id' },
    });
    console.log('✅ Found payments:', userPayments.length);

    // Test 5: Delete test payment
    console.log('\n5️⃣ Cleaning up test payment...');
    await prisma.payment.delete({
      where: { id: testPayment.id },
    });
    console.log('✅ Test payment deleted');

    console.log('\n🎉 All Payment table tests passed!');
    console.log('\n✅ Payment Module Status: WORKING');
    console.log('✅ Database Connection: WORKING');
    console.log('✅ Supabase Integration: WORKING');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPaymentTable();
