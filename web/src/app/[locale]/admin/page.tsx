import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { UserRole } from "@/types/auth";
import {
    Activity,
    AlertTriangle,
    BarChart3,
    CheckCircle,
    Database,
    DollarSign,
    Settings,
    Shield,
    UserCheck,
    Users
} from "lucide-react";

export default function AdminDashboard() {
  // Sample admin data
  const systemStats = {
    totalUsers: 15420,
    activeUsers: 12680,
    totalTransactions: 145650,
    totalVolume: 125800000, // HTG
    systemHealth: "Excellent",
    uptime: "99.9%",
  };

  const usersByRole = [
    { role: "CLIENT", count: 12800, percentage: 83 },
    { role: "MERCHANT", count: 1850, percentage: 12 },
    { role: "DIASPORA", count: 650, percentage: 4.2 },
    { role: "DISTRIBUTOR", count: 115, percentage: 0.7 },
    { role: "ADMIN", count: 5, percentage: 0.1 },
  ];

  const recentActivity = [
    {
      id: "1",
      type: "user_created",
      description: "New merchant account created",
      user: "Jean Baptiste",
      timestamp: "2 minutes ago",
      status: "success",
    },
    {
      id: "2",
      type: "security_alert",
      description: "Multiple failed login attempts detected",
      user: "Security System",
      timestamp: "15 minutes ago",
      status: "warning",
    },
    {
      id: "3",
      type: "system_update",
      description: "Payment processor updated successfully",
      user: "System",
      timestamp: "1 hour ago",
      status: "success",
    },
    {
      id: "4",
      type: "role_change",
      description: "User role updated from CLIENT to MERCHANT",
      user: "Marie Delva",
      timestamp: "2 hours ago",
      status: "info",
    },
    {
      id: "5",
      type: "compliance_check",
      description: "Daily compliance check completed",
      user: "Compliance System",
      timestamp: "3 hours ago",
      status: "success",
    },
  ];

  const pendingApprovals = [
    {
      id: "1",
      type: "Merchant Application",
      applicant: "Petit Commerce S.A.",
      submittedDate: "2025-01-14",
      priority: "High",
      status: "Pending Review",
    },
    {
      id: "2",
      type: "Distributor Expansion",
      applicant: "Haiti Distribution Co.",
      submittedDate: "2025-01-13",
      priority: "Medium",
      status: "Documents Required",
    },
    {
      id: "3",
      type: "Compliance Report",
      applicant: "Internal Audit",
      submittedDate: "2025-01-12",
      priority: "High",
      status: "Under Review",
    },
  ];

  const adminNavigation = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: "Home" as const,
      isActive: true,
    },
    {
      label: "User Management",
      href: "/admin/users",
      icon: "Users" as const,
    },
    {
      label: "Role & Permissions",
      href: "/admin/roles",
      icon: "Shield" as const,
    },
    {
      label: "Card Management",
      href: "/admin/cards",
      icon: "CreditCard" as const,
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: "BarChart3" as const,
    },
    {
      label: "Compliance",
      href: "/admin/compliance",
      icon: "FileText" as const,
    },
    {
      label: "System Health",
      href: "/admin/system",
      icon: "Activity" as const,
    },
    {
      label: "Database",
      href: "/admin/database",
      icon: "Database" as const,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: "Settings" as const,
    },
  ];

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <DashboardLayout
        title="Admin Control Center"
        userRole={UserRole.ADMIN}
        navigation={adminNavigation}
        notifications={8}
      >
        {/* System Overview Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemStats.totalUsers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {systemStats.activeUsers.toLocaleString()} active users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Transactions
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemStats.totalTransactions.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Volume
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                HTG {(systemStats.totalVolume / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">
                +18% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                System Health
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {systemStats.systemHealth}
              </div>
              <p className="text-xs text-muted-foreground">
                Uptime: {systemStats.uptime}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* User Distribution */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>User Distribution by Role</CardTitle>
              <CardDescription>
                Breakdown of users across different roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usersByRole.map((roleData) => (
                  <div
                    key={roleData.role}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          roleData.role === "CLIENT"
                            ? "bg-blue-100 text-blue-600"
                            : roleData.role === "MERCHANT"
                            ? "bg-green-100 text-green-600"
                            : roleData.role === "DIASPORA"
                            ? "bg-orange-100 text-orange-600"
                            : roleData.role === "DISTRIBUTOR"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{roleData.role}</p>
                        <p className="text-sm text-muted-foreground">
                          {roleData.count.toLocaleString()} users
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{roleData.percentage}%</p>
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-2 rounded-full ${
                            roleData.role === "CLIENT"
                              ? "bg-blue-500"
                              : roleData.role === "MERCHANT"
                              ? "bg-green-500"
                              : roleData.role === "DIASPORA"
                              ? "bg-orange-500"
                              : roleData.role === "DISTRIBUTOR"
                              ? "bg-purple-500"
                              : "bg-red-500"
                          }`}
                          data-width={roleData.percentage}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Admin Actions */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Administrative shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2">
                <UserCheck className="h-4 w-4" />
                <span>Approve Users</span>
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Manage Roles</span>
              </button>
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Security Alerts</span>
              </button>
              <button className="w-full border border-gray-300 hover:bg-gray-50 py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>View Reports</span>
              </button>
              <button className="w-full border border-gray-300 hover:bg-gray-50 py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2">
                <Database className="h-4 w-4" />
                <span>Database Admin</span>
              </button>
              <button className="w-full border border-gray-300 hover:bg-gray-50 py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>System Settings</span>
              </button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent System Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent System Activity
              </CardTitle>
              <CardDescription>
                Latest system events and user activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-3 border rounded-lg"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.status === "success"
                          ? "bg-green-100"
                          : activity.status === "warning"
                          ? "bg-orange-100"
                          : activity.status === "info"
                          ? "bg-blue-100"
                          : "bg-gray-100"
                      }`}
                    >
                      {activity.status === "success" && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      {activity.status === "warning" && (
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                      )}
                      {activity.status === "info" && (
                        <Activity className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.user} • {activity.timestamp}
                      </p>
                    </div>
                    <div
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        activity.status === "success"
                          ? "bg-green-100 text-green-800"
                          : activity.status === "warning"
                          ? "bg-orange-100 text-orange-800"
                          : activity.status === "info"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {activity.type.replace("_", " ")}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>
                Items requiring administrative review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{item.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.applicant} • {item.submittedDate}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <div
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          item.priority === "High"
                            ? "bg-red-100 text-red-800"
                            : item.priority === "Medium"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {item.priority}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.status}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="flex space-x-2 pt-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm transition-colors">
                    Review All
                  </button>
                  <button className="flex-1 border border-gray-300 hover:bg-gray-50 py-2 px-3 rounded-md text-sm transition-colors">
                    Bulk Actions
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
