import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import {
  Activity,
  AlertTriangle,
  DollarSign,
  Eye,
  Filter,
  MoreVertical,
  Settings,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  totalVolume: number;
  pendingVerifications: number;
  reportedIssues: number;
  systemHealth: "good" | "warning" | "critical";
  dailyGrowth: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "client" | "merchant" | "distributor" | "diaspora";
  status: "active" | "inactive" | "suspended";
  joinDate: string;
  lastActive: string;
  totalTransactions: number;
  totalVolume: number;
  kycStatus: "verified" | "pending" | "rejected";
}

interface SystemOverviewProps {
  metrics: SystemMetrics;
  recentUsers: User[];
}

export function SystemOverview({ metrics, recentUsers }: SystemOverviewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getKycColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "client":
        return "bg-blue-100 text-blue-800";
      case "merchant":
        return "bg-purple-100 text-purple-800";
      case "distributor":
        return "bg-orange-100 text-orange-800";
      case "diaspora":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case "good":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case "good":
        return "🟢";
      case "warning":
        return "🟡";
      case "critical":
        return "🔴";
      default:
        return "⚪";
    }
  };

  return (
    <div className="space-y-6">
      {/* System Health Banner */}
      <Card
        className={`border-l-4 ${
          metrics.systemHealth === "good"
            ? "border-l-green-500"
            : metrics.systemHealth === "warning"
            ? "border-l-yellow-500"
            : "border-l-red-500"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">
                {getHealthIcon(metrics.systemHealth)}
              </span>
              <div>
                <div className="font-medium">System Status</div>
                <div
                  className={`text-sm ${getHealthColor(metrics.systemHealth)}`}
                >
                  {metrics.systemHealth.toUpperCase()} - All systems operational
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{metrics.dailyGrowth}% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.activeUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {((metrics.activeUsers / metrics.totalUsers) * 100).toFixed(1)}%
              of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.totalVolume.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.totalTransactions.toLocaleString()} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Actions
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.pendingVerifications + metrics.reportedIssues}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.pendingVerifications} KYC + {metrics.reportedIssues}{" "}
              issues
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col space-y-2 bg-kobklein-primary hover:bg-kobklein-primary/90">
              <UserCheck className="h-6 w-6" />
              <span className="text-sm">Review KYC</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <AlertTriangle className="h-6 w-6" />
              <span className="text-sm">Handle Issues</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">View Analytics</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Settings className="h-6 w-6" />
              <span className="text-sm">System Config</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent User Activity</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-kobklein-primary rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="font-medium">{user.name}</div>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Joined {user.joinDate} • Last active {user.lastActive}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      ${user.totalVolume.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.totalTransactions} transactions
                    </div>
                    <Badge className={getKycColor(user.kycStatus)}>
                      KYC: {user.kycStatus.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="font-medium">KYC Verification Backlog</div>
                  <div className="text-sm text-muted-foreground">
                    {metrics.pendingVerifications} users waiting for
                    verification
                  </div>
                </div>
              </div>
              <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                Review Now
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium">Reported Issues</div>
                  <div className="text-sm text-muted-foreground">
                    {metrics.reportedIssues} issues require attention
                  </div>
                </div>
              </div>
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                Handle Issues
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

