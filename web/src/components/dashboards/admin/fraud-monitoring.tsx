// File: kobklein/web/src/components/dashboards/admin/fraud-monitoring.tsx

"use client";

import { useState } from "react";
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp,
  Clock,
  MapPin,
  DollarSign,
  Eye,
  Ban,
  CheckCircle
} from "lucide-react";

import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/lib/toast";

interface FraudAlert {
  id: string;
  type: 'suspicious_volume' | 'multiple_locations' | 'unusual_pattern' | 'velocity_check' | 'device_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId: string;
  userName: string;
  userRole: string;
  description: string;
  details: {
    amount?: number;
    location?: string;
    pattern?: string;
    timeFrame?: string;
  };
  timestamp: string;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string;
}

interface FraudMonitoringProps {
  alerts: FraudAlert[];
  stats: {
    totalAlerts: number;
    openAlerts: number;
    resolvedToday: number;
    falsePositiveRate: number;
  };
}

export function FraudMonitoring({ alerts, stats }: FraudMonitoringProps) {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'investigating' | 'resolved'>('open');
  const [processingAlert, setProcessingAlert] = useState<string | null>(null);
  
  const { toast } = useToast();

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    return matchesSeverity && matchesStatus;
  });

  const handleAlertAction = async (alertId: string, action: 'investigate' | 'resolve' | 'false_positive') => {
    setProcessingAlert(alertId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const actionMessages = {
        investigate: 'Alert marked for investigation',
        resolve: 'Alert resolved successfully',
        false_positive: 'Alert marked as false positive',
      };
      
      toast.success(actionMessages[action]);
    } catch (error) {
      toast.error('Action failed. Please try again.');
    } finally {
      setProcessingAlert(null);
    }
  };

  const getSeverityBadge = (severity: FraudAlert['severity']) => {
    const variants = {
      low: 'bg-blue-100 text-blue-700 border-blue-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      critical: 'bg-red-100 text-red-700 border-red-200',
    };

    return (
      <Badge variant="outline" className={variants[severity]}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: FraudAlert['status']) => {
    const variants = {
      open: 'bg-red-100 text-red-700 border-red-200',
      investigating: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      resolved: 'bg-green-100 text-green-700 border-green-200',
      false_positive: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    return (
      <Badge variant="outline" className={variants[status]}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  const getAlertIcon = (type: FraudAlert['type']) => {
    switch (type) {
      case 'suspicious_volume':
        return <DollarSign className="h-4 w-4" />;
      case 'multiple_locations':
        return <MapPin className="h-4 w-4" />;
      case 'unusual_pattern':
        return <TrendingUp className="h-4 w-4" />;
      case 'velocity_check':
        return <Clock className="h-4 w-4" />;
      case 'device_anomaly':
        return <Shield className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Fraud Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KobKleinCard className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Alerts</p>
              <p className="text-xl font-bold">{stats.totalAlerts}</p>
            </div>
          </div>
        </KobKleinCard>

        <KobKleinCard className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Open Alerts</p>
              <p className="text-xl font-bold text-yellow-600">{stats.openAlerts}</p>
            </div>
          </div>
        </KobKleinCard>

        <KobKleinCard className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Resolved Today</p>
              <p className="text-xl font-bold text-green-600">{stats.resolvedToday}</p>
            </div>
          </div>
        </KobKleinCard>

        <KobKleinCard className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">False Positive Rate</p>
              <p className="text-xl font-bold text-blue-600">{stats.falsePositiveRate}%</p>
            </div>
          </div>
        </KobKleinCard>
      </div>

      {/* Fraud Alerts */}
      <KobKleinCard className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-semibold">Fraud Alerts</h3>
              <Badge variant="outline" className="bg-red-100 text-red-700">
                {filteredAlerts.filter(a => a.status === 'open').length} Open
              </Badge>
            </div>
          </div>

          {/* Filters */}
          <div className="flex space-x-4">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Alerts List */}
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No fraud alerts found</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border rounded-lg p-4 ${
                    alert.severity === 'critical' ? 'border-red-300 bg-red-50' :
                    alert.severity === 'high' ? 'border-orange-300 bg-orange-50' :
                    'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        alert.severity === 'critical' ? 'bg-red-100' :
                        alert.severity === 'high' ? 'bg-orange-100' :
                        alert.severity === 'medium' ? 'bg-yellow-100' :
                        'bg-blue-100'
                      }`}>
                        {getAlertIcon(alert.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{alert.description}</h4>
                          {getSeverityBadge(alert.severity)}
                          {getStatusBadge(alert.status)}
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>User: {alert.userName} ({alert.userRole})</p>
                          {alert.details.amount && (
                            <p>Amount: {formatCurrency(alert.details.amount, 'HTG')}</p>
                          )}
                          {alert.details.location && (
                            <p>Location: {alert.details.location}</p>
                          )}
                          <p>Time: {formatDate(alert.timestamp, { relative: true })}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {alert.status === 'open' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAlertAction(alert.id, 'investigate')}
                            loading={processingAlert === alert.id}
                          >
                            Investigate
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleAlertAction(alert.id, 'false_positive')}
                            loading={processingAlert === alert.id}
                          >
                            False Positive
                          </Button>
                        </>
                      )}
                      
                      {alert.status === 'investigating' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAlertAction(alert.id, 'resolve')}
                          loading={processingAlert === alert.id}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </KobKleinCard>
    </div>
  );
}