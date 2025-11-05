#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Test signup with a guaranteed fresh email address
#>

$ErrorActionPreference = "Stop"

# Generate a unique email using timestamp
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$uniqueEmail = "test_${timestamp}@example.com"

Write-Host ""
Write-Host "=== Testing Fresh Signup ===" -ForegroundColor Cyan
Write-Host "Unique Email: $uniqueEmail" -ForegroundColor Yellow
Write-Host ""

# Prepare the registration data
$registerData = @{
    email = $uniqueEmail
    password = "TestPassword123!"
    firstName = "Test"
    lastName = "User"
    phone = "+50938765432"
    country = "HT"
    preferredCurrency = "HTG"
} | ConvertTo-Json

# Test registration
Write-Host "Attempting registration..." -ForegroundColor Gray

try {
    $response = Invoke-RestMethod `
        -Uri "http://localhost:3002/api/v1/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerData `
        -ErrorAction Stop
    
    Write-Host ""
    Write-Host "✅ SUCCESS! Registration worked!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 5
    Write-Host ""
    
    # Verify the token exists
    if ($response.data.token) {
        Write-Host "✅ Token received: $($response.data.token.Substring(0, 20))..." -ForegroundColor Green
    }
    
    # Verify user data
    if ($response.data.user) {
        Write-Host "✅ User created with ID: $($response.data.user.id)" -ForegroundColor Green
        Write-Host "   Email: $($response.data.user.email)" -ForegroundColor Gray
        Write-Host "   Name: $($response.data.user.first_name) $($response.data.user.last_name)" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "🎉 All checks passed! The signup flow is working." -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now test in the browser with this email:" -ForegroundColor Yellow
    Write-Host "  Email: $uniqueEmail" -ForegroundColor Cyan
    Write-Host "  Password: TestPassword123!" -ForegroundColor Cyan
    Write-Host ""
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $errorBody = $_.ErrorDetails.Message
    
    Write-Host ""
    Write-Host "❌ FAILED with status code: $statusCode" -ForegroundColor Red
    Write-Host ""
    
    if ($errorBody) {
        Write-Host "Error details:" -ForegroundColor Yellow
        try {
            $errorJson = $errorBody | ConvertFrom-Json
            $errorJson | ConvertTo-Json -Depth 5
        } catch {
            Write-Host $errorBody -ForegroundColor Red
        }
    }
    
    Write-Host ""
    
    if ($statusCode -eq 409) {
        Write-Host "⚠️  409 Conflict Error - This means:" -ForegroundColor Yellow
        Write-Host "   1. The email somehow already exists in Supabase" -ForegroundColor Gray
        Write-Host "   2. OR there's a database constraint violation" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Check backend logs for more details" -ForegroundColor Cyan
    }
    
    Write-Host ""
    exit 1
}
