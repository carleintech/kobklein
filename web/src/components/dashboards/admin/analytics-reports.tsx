import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import {
  Activity,
  BarChart3,
  Calendar,
  DollarSign,
  Download,
  Filter,
  PieChart,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

interface AnalyticsData {
  totalRevenue: number;
  revenueGrowth: number;
  totalTransactions: number;
  transactionGrowth: number;
  activeUsers: number;
  userGrowth: number;
  averageTransactionValue: number;
  avgValueGrowth: number;

  // Time series data
  revenueByMonth: { month: string; revenue: number }[];
  transactionsByType: { type: string; count: number; percentage: number }[];
  usersByRole: { role: string; count: number; percentage: number }[];
  topCountries: { country: string; users: number; revenue: number }[];

  // Performance metrics
  conversionRate: number;
  retentionRate: number;
  averageSessionDuration: number;
  bounceRate: number;
}

interface AnalyticsReportsProps {
  analytics: AnalyticsData;
}

export function AnalyticsReports({ analytics }: AnalyticsReportsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-600" : "text-red-600";
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
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

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Analytics & Reports</h2>
              <p className="text-muted-foreground">
                Comprehensive business insights and performance metrics
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                size="sm"
                className="bg-kobklein-primary hover:bg-kobklein-primary/90"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analytics.totalRevenue)}
            </div>
            <div
              className={`text-xs flex items-center ${getGrowthColor(
                analytics.revenueGrowth
              )}`}
            >
              {getGrowthIcon(analytics.revenueGrowth)}
              <span className="ml-1">
                {formatPercentage(analytics.revenueGrowth)} from last month
              </span>
            </div>
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
              {analytics.totalTransactions.toLocaleString()}
            </div>
            <div
              className={`text-xs flex items-center ${getGrowthColor(
                analytics.transactionGrowth
              )}`}
            >
              {getGrowthIcon(analytics.transactionGrowth)}
              <span className="ml-1">
                {formatPercentage(analytics.transactionGrowth)} from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.activeUsers.toLocaleString()}
            </div>
            <div
              className={`text-xs flex items-center ${getGrowthColor(
                analytics.userGrowth
              )}`}
            >
              {getGrowthIcon(analytics.userGrowth)}
              <span className="ml-1">
                {formatPercentage(analytics.userGrowth)} from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Transaction Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analytics.averageTransactionValue)}
            </div>
            <div
              className={`text-xs flex items-center ${getGrowthColor(
                analytics.avgValueGrowth
              )}`}
            >
              {getGrowthIcon(analytics.avgValueGrowth)}
              <span className="ml-1">
                {formatPercentage(analytics.avgValueGrowth)} from last month
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Revenue Trends (Last 12 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <div className="text-lg font-medium text-muted-foreground">
                Revenue Chart
              </div>
              <div className="text-sm text-muted-foreground">
                Interactive chart would be rendered here
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                {analytics.revenueByMonth.slice(-3).map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="font-medium">{item.month}</div>
                    <div className="text-muted-foreground">
                      {formatCurrency(item.revenue)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Transactions by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.transactionsByType.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        index === 0
                          ? "bg-blue-500"
                          : index === 1
                          ? "bg-green-500"
                          : index === 2
                          ? "bg-yellow-500"
                          : index === 3
                          ? "bg-purple-500"
                          : "bg-gray-500"
                      }`}
                    />
                    <span className="font-medium">{item.type}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      {item.count.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Users by Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.usersByRole.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge className={getRoleColor(item.role)}>
                      {item.role.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      {item.count.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Top Countries by Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.topCountries.map((country, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-kobklein-primary rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{country.country}</div>
                    <div className="text-sm text-muted-foreground">
                      {country.users.toLocaleString()} users
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {formatCurrency(country.revenue)}
                  </div>
                  <div className="text-sm text-muted-foreground">Revenue</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-kobklein-primary">
                {analytics.conversionRate}%
              </div>
              <div className="text-sm text-muted-foreground">
                Conversion Rate
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-kobklein-primary">
                {analytics.retentionRate}%
              </div>
              <div className="text-sm text-muted-foreground">
                User Retention
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-kobklein-primary">
                {analytics.averageSessionDuration}m
              </div>
              <div className="text-sm text-muted-foreground">Avg Session</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-kobklein-primary">
                {analytics.bounceRate}%
              </div>
              <div className="text-sm text-muted-foreground">Bounce Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

