# ================================
# KobKlein Development Bootstrap Script
# ================================
# Automates the local development environment setup

param(
    [switch]$SkipInstall,
    [switch]$SkipEnv,
    [switch]$SkipServices,
    [string]$ProjectRef = "",
    [switch]$Help
)

# Color functions for better output
function Write-Success { param($Message) Write-Host "✅ $Message" -ForegroundColor Green }
function Write-Error { param($Message) Write-Host "❌ $Message" -ForegroundColor Red }
function Write-Warning { param($Message) Write-Host "⚠️  $Message" -ForegroundColor Yellow }
function Write-Info { param($Message) Write-Host "ℹ️  $Message" -ForegroundColor Cyan }
function Write-Step { param($Message) Write-Host "🚀 $Message" -ForegroundColor Blue }

# Help message
if ($Help) {
    Write-Host @"
🚀 KobKlein Development Bootstrap Script

USAGE:
    .\scripts\setup-dev.ps1 [OPTIONS]

OPTIONS:
    -SkipInstall     Skip pnpm install step
    -SkipEnv         Skip environment file setup
    -SkipServices    Skip service startup
    -ProjectRef      Supabase project reference ID
    -Help            Show this help message

EXAMPLES:
    .\scripts\setup-dev.ps1                              # Full setup
    .\scripts\setup-dev.ps1 -ProjectRef "abcdef123456"   # With Supabase project
    .\scripts\setup-dev.ps1 -SkipInstall                # Skip dependencies

For detailed setup guide, see: scripts/bootstrap.local.md
"@ -ForegroundColor White
    exit 0
}

# Validation functions
function Test-Prerequisites {
    Write-Step "Checking prerequisites..."
    
    $missing = @()
    
    if (!(Get-Command node -ErrorAction SilentlyContinue)) {
        $missing += "Node.js (https://nodejs.org)"
    }
    
    if (!(Get-Command pnpm -ErrorAction SilentlyContinue)) {
        $missing += "pnpm (npm install -g pnpm)"
    }
    
    if (!(Get-Command git -ErrorAction SilentlyContinue)) {
        $missing += "Git (https://git-scm.com)"
    }
    
    if ($missing.Count -gt 0) {
        Write-Error "Missing prerequisites:"
        $missing | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
        Write-Host "`nPlease install missing tools and try again." -ForegroundColor Yellow
        exit 1
    }
    
    Write-Success "All prerequisites found"
    
    # Show versions
    $nodeVersion = (node --version)
    $pnpmVersion = (pnpm --version)
    $gitVersion = (git --version)
    
    Write-Info "Node.js: $nodeVersion"
    Write-Info "pnpm: $pnpmVersion" 
    Write-Info "Git: $gitVersion"
}

function Test-WorkspaceRoot {
    if (!(Test-Path "package.json") -or !(Test-Path "pnpm-workspace.yaml")) {
        Write-Error "Must run from workspace root (where package.json exists)"
        exit 1
    }
    Write-Success "Running from workspace root"
}

# Environment setup functions
function Copy-EnvironmentFiles {
    if ($SkipEnv) {
        Write-Warning "Skipping environment file setup"
        return
    }
    
    Write-Step "Setting up environment files..."
    
    $envFiles = @(
        @{Source = ".env.example"; Target = ".env.local"}
        @{Source = "web\.env.example"; Target = "web\.env.local"}  
        @{Source = "backend\api\.env.example"; Target = "backend\api\.env"}
        @{Source = "mobile\.env.example"; Target = "mobile\.env"}
    )
    
    foreach ($env in $envFiles) {
        if (Test-Path $env.Source) {
            if (!(Test-Path $env.Target)) {
                Copy-Item $env.Source $env.Target
                Write-Success "Created $($env.Target)"
            } else {
                Write-Warning "$($env.Target) already exists, skipping"
            }
        } else {
            Write-Error "Source file $($env.Source) not found"
        }
    }
}

function Set-SupabaseProject {
    if ($ProjectRef) {
        Write-Step "Configuring Supabase project: $ProjectRef"
        
        $supabaseUrl = "https://$ProjectRef.supabase.co"
        
        # Update environment files with project reference
        $envFiles = @(".env.local", "web\.env.local", "backend\api\.env")
        
        foreach ($envFile in $envFiles) {
            if (Test-Path $envFile) {
                $content = Get-Content $envFile -Raw
                $content = $content -replace "https://your-project-ref\.supabase\.co", $supabaseUrl
                $content = $content -replace "db\.your-project\.supabase\.co", "db.$ProjectRef.supabase.co"
                Set-Content $envFile $content -NoNewline
                Write-Success "Updated $envFile with Supabase project"
            }
        }
    }
}

# Installation functions
function Install-Dependencies {
    if ($SkipInstall) {
        Write-Warning "Skipping dependency installation"
        return
    }
    
    Write-Step "Installing dependencies..."
    
    try {
        Write-Info "Running: pnpm install"
        pnpm install
        Write-Success "Dependencies installed successfully"
    } catch {
        Write-Error "Failed to install dependencies: $_"
        Write-Info "Try running: pnpm store prune && pnpm install"
        exit 1
    }
}

function Test-Installation {
    Write-Step "Verifying installation..."
    
    $packages = @("web", "backend/api", "mobile")
    
    foreach ($package in $packages) {
        if (Test-Path "$package/node_modules") {
            Write-Success "$package dependencies installed"
        } else {
            Write-Warning "$package dependencies missing"
        }
    }
}

# Service functions
function Start-Services {
    if ($SkipServices) {
        Write-Warning "Skipping service startup"
        return
    }
    
    Write-Step "Starting development services..."
    
    # Check if ports are available
    $ports = @(3000, 3001)
    foreach ($port in $ports) {
        $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($connection) {
            Write-Warning "Port $port is already in use"
            $choice = Read-Host "Kill existing process on port $port? (y/N)"
            if ($choice -eq 'y' -or $choice -eq 'Y') {
                $process = Get-Process -Id $connection.OwningProcess -ErrorAction SilentlyContinue
                if ($process) {
                    Stop-Process -Id $process.Id -Force
                    Write-Success "Killed process on port $port"
                }
            }
        }
    }
    
    Write-Info "Starting services with: pnpm dev"
    Write-Info "This will open:"
    Write-Info "  - Web: http://localhost:3000"
    Write-Info "  - API: http://localhost:3001"
    Write-Info "  - API Docs: http://localhost:3001/api/docs"
    
    Write-Host "`nPress Ctrl+C to stop all services" -ForegroundColor Yellow
    
    try {
        pnpm dev
    } catch {
        Write-Warning "Services stopped"
    }
}

function Show-NextSteps {
    Write-Host @"

🎉 KobKlein Development Environment Ready!

📍 NEXT STEPS:
1. Configure your environment files:
   - Edit .env.local (add your Supabase keys)
   - Edit web\.env.local (add public keys)
   - Edit backend\api\.env (add private keys)

2. Set up Supabase:
   - Create project at https://supabase.com
   - Run: supabase link --project-ref YOUR_REF
   - Run: supabase db push

3. Configure Stripe:
   - Get test keys from https://stripe.com
   - Add to environment files

4. Start development:
   - Run: pnpm dev
   - Visit: http://localhost:3000

📚 DOCUMENTATION:
- Setup Guide: scripts/bootstrap.local.md
- Architecture: docs/ARCHITECTURE.md
- Project Plan: docs/CHECKLIST.md

🆘 NEED HELP?
- Read: docs/ROE.md
- Issues: GitHub Issues
- Email: dev@kobklein.com

Happy coding! 🚀
"@ -ForegroundColor Green
}

# Main execution flow
function Main {
    Write-Host "🚀 KobKlein Development Bootstrap" -ForegroundColor Blue
    Write-Host "================================" -ForegroundColor Blue
    Write-Host ""
    
    try {
        Test-Prerequisites
        Test-WorkspaceRoot
        Copy-EnvironmentFiles
        Set-SupabaseProject
        Install-Dependencies
        Test-Installation
        
        Write-Success "Bootstrap completed successfully!"
        
        if (!$SkipServices) {
            $startNow = Read-Host "`nStart development services now? (Y/n)"
            if ($startNow -ne 'n' -and $startNow -ne 'N') {
                Start-Services
            }
        }
        
        Show-NextSteps
        
    } catch {
        Write-Error "Bootstrap failed: $_"
        Write-Info "Check the error above and try again"
        Write-Info "For help: .\scripts\setup-dev.ps1 -Help"
        exit 1
    }
}

# Run the main function
Main
