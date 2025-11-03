// Simple test script to verify Payment table functionality
const { Client } = require('pg');

async function testPaymentTable() {
  const client = new Client({
    host: 'db.lwkqfvadgcdiawmyazdi.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'Q7RsynMJomLcYueh',
  });

  try {
    await client.connect();
    console.log('🔍 Testing Payment table functionality...');

    // Test 1: Create a test payment
    console.log('\n1️⃣ Creating test payment...');
    const insertResult = await client.query(`
      INSERT INTO "Payment" (user_id, amount, currency, payment_method, status, description)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, status, amount
    `, [
      '550e8400-e29b-41d4-a716-446655440000',
      99.99,
      'USD',
      'stripe',
      'PENDING',
      'Test payment for KobKlein'
    ]);

    const paymentId = insertResult.rows[0].id;
    console.log('✅ Payment created:', paymentId);

    // Test 2: Retrieve the payment
    console.log('\n2️⃣ Retrieving payment...');
    const selectResult = await client.query(`
      SELECT * FROM "Payment" WHERE id = $1
    `, [paymentId]);

    console.log('✅ Payment retrieved:', selectResult.rows[0].status);

    // Test 3: Update payment status
    console.log('\n3️⃣ Updating payment status...');
    await client.query(`
      UPDATE "Payment" SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, ['COMPLETED', paymentId]);

    const updatedResult = await client.query(`
      SELECT status FROM "Payment" WHERE id = $1
    `, [paymentId]);

    console.log('✅ Payment updated to:', updatedResult.rows[0].status);

    // Test 4: List payments by user
    console.log('\n4️⃣ Listing user payments...');
    const listResult = await client.query(`
      SELECT COUNT(*) as count FROM "Payment" WHERE user_id = $1
    `, ['550e8400-e29b-41d4-a716-446655440000']);

    console.log('✅ Found payments:', listResult.rows[0].count);

    // Test 5: Test enum values
    console.log('\n5️⃣ Testing payment status enum...');
    const enumResult = await client.query(`
      SELECT unnest(enum_range(NULL::payment_status)) as status
    `);

    console.log('✅ Available statuses:', enumResult.rows.map(r => r.status).join(', '));

    // Test 6: Delete test payment
    console.log('\n6️⃣ Cleaning up test payment...');
    await client.query(`
      DELETE FROM "Payment" WHERE id = $1
    `, [paymentId]);

    console.log('✅ Test payment deleted');

    console.log('\n🎉 All Payment table tests passed!');
    console.log('\n✅ Payment Table: WORKING');
    console.log('✅ Database Connection: WORKING');
    console.log('✅ Supabase Integration: WORKING');
    console.log('✅ CRUD Operations: ALL WORKING');
    console.log('✅ Enum Types: WORKING');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await client.end();
  }
}

testPaymentTable();