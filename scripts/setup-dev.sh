#!/usr/bin/env bash

# KobKlein Development Setup Script
# This script sets up the development environment for new contributors

set -e

echo "🚀 Setting up KobKlein development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    print_status "Checking Node.js installation..."
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node --version)
        print_success "Node.js is installed: $NODE_VERSION"

        # Check if version is 18 or higher
        MAJOR_VERSION=$(echo $NODE_VERSION | sed 's/v\([0-9]*\)\..*/\1/')
        if [ "$MAJOR_VERSION" -lt 18 ]; then
            print_warning "Node.js version 18+ is recommended. Current: $NODE_VERSION"
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
}

# Check if pnpm is installed
check_pnpm() {
    print_status "Checking pnpm installation..."
    if command -v pnpm >/dev/null 2>&1; then
        PNPM_VERSION=$(pnpm --version)
        print_success "pnpm is installed: $PNPM_VERSION"
    else
        print_status "pnpm is not installed. Installing pnpm..."
        npm install -g pnpm
        print_success "pnpm installed successfully!"
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    cd web
    pnpm install
    print_success "Dependencies installed successfully!"
}

# Setup environment files
setup_env() {
    print_status "Setting up environment files..."
    if [ ! -f "web/.env.local" ]; then
        if [ -f "web/.env.example" ]; then
            cp web/.env.example web/.env.local
            print_warning "Created .env.local from .env.example. Please update with your actual values."
        else
            print_warning "No .env.example found. Please create .env.local with required environment variables."
        fi
    else
        print_success ".env.local already exists"
    fi
}

# Setup git hooks
setup_git_hooks() {
    print_status "Setting up git hooks..."
    cd web
    if command -v husky >/dev/null 2>&1; then
        pnpm husky install
        print_success "Git hooks set up successfully!"
    else
        print_warning "Husky not found. Git hooks will be set up after dependency installation."
    fi
}

# Validate setup
validate_setup() {
    print_status "Validating setup..."
    cd web

    # Type check
    print_status "Running type check..."
    if pnpm type-check; then
        print_success "Type check passed!"
    else
        print_error "Type check failed. Please fix TypeScript errors."
    fi

    # Linting
    print_status "Running linter..."
    if pnpm lint --max-warnings 0; then
        print_success "Linting passed!"
    else
        print_warning "Linting issues found. Run 'pnpm lint:fix' to auto-fix."
    fi

    # Format check
    print_status "Checking code formatting..."
    if pnpm format:check; then
        print_success "Code formatting is correct!"
    else
        print_warning "Code formatting issues found. Run 'pnpm format' to fix."
    fi
}

# Print helpful information
print_info() {
    echo ""
    echo "🎉 Setup complete!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Update web/.env.local with your actual environment variables"
    echo "2. Start development server: cd web && pnpm dev"
    echo "3. Open http://localhost:3000 in your browser"
    echo ""
    echo "🔧 Useful commands:"
    echo "  pnpm dev          - Start development server"
    echo "  pnpm build        - Build for production"
    echo "  pnpm test         - Run tests"
    echo "  pnpm lint         - Run linter"
    echo "  pnpm lint:fix     - Fix linting issues"
    echo "  pnpm format       - Format code"
    echo "  pnpm type-check   - Check TypeScript types"
    echo ""
    echo "📚 Documentation: Check the README.md for more information"
    echo ""
}

# Main execution
main() {
    echo "🔧 KobKlein Development Environment Setup"
    echo "========================================"

    check_node
    check_pnpm
    install_dependencies
    setup_env
    setup_git_hooks
    validate_setup
    print_info

    print_success "Development environment is ready! Happy coding! 🚀"
}

# Run the setup
main "$@"
