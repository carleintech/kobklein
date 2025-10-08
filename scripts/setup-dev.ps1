# KobKlein Development Setup Script (PowerShell)
# This script sets up the development environment for new contributors on Windows

param(
    [switch]$SkipValidation,
    [switch]$Force
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Colors for output
$Colors = @{
    Info = "Cyan"
    Success = "Green"
    Warning = "Yellow"
    Error = "Red"
}

function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Colors.Info
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Colors.Success
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Colors.Warning
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Colors.Error
}

function Test-NodeJS {
    Write-Status "Checking Node.js installation..."

    try {
        $nodeVersion = node --version
        Write-Success "Node.js is installed: $nodeVersion"

        # Check if version is 18 or higher
        $majorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
        if ($majorVersion -lt 18) {
            Write-Warning "Node.js version 18+ is recommended. Current: $nodeVersion"
        }
    }
    catch {
        Write-Error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    }
}

function Test-Pnpm {
    Write-Status "Checking pnpm installation..."

    try {
        $pnpmVersion = pnpm --version
        Write-Success "pnpm is installed: $pnpmVersion"
    }
    catch {
        Write-Status "pnpm is not installed. Installing pnpm..."
        npm install -g pnpm
        Write-Success "pnpm installed successfully!"
    }
}

function Install-Dependencies {
    Write-Status "Installing project dependencies..."

    Set-Location web
    pnpm install

    Write-Success "Dependencies installed successfully!"
}

function Initialize-Environment {
    Write-Status "Setting up environment files..."

    if (-not (Test-Path "web\.env.local")) {
        if (Test-Path "web\.env.example") {
            Copy-Item "web\.env.example" "web\.env.local"
            Write-Warning "Created .env.local from .env.example. Please update with your actual values."
        }
        else {
            Write-Warning "No .env.example found. Please create .env.local with required environment variables."
        }
    }
    else {
        Write-Success ".env.local already exists"
    }
}

function Initialize-GitHooks {
    Write-Status "Setting up git hooks..."

    Set-Location web

    try {
        pnpm husky install
        Write-Success "Git hooks set up successfully!"
    }
    catch {
        Write-Warning "Husky not found. Git hooks will be set up after dependency installation."
    }
}

function Test-Setup {
    if ($SkipValidation) {
        Write-Status "Skipping validation as requested..."
        return
    }

    Write-Status "Validating setup..."
    Set-Location web

    # Type check
    Write-Status "Running type check..."
    try {
        pnpm type-check
        Write-Success "Type check passed!"
    }
    catch {
        Write-Error "Type check failed. Please fix TypeScript errors."
    }

    # Linting
    Write-Status "Running linter..."
    try {
        pnpm lint --max-warnings 0
        Write-Success "Linting passed!"
    }
    catch {
        Write-Warning "Linting issues found. Run 'pnpm lint:fix' to auto-fix."
    }

    # Format check
    Write-Status "Checking code formatting..."
    try {
        pnpm format:check
        Write-Success "Code formatting is correct!"
    }
    catch {
        Write-Warning "Code formatting issues found. Run 'pnpm format' to fix."
    }
}

function Show-Information {
    Write-Host ""
    Write-Host "🎉 Setup complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Next steps:"
    Write-Host "1. Update web\.env.local with your actual environment variables"
    Write-Host "2. Start development server: cd web && pnpm dev"
    Write-Host "3. Open http://localhost:3000 in your browser"
    Write-Host ""
    Write-Host "🔧 Useful commands:"
    Write-Host "  pnpm dev          - Start development server"
    Write-Host "  pnpm build        - Build for production"
    Write-Host "  pnpm test         - Run tests"
    Write-Host "  pnpm lint         - Run linter"
    Write-Host "  pnpm lint:fix     - Fix linting issues"
    Write-Host "  pnpm format       - Format code"
    Write-Host "  pnpm type-check   - Check TypeScript types"
    Write-Host ""
    Write-Host "📚 Documentation: Check the README.md for more information"
    Write-Host ""
}

# Main execution
try {
    Write-Host "🔧 KobKlein Development Environment Setup" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""

    Test-NodeJS
    Test-Pnpm
    Install-Dependencies
    Initialize-Environment
    Initialize-GitHooks
    Test-Setup
    Show-Information

    Write-Success "Development environment is ready! Happy coding! 🚀"
}
catch {
    Write-Error "Setup failed: $($_.Exception.Message)"
    exit 1
}
