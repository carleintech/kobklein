// File: kobklein/web/src/components/dashboards/distributor/refill-requests.tsx

"use client";

import { useState } from "react";
import { 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  XCircle,
  MapPin,
  Phone,
  User,
  Store,
  Filter,
  Search
} from "lucide-react";

import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Button } from "@/components/ui/enhanced-button";
import { KobKleinInput } from "@/components/ui/form-field";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/lib/toast";

interface RefillRequest {
  id: string;
  requesterName: string;
  requesterType: 'client' | 'merchant';
  phone: string;
  location: string;
  amount: number;
  requestDate: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'accepted' | 'completed' | 'rejected';
  note?: string;
  businessName?: string;
}

interface RefillRequestsProps {
  requests: RefillRequest[];
}

export function RefillRequests({ requests }: RefillRequestsProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'completed'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);
  
  const { toast } = useToast();

  const filteredRequests = requests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesSearch = 
      request.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.phone.includes(searchTerm) ||
      request.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const handleAcceptRequest = async (requestId: string) => {
    setProcessingRequest(requestId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Refill request accepted! You can now meet the client.');
      
      // In real app, this would update the request status
    } catch (error) {
      toast.error('Failed to accept request. Please try again.');
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleCompleteRequest = async (requestId: string) => {
    setProcessingRequest(requestId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Refill completed! Commission has been added to your account.');
      
      // In real app, this would mark as completed and add commission
    } catch (error) {
      toast.error('Failed to complete request. Please try again.');
    } finally {
      setProcessingRequest(null);
    }
  };

  const getStatusIcon = (status: RefillRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: RefillRequest['status']) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      accepted: 'bg-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
    };

    return (
      <Badge variant="outline" className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getUrgencyColor = (urgency: RefillRequest['urgency']) => {
    switch (urgency) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
    }
  };

  return (
    <KobKleinCard className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <RefreshCw className="h-5 w-5 text-kobklein-accent" />
            <h3 className="text-lg font-semibold">Refill Requests</h3>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">
              {filteredRequests.filter(r => r.status === 'pending').length} Pending
            </Badge>
          </div>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <KobKleinInput
              placeholder="Search by name, phone, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <RefreshCw className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No refill requests found</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div
                key={request.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-10 h-10 bg-kobklein-accent rounded-full flex items-center justify-center">
                      {request.requesterType === 'merchant' ? (
                        <Store className="h-5 w-5 text-white" />
                      ) : (
                        <User className="h-5 w-5 text-white" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium truncate">{request.requesterName}</h4>
                        {request.businessName && (
                          <span className="text-sm text-muted-foreground">
                            ({request.businessName})
                          </span>
                        )}
                        <span className={`text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{request.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{request.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm">
                        <span className="font-medium">
                          Amount: {formatCurrency(request.amount, 'HTG')}
                        </span>
                        <span className="text-muted-foreground">
                          {formatDate(request.requestDate, { relative: true })}
                        </span>
                      </div>

                      {request.note && (
                        <p className="text-sm text-muted-foreground mt-2 italic">
                          Note: {request.note}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(request.status)}
                    
                    <div className="flex space-x-2">
                      {request.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAcceptRequest(request.id)}
                            loading={processingRequest === request.id}
                            loadingText="Accepting..."
                          >
                            Accept
                          </Button>
                          <Button variant="ghost" size="sm">
                            Reject
                          </Button>
                        </>
                      )}
                      
                      {request.status === 'accepted' && (
                        <Button
                          variant="kobklein"
                          size="sm"
                          onClick={() => handleCompleteRequest(request.id)}
                          loading={processingRequest === request.id}
                          loadingText="Completing..."
                        >
                          Mark Complete
                        </Button>
                      )}
                      
                      {request.status === 'completed' && (
                        <span className="text-sm text-green-600 font-medium">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        {requests.length > 0 && (
          <div className="border-t pt-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-lg font-bold">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
              <div>
                <p className="text-lg font-bold">
                  {requests.filter(r => r.status === 'accepted').length}
                </p>
                <p className="text-xs text-muted-foreground">Accepted</p>
              </div>
              <div>
                <p className="text-lg font-bold">
                  {requests.filter(r => r.status === 'completed').length}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div>
                <p className="text-lg font-bold">
                  {formatCurrency(
                    requests
                      .filter(r => r.status === 'completed')
                      .reduce((sum, r) => sum + (r.amount * 0.02), 0), // 2% commission
                    'HTG'
                  )}
                </p>
                <p className="text-xs text-muted-foreground">Commission</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </KobKleinCard>
  );
}