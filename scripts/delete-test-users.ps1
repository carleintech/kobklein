<#
.SYNOPSIS
    Delete test users from Supabase Auth and database

.DESCRIPTION
    This script helps clean up test users created during development.
    You can provide specific email addresses or delete all users matching a pattern.

.PARAMETER Email
    Specific email address to delete

.PARAMETER Pattern
    Email pattern to match (e.g., "test@", "@example.com")

.EXAMPLE
    .\delete-test-users.ps1 -Email "carleintech@hotmail.com"

.EXAMPLE
    .\delete-test-users.ps1 -Email "mitchelabegin@gmail.com"
#>

param(
    [Parameter()]
    [string]$Email,
    
    [Parameter()]
    [string]$Pattern
)

Write-Host ""
Write-Host "=== Supabase Test User Deletion Guide ===" -ForegroundColor Cyan
Write-Host ""

if ($Email) {
    Write-Host "To delete user: $Email" -ForegroundColor Yellow
} elseif ($Pattern) {
    Write-Host "To delete users matching: $Pattern" -ForegroundColor Yellow
} else {
    Write-Host "Usage examples:" -ForegroundColor Yellow
    Write-Host "  .\delete-test-users.ps1 -Email 'test@example.com'" -ForegroundColor Gray
    Write-Host "  .\delete-test-users.ps1 -Pattern 'test@'" -ForegroundColor Gray
    Write-Host ""
}

Write-Host ""
Write-Host "Option 1: Using Supabase Dashboard" -ForegroundColor Green
Write-Host "  1. Open: https://supabase.com/dashboard" -ForegroundColor Gray
Write-Host "  2. Select your project" -ForegroundColor Gray
Write-Host "  3. Go to: Authentication > Users" -ForegroundColor Gray
if ($Email) {
    Write-Host "  4. Search for: $Email" -ForegroundColor Gray
} else {
    Write-Host "  4. Search for the user email" -ForegroundColor Gray
}
Write-Host "  5. Click the user row > Options (•••) > Delete User" -ForegroundColor Gray
Write-Host ""

Write-Host "Option 2: Using SQL Editor (Faster for multiple users)" -ForegroundColor Green
Write-Host "  1. Open: Supabase Dashboard > SQL Editor" -ForegroundColor Gray
Write-Host "  2. Run this query:" -ForegroundColor Gray
Write-Host ""

if ($Email) {
    Write-Host "-- Delete specific user" -ForegroundColor DarkGray
    Write-Host "DELETE FROM auth.users WHERE email = '$Email';" -ForegroundColor Cyan
} elseif ($Pattern) {
    Write-Host "-- Delete users matching pattern" -ForegroundColor DarkGray
    Write-Host "DELETE FROM auth.users WHERE email LIKE '%$Pattern%';" -ForegroundColor Cyan
} else {
    Write-Host "-- Delete specific user" -ForegroundColor DarkGray
    Write-Host "DELETE FROM auth.users WHERE email = 'user@example.com';" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "-- Or delete users matching pattern" -ForegroundColor DarkGray
    Write-Host "DELETE FROM auth.users WHERE email LIKE '%test%';" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Option 3: Delete ALL test users (⚠️  Use with caution)" -ForegroundColor Yellow
Write-Host "-- Delete all users from auth" -ForegroundColor DarkGray
Write-Host "DELETE FROM auth.users;" -ForegroundColor Red
Write-Host ""

Write-Host "Note: The database trigger should automatically clean up related records" -ForegroundColor DarkGray
Write-Host "      in the public.users table when you delete from auth.users" -ForegroundColor DarkGray
Write-Host ""

# Try to get Supabase project info from environment
$envPath = ".\backend\api\.env"
if (Test-Path $envPath) {
    $supabaseUrl = (Get-Content $envPath | Where-Object { $_ -match '^SUPABASE_URL=' }) -replace 'SUPABASE_URL=', ''
    $supabaseUrl = $supabaseUrl -replace '"', ''
    
    if ($supabaseUrl) {
        $projectId = ($supabaseUrl -split '\.')[0] -replace 'https://', ''
        Write-Host "Your Supabase Dashboard: https://supabase.com/dashboard/project/$projectId" -ForegroundColor Cyan
        Write-Host ""
    }
}

Write-Host "After deleting users, you can test signup again with the same email." -ForegroundColor Green
Write-Host ""
