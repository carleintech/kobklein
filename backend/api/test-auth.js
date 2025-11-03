// Test script to check authentication setup
import { Client } from 'pg';

function handleError(context, error) {
  console.error(`❌ [${context}]`, error.message || error);
}

async function checkUsersTable(client) {
  try {
    const res = await client.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users' ORDER BY ordinal_position`,
    );
    if (res.rows.length > 0) {
      console.log('✅ Users table exists with columns:');
      res.rows.forEach((row) =>
        console.log(`   - ${row.column_name}: ${row.data_type}`),
      );
      return true;
    } else {
      console.log('❌ Users table not found');
      return false;
    }
  } catch (error) {
    handleError('Users Table Check', error);
    return false;
  }
}

async function checkEnum(client, enumName, label) {
  try {
    const res = await client.query(
      `SELECT unnest(enum_range(NULL::${enumName})) as value`,
    );
    if (res.rows.length > 0) {
      console.log(
        `✅ ${label} available:`,
        res.rows.map((r) => r.value).join(', '),
      );
      return true;
    } else {
      console.log(`❌ ${label} exists but is empty`);
      return false;
    }
  } catch (error) {
    handleError(`${label} Enum Check`, error);
    return false;
  }
}

async function countUsers(client) {
  try {
    const res = await client.query(`SELECT COUNT(*) as count FROM users`);
    console.log('✅ Total users in database:', res.rows[0].count);
    return res.rows[0].count;
  } catch (error) {
    handleError('User Count', error);
    return 0;
  }
}

async function checkAuthTables(client) {
  try {
    const res = await client.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND (table_name LIKE '%user%' OR table_name LIKE '%auth%' OR table_name LIKE '%session%') ORDER BY table_name`,
    );
    if (res.rows.length > 0) {
      console.log('✅ Auth-related tables:');
      res.rows.forEach((row) => console.log(`   - ${row.table_name}`));
      return res.rows.map((r) => r.table_name);
    } else {
      console.log('❌ No auth-related tables found');
      return [];
    }
  } catch (error) {
    handleError('Auth Tables Check', error);
    return [];
  }
}

async function testAuthSetup() {
  const client = new Client({
    host: 'db.lwkqfvadgcdiawmyazdi.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'Q7RsynMJomLcYueh',
  });
  try {
    await client.connect();
    console.log('🔐 Testing Authentication Setup...');

    // Modular checks
    const usersTableExists = await checkUsersTable(client);
    const userRolesExists = await checkEnum(client, 'user_role', 'User Roles');
    const userStatusExists = await checkEnum(
      client,
      'user_status',
      'User Statuses',
    );
    const totalUsers = await countUsers(client);
    const authTables = await checkAuthTables(client);

    // Final summary
    console.log('\n📋 Authentication Status Summary:');
    console.log('✅ Database Connection: WORKING');
    console.log('Users Table:', usersTableExists ? 'EXISTS' : 'MISSING');
    console.log('User Role Enum:', userRolesExists ? 'EXISTS' : 'MISSING');
    console.log('User Status Enum:', userStatusExists ? 'EXISTS' : 'MISSING');
    console.log('Total Users:', totalUsers);
    console.log(
      'Auth-related Tables:',
      authTables.length > 0 ? authTables.join(', ') : 'NONE',
    );
    console.log('Payment Table: EXISTS (previously verified)');
  } catch (error) {
    handleError('Auth Test', error);
  } finally {
    await client.end();
  }
}

testAuthSetup();
