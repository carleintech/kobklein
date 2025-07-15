// File: kobklein/web/src/middleware.ts
import createIntlMiddleware from 'next-intl/middleware';
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";
import { locales, defaultLocale } from './i18n';

// Define route permissions
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  // Public routes (no authentication required)
  "/": [],
  "/about": [],
  "/contact": [],
  "/auth/login": [],
  "/auth/register": [],
  "/auth/forgot-password": [],
  "/auth/verify-email": [],
  "/auth/reset-password": [],
  "/api/auth": [], // NextAuth API routes

  // Client routes
  "/client": ["client"],
  "/client/dashboard": ["client"],
  "/client/transactions": ["client"],
  "/client/pay": ["client"],
  "/client/receive": ["client"],
  "/client/settings": ["client"],
  "/client/help": ["client"],

  // Merchant routes
  "/merchant": ["merchant"],
  "/merchant/dashboard": ["merchant"],
  "/merchant/transactions": ["merchant"],
  "/merchant/receive": ["merchant"],
  "/merchant/refill": ["merchant"],
  "/merchant/products": ["merchant"],
  "/merchant/settings": ["merchant"],

  // Distributor routes
  "/distributor": ["distributor"],
  "/distributor/dashboard": ["distributor"],
  "/distributor/refills": ["distributor"],
  "/distributor/add-user": ["distributor"],
  "/distributor/commission": ["distributor"],
  "/distributor/zone": ["distributor"],
  "/distributor/settings": ["distributor"],

  // Diaspora routes
  "/diaspora": ["diaspora"],
  "/diaspora/dashboard": ["diaspora"],
  "/diaspora/recipients": ["diaspora"],
  "/diaspora/send": ["diaspora"],
  "/diaspora/history": ["diaspora"],
  "/diaspora/auto-refill": ["diaspora"],
  "/diaspora/settings": ["diaspora"],

  // Admin routes
  "/admin": ["admin", "super_admin"],
  "/admin/dashboard": ["admin", "super_admin"],
  "/admin/users": ["admin", "super_admin"],
  "/admin/transactions": ["admin", "super_admin"],
  "/admin/merchants": ["admin", "super_admin"],
  "/admin/distributors": ["admin", "super_admin"],
  "/admin/reports": ["admin", "super_admin"],
  "/admin/settings": ["admin", "super_admin"],

  // Super Admin routes
  "/super-admin": ["super_admin"],
  "/super-admin/dashboard": ["super_admin"],
  "/super-admin/users": ["super_admin"],
  "/super-admin/admins": ["super_admin"],
  "/super-admin/system": ["super_admin"],
  "/super-admin/audit": ["super_admin"],
  "/super-admin/config": ["super_admin"],

  // Regional Manager routes
  "/regional-manager": ["regional_manager", "super_admin"],
  "/regional-manager/dashboard": ["regional_manager", "super_admin"],
  "/regional-manager/distributors": ["regional_manager", "super_admin"],
  "/regional-manager/merchants": ["regional_manager", "super_admin"],
  "/regional-manager/reports": ["regional_manager", "super_admin"],

  // Support Agent routes
  "/support-agent": ["support_agent", "admin", "super_admin"],
  "/support-agent/dashboard": ["support_agent", "admin", "super_admin"],
  "/support-agent/tickets": ["support_agent", "admin", "super_admin"],
  "/support-agent/users": ["support_agent", "admin", "super_admin"],
  "/support-agent/chat": ["support_agent", "admin", "super_admin"],
};

// Helper function to check if route requires authentication
function isPublicRoute(pathname: string): boolean {
  const publicPaths = [
    "/",
    "/about",
    "/contact",
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/verify-email",
    "/auth/reset-password",
    "/auth/error",
    "/unauthorized",
    "/api/auth",
    "/_next",
    "/favicon.ico",
    "/images",
    "/icons",
  ];

  return publicPaths.some(path => pathname.startsWith(path));
}

// Helper function to get allowed roles for a route
function getAllowedRoles(pathname: string): string[] {
  // Exact match first
  if (ROUTE_PERMISSIONS[pathname]) {
    return ROUTE_PERMISSIONS[pathname];
  }

  // Find the most specific match
  const matchingRoutes = Object.keys(ROUTE_PERMISSIONS)
    .filter(route => pathname.startsWith(route))
    .sort((a, b) => b.length - a.length); // Sort by specificity (longest first)

  if (matchingRoutes.length > 0) {
    return ROUTE_PERMISSIONS[matchingRoutes[0]];
  }

  // Default to requiring authentication but no specific role
  return [];
}

// Helper function to get dashboard redirect for role
function getDashboardRedirect(role: string): string {
  const dashboardRoutes: Record<string, string> = {
    client: "/client/dashboard",
    merchant: "/merchant/dashboard",
    distributor: "/distributor/dashboard",
    diaspora: "/diaspora/dashboard",
    admin: "/admin/dashboard",
    super_admin: "/super-admin/dashboard",
    regional_manager: "/regional-manager/dashboard",
    support_agent: "/support-agent/dashboard",
  };

  return dashboardRoutes[role] || "/client/dashboard";
}

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    try {
      const { pathname } = request.nextUrl;
      const token = request.nextauth.token;

      // Allow public routes
      if (isPublicRoute(pathname)) {
        return NextResponse.next();
      }

      // If no token, redirect to login
      if (!token) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Check if user's email is verified
      if (!token.isVerified && !pathname.startsWith("/auth/verify-email")) {
        const verifyUrl = new URL("/auth/verify-email", request.url);
        return NextResponse.redirect(verifyUrl);
      }

      // Get allowed roles for this route
      const allowedRoles = getAllowedRoles(pathname);
      const userRole = token.role as string;

      // If route requires specific roles, check if user has access
      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        // Redirect to user's appropriate dashboard if they try to access wrong area
        const userDashboard = getDashboardRedirect(userRole);
        return NextResponse.redirect(new URL(userDashboard, request.url));
      }

      // Special handling for root dashboard routes
      if (pathname === "/dashboard") {
        const userDashboard = getDashboardRedirect(userRole);
        return NextResponse.redirect(new URL(userDashboard, request.url));
      }

      // Allow access
      return NextResponse.next();
    } catch (error) {
      console.error("Middleware error:", error);
      // Fallback to allowing the request to continue
      return NextResponse.next();
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        try {
          const { pathname } = req.nextUrl;
          
          // Allow public routes
          if (isPublicRoute(pathname)) {
            return true;
          }

          // Require authentication for protected routes
          return !!token;
        } catch (error) {
          console.error("Authorization callback error:", error);
          return false;
        }
      },
    },
  }
);

// Configure which routes this middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, icons, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|icons|.*\\..*$).*)",
  ],
};