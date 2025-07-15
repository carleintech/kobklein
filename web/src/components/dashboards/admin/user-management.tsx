// File: kobklein/web/src/components/dashboards/admin/user-management.tsx

"use client";

import { useState } from "react";
import { 
  Users, 
  Search, 
  Filter,
  MoreHorizontal,
  Ban,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  UserX
} from "lucide-react";

import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Button } from "@/components/ui/enhanced-button";
import { KobKleinInput } from "@/components/ui/form-field";
import { Badge } from "@/components/ui/badge";
import { RoleBadge } from "@/components/auth/role-badge";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/lib/toast";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'client' | 'merchant' | 'distributor' | 'diaspora' | 'admin';
  status: 'active' | 'suspended' | 'pending' | 'banned';
  location: string;
  joinDate: string;
  lastActive: string;
  totalTransactions: number;
  totalVolume: number;
  verificationStatus: 'verified' | 'unverified' | 'pending';
}

interface UserManagementProps {
  users: AdminUser[];
}

export function UserManagement({ users }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'client' | 'merchant' | 'distributor' | 'diaspora' | 'admin'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended' | 'pending' | 'banned'>('all');
  const [processingUser, setProcessingUser] = useState<string | null>(null);
  
  const { toast } = useToast();

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserAction = async (userId: string, action: 'suspend' | 'activate' | 'ban' | 'verify') => {
    setProcessingUser(userId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const actionMessages = {
        suspend: 'User suspended successfully',
        activate: 'User activated successfully',
        ban: 'User banned successfully',
        verify: 'User verified successfully',
      };
      
      toast.success(actionMessages[action]);
    } catch (error) {
      toast.error('Action failed. Please try again.');
    } finally {
      setProcessingUser(null);
    }
  };

  const getStatusBadge = (status: AdminUser['status']) => {
    const variants = {
      active: 'bg-green-100 text-green-700 border-green-200',
      suspended: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      pending: 'bg-blue-100 text-blue-700 border-blue-200',
      banned: 'bg-red-100 text-red-700 border-red-200',
    };

    return (
      <Badge variant="outline" className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getVerificationBadge = (status: AdminUser['verificationStatus']) => {
    if (status === 'verified') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (status === 'pending') {
      return <XCircle className="h-4 w-4 text-yellow-500" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <KobKleinCard className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-kobklein-accent" />
            <h3 className="text-lg font-semibold">User Management</h3>
            <Badge variant="outline">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <KobKleinInput
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          
          <div className="flex space-x-2">
            {/* Role Filter */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Roles</option>
              <option value="client">Client</option>
              <option value="merchant">Merchant</option>
              <option value="distributor">Distributor</option>
              <option value="diaspora">Diaspora</option>
              <option value="admin">Admin</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>

        {/* User List */}
        <div className="space-y-3">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No users found</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-10 h-10 bg-kobklein-accent rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium truncate">{user.name}</h4>
                      {getVerificationBadge(user.verificationStatus)}
                      <RoleBadge role={user.role} showIcon={false} variant="outline" />
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{user.email}</span>
                      <span>{user.phone}</span>
                      <span>{user.location}</span>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                      <span>Joined: {formatDate(user.joinDate)}</span>
                      <span>Last active: {formatDate(user.lastActive, { relative: true })}</span>
                      <span>{user.totalTransactions} transactions</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(user.status)}
                  
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>

                    {user.status === 'active' ? (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleUserAction(user.id, 'suspend')}
                        loading={processingUser === user.id}
                      >
                        <Ban className="h-4 w-4 text-yellow-600" />
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleUserAction(user.id, 'activate')}
                        loading={processingUser === user.id}
                      >
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                    
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        {users.length > 0 && (
          <div className="border-t pt-4">
            <div className="grid grid-cols-5 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-green-600">
                  {users.filter(u => u.status === 'active').length}
                </p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
              <div>
                <p className="text-lg font-bold text-yellow-600">
                  {users.filter(u => u.status === 'suspended').length}
                </p>
                <p className="text-xs text-muted-foreground">Suspended</p>
              </div>
              <div>
                <p className="text-lg font-bold text-blue-600">
                  {users.filter(u => u.status === 'pending').length}
                </p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
              <div>
                <p className="text-lg font-bold text-red-600">
                  {users.filter(u => u.status === 'banned').length}
                </p>
                <p className="text-xs text-muted-foreground">Banned</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-600">
                  {users.filter(u => u.verificationStatus === 'verified').length}
                </p>
                <p className="text-xs text-muted-foreground">Verified</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </KobKleinCard>
  );
}