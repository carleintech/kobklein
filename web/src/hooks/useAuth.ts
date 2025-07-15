// File: kobklein/web/src/hooks/useAuth.ts
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { hasRole, hasPermission, getDashboardRoute } from "@/lib/auth";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = useMemo(() => {
    if (!session?.user) return null;
    
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      isVerified: session.user.isVerified,
      profile: session.user.profile,
    };
  }, [session]);

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && !!user;
  const isUnauthenticated = status === "unauthenticated";

  // Role checking functions
  const checkRole = (requiredRoles: string | string[]) => {
    if (!user) return false;
    
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return hasRole(user.role, roles);
  };

  const checkPermission = (permission: string) => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  };

  // Navigation functions
  const redirectToDashboard = () => {
    if (!user) return;
    const dashboardRoute = getDashboardRoute(user.role);
    router.push(dashboardRoute);
  };

  const redirectToLogin = () => {
    router.push("/auth/login");
  };

  const logout = async () => {
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: "/" 
      });
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Role-specific checks
  const isClient = user?.role === "client";
  const isMerchant = user?.role === "merchant";
  const isDistributor = user?.role === "distributor";
  const isDiaspora = user?.role === "diaspora";
  const isAdmin = user?.role === "admin";
  const isSuperAdmin = user?.role === "super_admin";
  const isRegionalManager = user?.role === "regional_manager";
  const isSupportAgent = user?.role === "support_agent";

  // Permission-specific checks
  const canManageUsers = checkPermission("user:manage");
  const canViewReports = checkPermission("reports:view");
  const canProcessRefills = checkPermission("refill:process");
  const canSendRemittances = checkPermission("remittance:send");
  const canManageBusiness = checkPermission("business:manage");

  // Admin or super admin check
  const isAdminOrSuper = isAdmin || isSuperAdmin;

  // Staff member check (any admin role)
  const isStaff = isAdmin || isSuperAdmin || isRegionalManager || isSupportAgent;

  return {
    // Session state
    user,
    session,
    isLoading,
    isAuthenticated,
    isUnauthenticated,

    // Role checks
    checkRole,
    checkPermission,
    isClient,
    isMerchant,
    isDistributor,
    isDiaspora,
    isAdmin,
    isSuperAdmin,
    isRegionalManager,
    isSupportAgent,
    isAdminOrSuper,
    isStaff,

    // Permission checks
    canManageUsers,
    canViewReports,
    canProcessRefills,
    canSendRemittances,
    canManageBusiness,

    // Actions
    logout,
    redirectToDashboard,
    redirectToLogin,
  };
}

// Higher-order component for role-based access
export function useRequireAuth(
  requiredRoles?: string | string[],
  redirectTo: string = "/auth/login"
) {
  const auth = useAuth();
  const router = useRouter();

  // Check if user is loading
  if (auth.isLoading) {
    return { ...auth, hasAccess: false };
  }

  // Check if user is authenticated
  if (!auth.isAuthenticated) {
    router.push(redirectTo);
    return { ...auth, hasAccess: false };
  }

  // Check if user has required role
  if (requiredRoles && !auth.checkRole(requiredRoles)) {
    router.push("/unauthorized");
    return { ...auth, hasAccess: false };
  }

  return { ...auth, hasAccess: true };
}

// Hook for checking if user can access a specific feature
export function useFeatureAccess(feature: string) {
  const auth = useAuth();

  const featurePermissions: Record<string, string[]> = {
    wallet: ["wallet:read"],
    transactions: ["transaction:create", "transaction:receive"],
    refills: ["refill:process"],
    remittances: ["remittance:send"],
    userManagement: ["user:manage"],
    reports: ["reports:view"],
    businessManagement: ["business:manage"],
    support: ["support:provide"],
  };

  const requiredPermissions = featurePermissions[feature] || [];
  const hasAccess = requiredPermissions.some(permission => 
    auth.checkPermission(permission)
  );

  return {
    hasAccess,
    user: auth.user,
    isLoading: auth.isLoading,
  };
}