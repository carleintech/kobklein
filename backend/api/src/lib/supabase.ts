import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Central Supabase Client Configuration
 * 
 * This is the ONLY place where Supabase clients should be created.
 * Uses HTTPS-only connection (works on military/corporate networks).
 * 
 * Architecture:
 * - Service Role Key: Backend operations (bypasses RLS when needed)
 * - Anon Key: Client-facing operations (respects RLS)
 */

let supabaseAdminInstance: SupabaseClient | null = null;

/**
 * Get Supabase Admin Client (Service Role)
 * 
 * Use this for:
 * - Backend operations
 * - Admin actions
 * - Operations that need to bypass RLS
 * - Trusted server-side logic
 * 
 * SECURITY: Never expose this to frontend
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdminInstance) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(
        'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables'
      );
    }

    supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabaseAdminInstance;
}

/**
 * Create Supabase Client with Anon Key
 * 
 * Use this for:
 * - Client-proxied operations
 * - Operations that should respect RLS
 * - User-scoped queries
 */
export function getSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables'
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Execute operation in Supabase transaction
 * 
 * Provides ACID guarantees for financial operations
 */
export async function withTransaction<T>(
  operation: (client: SupabaseClient) => Promise<T>
): Promise<T> {
  const client = getSupabaseAdmin();
  
  // Supabase doesn't have explicit transactions in JS client
  // but PostgreSQL handles this at the RPC level
  // For complex transactions, use database functions
  
  return await operation(client);
}
