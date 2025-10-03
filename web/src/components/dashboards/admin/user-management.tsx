import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  Search,
  UserCheck,
  Users,
  UserX,
  XCircle,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "client" | "merchant" | "distributor" | "diaspora";
  kycStatus: "verified" | "pending" | "rejected" | "incomplete";
  kycSubmissionDate: string;
  documents: {
    idCard: boolean;
    proofOfAddress: boolean;
    businessLicense?: boolean;
    bankStatement: boolean;
  };
  riskLevel: "low" | "medium" | "high";
  rejectionReason?: string;
  notes?: string;
}

interface UserManagementProps {
  users: User[];
}

export function UserManagement({ users }: UserManagementProps) {
  const totalUsers = users.length;
  const verifiedUsers = users.filter((u) => u.kycStatus === "verified").length;
  const pendingUsers = users.filter((u) => u.kycStatus === "pending").length;
  const rejectedUsers = users.filter((u) => u.kycStatus === "rejected").length;

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "incomplete":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getKycStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "incomplete":
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDocumentCompleteness = (documents: User["documents"]) => {
    const required = ["idCard", "proofOfAddress", "bankStatement"];
    const submitted = required.filter(
      (doc) => documents[doc as keyof typeof documents]
    ).length;
    const total =
      required.length + (documents.businessLicense !== undefined ? 1 : 0);
    return `${submitted}/${total}`;
  };

  return (
    <div className="space-y-6">
      {/* KYC Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              All registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedUsers}</div>
            <p className="text-xs text-muted-foreground">
              {((verifiedUsers / totalUsers) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingUsers}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting verification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedUsers}</div>
            <p className="text-xs text-muted-foreground">Verification failed</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending KYC Reviews */}
      {pendingUsers > 0 && (
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-yellow-600" />
              Pending KYC Reviews ({pendingUsers})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users
                .filter((u) => u.kycStatus === "pending")
                .slice(0, 3)
                .map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.email} • Submitted {user.kycSubmissionDate}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Documents: {getDocumentCompleteness(user.documents)}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Review
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              {pendingUsers > 3 && (
                <Button variant="outline" className="w-full">
                  View All {pendingUsers} Pending Reviews
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Management Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>User Management</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-kobklein-primary"
              />
            </div>
            <select
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-kobklein-primary"
              title="Filter by user role"
            >
              <option value="">All Roles</option>
              <option value="client">Client</option>
              <option value="merchant">Merchant</option>
              <option value="distributor">Distributor</option>
              <option value="diaspora">Diaspora</option>
            </select>
            <select
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-kobklein-primary"
              title="Filter by KYC status"
            >
              <option value="">All KYC Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>

          {/* Users List */}
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-kobklein-primary rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="font-medium">{user.name}</div>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role.toUpperCase()}
                      </Badge>
                      <Badge className={getKycStatusColor(user.kycStatus)}>
                        {getKycStatusIcon(user.kycStatus)}
                        {user.kycStatus.toUpperCase()}
                      </Badge>
                      <Badge className={getRiskColor(user.riskLevel)}>
                        RISK: {user.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.email} • {user.phone}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      KYC Submitted: {user.kycSubmissionDate} • Documents:{" "}
                      {getDocumentCompleteness(user.documents)}
                    </div>
                    {user.rejectionReason && (
                      <div className="text-xs text-red-600 mt-1">
                        Rejected: {user.rejectionReason}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="h-3 w-3 mr-1" />
                    Documents
                  </Button>
                  {user.kycStatus === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        <XCircle className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {users.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <div className="text-lg font-medium text-muted-foreground">
                No users found
              </div>
              <div className="text-sm text-muted-foreground">
                Users will appear here as they register
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

