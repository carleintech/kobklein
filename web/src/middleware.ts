// File: kobklein/web/src/middleware.ts
import createIntlMiddleware from 'next-intl/middleware';
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";
import { locales, defaultLocale } from './i18n';

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

// Helper function to extract locale from pathname
function getLocaleFromPathname(pathname: string): string | null {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];
  return locales.includes(potentialLocale as any) ? potentialLocale : null;
}

// Helper function to remove locale from pathname
function removeLocaleFromPathname(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  if (locale) {
    return pathname.replace(`/${locale}`, '') || '/';
  }
  return pathname;
}

// Define route permissions (without locale prefixes)
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
  "/auth/error": [],
  "/unauthorized": [],

  // Client routes
  "/client": ["client"],
  "/client/dashboard": ["client"],

  // Merchant routes
  "/merchant": ["merchant"],
  "/merchant/dashboard": ["merchant"],

  // Distributor routes
  "/distributor": ["distributor"],
  "/distributor/dashboard": ["distributor"],

  // Diaspora routes
  "/diaspora": ["diaspora"],
  "/diaspora/dashboard": ["diaspora"],

  // Admin routes
  "/admin": ["admin", "super_admin"],
  "/admin/dashboard": ["admin", "super_admin"],

  // Super Admin routes
  "/super-admin": ["super_admin"],
  "/super-admin/dashboard": ["super_admin"],

  // Regional Manager routes
  "/regional-manager": ["regional_manager", "super_admin"],
  "/regional-manager/dashboard": ["regional_manager", "super_admin"],

  // Support Agent routes
  "/support-agent": ["support_agent", "admin", "super_admin"],
  "/support-agent/dashboard": ["support_agent", "admin", "super_admin"],
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
  // Remove locale from pathname for route matching
  const pathWithoutLocale = removeLocaleFromPathname(pathname);
  
  // Exact match first
  if (ROUTE_PERMISSIONS[pathWithoutLocale]) {
    return ROUTE_PERMISSIONS[pathWithoutLocale];
  }

  // Find the most specific match
  const matchingRoutes = Object.keys(ROUTE_PERMISSIONS)
    .filter(route => pathWithoutLocale.startsWith(route))
    .sort((a, b) => b.length - a.length);

  if (matchingRoutes.length > 0) {
    return ROUTE_PERMISSIONS[matchingRoutes[0]];
  }

  return [];
}

// Helper function to get dashboard redirect for role
function getDashboardRedirect(role: string, locale: string): string {
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

  const dashboard = dashboardRoutes[role] || "/client/dashboard";
  return `/${locale}${dashboard}`;
}

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    try {
      const { pathname } = request.nextUrl;
      
      // Handle API routes and static files first
      if (pathname.startsWith('/api/') || 
          pathname.startsWith('/_next/') || 
          pathname.startsWith('/favicon.ico') ||
          pathname.startsWith('/images/') ||
          pathname.startsWith('/icons/')) {
        return NextResponse.next();
      }

      // Get locale from pathname
      const locale = getLocaleFromPathname(pathname) || defaultLocale;
      const pathWithoutLocale = removeLocaleFromPathname(pathname);
      
      // Handle root path - redirect to default locale
      if (pathname === '/') {
        return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
      }

      // If no locale in path, redirect to add default locale
      if (!getLocaleFromPathname(pathname) && pathname !== '/') {
        return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
      }

      const token = request.nextauth.token;

      // Allow public routes
      if (isPublicRoute(pathWithoutLocale)) {
        return intlMiddleware(request);
      }

      // If no token, redirect to login with locale
      if (!token) {
        const loginUrl = new URL(`/${locale}/auth/login`, request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Check if user's email is verified
      if (!token.isVerified && !pathWithoutLocale.startsWith("/auth/verify-email")) {
        const verifyUrl = new URL(`/${locale}/auth/verify-email`, request.url);
        return NextResponse.redirect(verifyUrl);
      }

      // Get allowed roles for this route
      const allowedRoles = getAllowedRoles(pathname);
      const userRole = token.role as string;

      // If route requires specific roles, check if user has access
      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        const userDashboard = getDashboardRedirect(userRole, locale);
        return NextResponse.redirect(new URL(userDashboard, request.url));
      }

      // Special handling for root dashboard routes
      if (pathWithoutLocale === "/dashboard") {
        const userDashboard = getDashboardRedirect(userRole, locale);
        return NextResponse.redirect(new URL(userDashboard, request.url));
      }

      // Apply internationalization middleware for authenticated routes
      return intlMiddleware(request);
    } catch (error) {
      console.error("Middleware error:", error);
      return intlMiddleware(request);
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        try {
          const { pathname } = req.nextUrl;
          const pathWithoutLocale = removeLocaleFromPathname(pathname);
          
          // Allow public routes
          if (isPublicRoute(pathWithoutLocale) || 
              pathname.startsWith('/api/') || 
              pathname.startsWith('/_next/') ||
              pathname === '/') {
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
