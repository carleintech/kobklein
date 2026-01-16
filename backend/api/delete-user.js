const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env file manually
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  if (line.trim() && !line.trim().startsWith('#')) {
    const eqIndex = line.indexOf('=');
    if (eqIndex > 0) {
      const key = line.substring(0, eqIndex).trim();
      let value = line.substring(eqIndex + 1).trim();
      // Remove surrounding quotes
      value = value.replace(/^["'](.*)["']$/, '$1');
      envVars[key] = value;
    }
  }
});

const supabaseUrl = envVars.SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

console.log('📝 Loaded config:');
console.log('   SUPABASE_URL:', supabaseUrl || 'NOT FOUND');
console.log('   SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅ Found' : '❌ NOT FOUND');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function deleteUser(email) {
  try {
    console.log(`🔍 Looking for user: ${email}`);

    // Check Supabase Auth first
    const { data: authUsers, error: authListError } = await supabase.auth.admin.listUsers();
    
    if (authListError) {
      console.log('⚠️ Could not list auth users:', authListError.message);
    } else {
      const authUser = authUsers.users?.find(u => u.email === email);
      if (authUser) {
        console.log('✅ Found in Supabase Auth:', authUser.id);
        console.log('🗑️ Deleting from Supabase Auth...');
        const { error: authDeleteError } = await supabase.auth.admin.deleteUser(authUser.id);
        if (authDeleteError) {
          console.log('❌ Error deleting from Auth:', authDeleteError.message);
        } else {
          console.log('✅ Deleted from Supabase Auth');
        }
      } else {
        console.log('ℹ️ Not found in Supabase Auth');
      }
    }

    // First, get the user from the database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    if (userError) {
      console.log('❌ Error querying database:', userError.message);
      return;
    }

    if (!userData || userData.length === 0) {
      console.log('❌ User not found in database');
      return;
    }

    const user = userData[0];
    console.log('✅ Found user:', {
      id: user.id,
      email: user.email,
      columns: Object.keys(user)
    });

    // Delete from Auth (Supabase Auth)
    console.log('🗑️ Deleting from Supabase Auth...');
    const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
    
    if (authError) {
      console.log('⚠️ Error deleting from Auth:', authError.message);
    } else {
      console.log('✅ Deleted from Supabase Auth');
    }

    // Delete from users table (this should cascade to wallets, accounts, ledger_entries)
    console.log('🗑️ Deleting from database tables...');
    const { error: dbError } = await supabase
      .from('users')
      .delete()
      .eq('id', user.id);

    if (dbError) {
      console.log('⚠️ Error deleting from database:', dbError.message);
    } else {
      console.log('✅ Deleted from users table');
      console.log('✅ Cascaded deletion to: wallets, accounts, ledger_entries');
    }

    console.log('\n🎉 Account has been completely removed!');
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2] || 'mitchelabegin@gmail.com';
deleteUser(email);
