"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  FileText,
  Filter,
  MessageSquare,
  Paperclip,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { formatCurrency } from "@/lib/currency";

// Helper function for status colors
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "approved":
    case "resolved":
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "rejected":
    case "denied":
      return "bg-red-100 text-red-800 border-red-200";
    case "under_review":
    case "investigating":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

interface RefundRequest {
  id: string;
  transactionId: string;
  originalAmount: number;
  requestedAmount: number;
  currency: "HTG" | "USD";
  reason: string;
  category:
    | "product_defect"
    | "service_issue"
    | "unauthorized"
    | "duplicate"
    | "other";
  status: "pending" | "approved" | "rejected" | "processing" | "completed";
  submittedAt: string;
  processedAt?: string;
  submittedBy: {
    id: string;
    name: string;
    type: "client" | "merchant" | "distributor" | "diaspora";
  };
  assignedTo?: {
    id: string;
    name: string;
    role: "support" | "manager" | "admin";
  };
  priority: "low" | "medium" | "high" | "urgent";
  attachments: Array<{
    id: string;
    name: string;
    url: string;
    type: "image" | "document" | "video";
  }>;
  messages: Array<{
    id: string;
    sender: string;
    message: string;
    timestamp: string;
    isAgent: boolean;
  }>;
  resolution?: {
    decision: "full_refund" | "partial_refund" | "credit" | "denied";
    amount?: number;
    notes: string;
    processedBy: string;
    processedAt: string;
  };
}

interface DisputeCase {
  id: string;
  transactionId: string;
  amount: number;
  currency: "HTG" | "USD";
  disputeType: "chargeback" | "fraud" | "service_dispute" | "billing_error";
  status: "open" | "investigation" | "mediation" | "resolved" | "escalated";
  submittedAt: string;
  deadline: string;
  plaintiff: {
    id: string;
    name: string;
    type: "client" | "merchant" | "distributor" | "diaspora";
  };
  defendant: {
    id: string;
    name: string;
    type: "client" | "merchant" | "distributor" | "diaspora";
  };
  description: string;
  evidence: Array<{
    id: string;
    submittedBy: string;
    type: "receipt" | "communication" | "photo" | "document";
    description: string;
    url: string;
    timestamp: string;
  }>;
  timeline: Array<{
    id: string;
    action: string;
    actor: string;
    timestamp: string;
    notes?: string;
  }>;
  mediator?: {
    id: string;
    name: string;
    role: "mediator" | "arbitrator";
  };
  resolution?: {
    outcome: "plaintiff_favor" | "defendant_favor" | "settlement" | "escalated";
    amount?: number;
    terms: string;
    decidedBy: string;
    decidedAt: string;
  };
}

interface RefundDisputeSystemProps {
  userType: "client" | "merchant" | "distributor" | "diaspora" | "admin";
  userId: string;
}

export function RefundDisputeSystem({
  userType,
  userId,
}: RefundDisputeSystemProps) {
  const [activeTab, setActiveTab] = useState<"refunds" | "disputes">("refunds");
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [disputeCases, setDisputeCases] = useState<DisputeCase[]>([]);
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(
    null
  );
  const [selectedDispute, setSelectedDispute] = useState<DisputeCase | null>(
    null
  );
  const [isCreatingRefund, setIsCreatingRefund] = useState(false);
  const [isCreatingDispute, setIsCreatingDispute] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  // Mock data
  useEffect(() => {
    const mockRefunds: RefundRequest[] = [
      {
        id: "REF001",
        transactionId: "TXN123456789",
        originalAmount: 2500,
        requestedAmount: 2500,
        currency: "HTG",
        reason: "Product not delivered as described",
        category: "product_defect",
        status: "pending",
        submittedAt: "2024-01-15T10:30:00Z",
        submittedBy: {
          id: "USER001",
          name: "Jean Baptiste",
          type: "client",
        },
        priority: "medium",
        attachments: [
          {
            id: "ATT001",
            name: "order_receipt.pdf",
            url: "/receipts/order_receipt.pdf",
            type: "document",
          },
        ],
        messages: [
          {
            id: "MSG001",
            sender: "Jean Baptiste",
            message:
              "I ordered a smartphone but received a different model. Requesting full refund.",
            timestamp: "2024-01-15T10:30:00Z",
            isAgent: false,
          },
        ],
      },
      {
        id: "REF002",
        transactionId: "TXN987654321",
        originalAmount: 150,
        requestedAmount: 75,
        currency: "USD",
        reason: "Service only partially completed",
        category: "service_issue",
        status: "approved",
        submittedAt: "2024-01-10T14:20:00Z",
        processedAt: "2024-01-12T09:15:00Z",
        submittedBy: {
          id: "USER002",
          name: "Marie Dupont",
          type: "merchant",
        },
        assignedTo: {
          id: "AGENT001",
          name: "Support Agent",
          role: "support",
        },
        priority: "low",
        attachments: [],
        messages: [
          {
            id: "MSG002",
            sender: "Marie Dupont",
            message:
              "Only half of the catering service was provided for my event.",
            timestamp: "2024-01-10T14:20:00Z",
            isAgent: false,
          },
          {
            id: "MSG003",
            sender: "Support Agent",
            message:
              "We've reviewed your case and approved a 50% refund. Processing now.",
            timestamp: "2024-01-12T09:15:00Z",
            isAgent: true,
          },
        ],
        resolution: {
          decision: "partial_refund",
          amount: 75,
          notes: "Partial service provided, 50% refund approved",
          processedBy: "Support Agent",
          processedAt: "2024-01-12T09:15:00Z",
        },
      },
    ];

    const mockDisputes: DisputeCase[] = [
      {
        id: "DIS001",
        transactionId: "TXN555666777",
        amount: 5000,
        currency: "HTG",
        disputeType: "service_dispute",
        status: "investigation",
        submittedAt: "2024-01-08T16:45:00Z",
        deadline: "2024-01-22T23:59:59Z",
        plaintiff: {
          id: "USER003",
          name: "Pierre Louis",
          type: "client",
        },
        defendant: {
          id: "MERCH001",
          name: "TechStore Haiti",
          type: "merchant",
        },
        description:
          "Merchant refused to honor warranty on electronic device purchased 2 months ago",
        evidence: [
          {
            id: "EVD001",
            submittedBy: "Pierre Louis",
            type: "receipt",
            description: "Original purchase receipt",
            url: "/evidence/receipt_001.pdf",
            timestamp: "2024-01-08T16:45:00Z",
          },
          {
            id: "EVD002",
            submittedBy: "TechStore Haiti",
            type: "communication",
            description: "Email correspondence with customer",
            url: "/evidence/email_thread.pdf",
            timestamp: "2024-01-09T11:20:00Z",
          },
        ],
        timeline: [
          {
            id: "TML001",
            action: "Dispute filed",
            actor: "Pierre Louis",
            timestamp: "2024-01-08T16:45:00Z",
          },
          {
            id: "TML002",
            action: "Merchant notified",
            actor: "System",
            timestamp: "2024-01-08T17:00:00Z",
          },
          {
            id: "TML003",
            action: "Evidence submitted by merchant",
            actor: "TechStore Haiti",
            timestamp: "2024-01-09T11:20:00Z",
          },
        ],
        mediator: {
          id: "MED001",
          name: "Dispute Mediator",
          role: "mediator",
        },
      },
    ];

    setRefundRequests(mockRefunds);
    setDisputeCases(mockDisputes);
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currency === "HTG" ? "G " : "$";
    return `${symbol}${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "completed":
      case "resolved":
        return "text-green-600 bg-green-50";
      case "rejected":
      case "escalated":
        return "text-red-600 bg-red-50";
      case "pending":
      case "open":
        return "text-yellow-600 bg-yellow-50";
      case "processing":
      case "investigation":
      case "mediation":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 bg-red-50";
      case "high":
        return "text-orange-600 bg-orange-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const handleCreateRefund = useCallback(
    async (refundData: any) => {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newRefund: RefundRequest = {
        id: `REF${String(Date.now()).slice(-3)}`,
        ...refundData,
        status: "pending",
        submittedAt: new Date().toISOString(),
        submittedBy: {
          id: userId,
          name: "Current User",
          type: userType as any,
        },
        priority: "medium",
        attachments: [],
        messages: [
          {
            id: `MSG${Date.now()}`,
            sender: "Current User",
            message: refundData.reason,
            timestamp: new Date().toISOString(),
            isAgent: false,
          },
        ],
      };

      setRefundRequests((prev) => [newRefund, ...prev]);
      setIsCreatingRefund(false);
      setLoading(false);
    },
    [userId, userType]
  );

  const handleCreateDispute = useCallback(
    async (disputeData: any) => {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newDispute: DisputeCase = {
        id: `DIS${String(Date.now()).slice(-3)}`,
        ...disputeData,
        status: "open",
        submittedAt: new Date().toISOString(),
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        plaintiff: {
          id: userId,
          name: "Current User",
          type: userType as any,
        },
        evidence: [],
        timeline: [
          {
            id: `TML${Date.now()}`,
            action: "Dispute filed",
            actor: "Current User",
            timestamp: new Date().toISOString(),
          },
        ],
      };

      setDisputeCases((prev) => [newDispute, ...prev]);
      setIsCreatingDispute(false);
      setLoading(false);
    },
    [userId, userType]
  );

  const filteredRefunds = refundRequests.filter((refund) => {
    const matchesSearch =
      refund.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || refund.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredDisputes = disputeCases.filter((dispute) => {
    const matchesSearch =
      dispute.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || dispute.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Refunds & Disputes</h1>
          <p className="text-muted-foreground">
            Manage payment issues and resolution cases
          </p>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={() => setIsCreatingRefund(true)}
            className="bg-kobklein-primary hover:bg-kobklein-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Request Refund
          </Button>
          <Button variant="outline" onClick={() => setIsCreatingDispute(true)}>
            <Plus className="h-4 w-4 mr-2" />
            File Dispute
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("refunds")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "refunds"
                ? "border-kobklein-primary text-kobklein-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Refund Requests
            <Badge variant="secondary" className="ml-2">
              {refundRequests.length}
            </Badge>
          </button>
          <button
            onClick={() => setActiveTab("disputes")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "disputes"
                ? "border-kobklein-primary text-kobklein-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Dispute Cases
            <Badge variant="secondary" className="ml-2">
              {disputeCases.length}
            </Badge>
          </button>
        </nav>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by transaction ID or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="open">Open</option>
                <option value="investigation">Investigation</option>
                <option value="resolved">Resolved</option>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {activeTab === "refunds" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Refund List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredRefunds.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <RefreshCw className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No Refund Requests</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== "all"
                      ? "No refunds match your current filters"
                      : "You haven't submitted any refund requests yet"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredRefunds.map((refund) => (
                <Card
                  key={refund.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedRefund?.id === refund.id
                      ? "ring-2 ring-kobklein-primary"
                      : ""
                  }`}
                  onClick={() => setSelectedRefund(refund)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">
                            #{refund.id}
                          </span>
                          <Badge className={getPriorityColor(refund.priority)}>
                            {refund.priority}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Transaction: {refund.transactionId}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {formatCurrency(
                            refund.requestedAmount,
                            refund.currency
                          )}
                        </div>
                        <Badge className={getStatusColor(refund.status)}>
                          {refund.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-sm mb-3 line-clamp-2">
                      {refund.reason}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div>
                        Submitted{" "}
                        {new Date(refund.submittedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {refund.messages.length}
                        {refund.attachments.length > 0 && (
                          <>
                            <Paperclip className="h-3 w-3 ml-2 mr-1" />
                            {refund.attachments.length}
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Refund Details */}
          <div className="space-y-4">
            {selectedRefund ? (
              <RefundDetails
                refund={selectedRefund}
                onClose={() => setSelectedRefund(null)}
              />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">Select a Refund</h3>
                  <p className="text-muted-foreground text-sm">
                    Choose a refund request to view details and messages
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {activeTab === "disputes" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dispute List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredDisputes.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No Dispute Cases</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== "all"
                      ? "No disputes match your current filters"
                      : "You haven't filed any disputes yet"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredDisputes.map((dispute) => (
                <Card
                  key={dispute.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedDispute?.id === dispute.id
                      ? "ring-2 ring-kobklein-primary"
                      : ""
                  }`}
                  onClick={() => setSelectedDispute(dispute)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">
                            #{dispute.id}
                          </span>
                          <Badge variant="outline">
                            {dispute.disputeType.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Transaction: {dispute.transactionId}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {formatCurrency(dispute.amount, dispute.currency)}
                        </div>
                        <Badge className={getStatusColor(dispute.status)}>
                          {dispute.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-sm mb-3 line-clamp-2">
                      {dispute.description}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div>vs {dispute.defendant.name}</div>
                      <div>
                        Deadline:{" "}
                        {new Date(dispute.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Dispute Details */}
          <div className="space-y-4">
            {selectedDispute ? (
              <DisputeDetails
                dispute={selectedDispute}
                onClose={() => setSelectedDispute(null)}
              />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">Select a Dispute</h3>
                  <p className="text-muted-foreground text-sm">
                    Choose a dispute case to view details and timeline
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Create Refund Modal */}
      {isCreatingRefund && (
        <CreateRefundModal
          onSubmit={handleCreateRefund}
          onClose={() => setIsCreatingRefund(false)}
          loading={loading}
        />
      )}

      {/* Create Dispute Modal */}
      {isCreatingDispute && (
        <CreateDisputeModal
          onSubmit={handleCreateDispute}
          onClose={() => setIsCreatingDispute(false)}
          loading={loading}
        />
      )}
    </div>
  );
}

// Component for refund details
function RefundDetails({
  refund,
  onClose,
}: {
  refund: RefundRequest;
  onClose: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Refund #{refund.id}</CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Status
            </div>
            <Badge className={getStatusColor(refund.status)}>
              {refund.status}
            </Badge>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Amount
            </div>
            <div className="font-bold text-lg">
              {formatCurrency(refund.requestedAmount, refund.currency)}
            </div>
            <div className="text-xs text-muted-foreground">
              of {formatCurrency(refund.originalAmount, refund.currency)}{" "}
              original
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Reason
            </div>
            <div className="text-sm">{refund.reason}</div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-sm font-medium">
            Messages ({refund.messages.length})
          </div>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {refund.messages.map((message) => (
              <div
                key={message.id}
                className={`p-2 rounded text-sm ${
                  message.isAgent ? "bg-blue-50 text-blue-900" : "bg-gray-50"
                }`}
              >
                <div className="font-medium text-xs mb-1">
                  {message.sender} •{" "}
                  {new Date(message.timestamp).toLocaleString()}
                </div>
                <div>{message.message}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Component for dispute details
function DisputeDetails({
  dispute,
  onClose,
}: {
  dispute: DisputeCase;
  onClose: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Dispute #{dispute.id}</CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Status
            </div>
            <Badge className={getStatusColor(dispute.status)}>
              {dispute.status}
            </Badge>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Amount in Dispute
            </div>
            <div className="font-bold text-lg">
              {formatCurrency(dispute.amount, dispute.currency)}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Parties
            </div>
            <div className="text-sm">
              <div>{dispute.plaintiff.name} (Plaintiff)</div>
              <div>{dispute.defendant.name} (Defendant)</div>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Description
            </div>
            <div className="text-sm">{dispute.description}</div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-sm font-medium">Timeline</div>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {dispute.timeline.map((event) => (
              <div
                key={event.id}
                className="flex items-start space-x-2 text-sm"
              >
                <div className="w-2 h-2 bg-kobklein-primary rounded-full mt-2 flex-shrink-0" />
                <div>
                  <div className="font-medium">{event.action}</div>
                  <div className="text-muted-foreground text-xs">
                    {event.actor} • {new Date(event.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Modal for creating refund
function CreateRefundModal({ onSubmit, onClose, loading }: any) {
  const [formData, setFormData] = useState({
    transactionId: "",
    requestedAmount: "",
    reason: "",
    category: "other",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      requestedAmount: parseFloat(formData.requestedAmount),
      originalAmount: parseFloat(formData.requestedAmount), // For demo
      currency: "HTG", // For demo
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md m-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Request Refund</CardTitle>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Transaction ID</label>
              <Input
                value={formData.transactionId}
                onChange={(e) =>
                  setFormData({ ...formData, transactionId: e.target.value })
                }
                placeholder="TXN123456789"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Refund Amount (HTG)</label>
              <Input
                type="number"
                value={formData.requestedAmount}
                onChange={(e) =>
                  setFormData({ ...formData, requestedAmount: e.target.value })
                }
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <option value="product_defect">Product Defect</option>
                <option value="service_issue">Service Issue</option>
                <option value="unauthorized">Unauthorized Transaction</option>
                <option value="duplicate">Duplicate Charge</option>
                <option value="other">Other</option>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Reason</label>
              <Textarea
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                placeholder="Please explain why you're requesting this refund..."
                required
              />
            </div>

            <div className="flex space-x-2">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-kobklein-primary hover:bg-kobklein-primary/90"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Submit Request
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Modal for creating dispute
function CreateDisputeModal({ onSubmit, onClose, loading }: any) {
  const [formData, setFormData] = useState({
    transactionId: "",
    amount: "",
    disputeType: "service_dispute",
    description: "",
    defendantName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      currency: "HTG", // For demo
      defendant: {
        id: "DEFENDANT001",
        name: formData.defendantName,
        type: "merchant",
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md m-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>File Dispute</CardTitle>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Transaction ID</label>
              <Input
                value={formData.transactionId}
                onChange={(e) =>
                  setFormData({ ...formData, transactionId: e.target.value })
                }
                placeholder="TXN123456789"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Dispute Amount (HTG)
              </label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Dispute Type</label>
              <Select
                value={formData.disputeType}
                onValueChange={(value) =>
                  setFormData({ ...formData, disputeType: value })
                }
              >
                <option value="chargeback">Chargeback</option>
                <option value="fraud">Fraud</option>
                <option value="service_dispute">Service Dispute</option>
                <option value="billing_error">Billing Error</option>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Other Party</label>
              <Input
                value={formData.defendantName}
                onChange={(e) =>
                  setFormData({ ...formData, defendantName: e.target.value })
                }
                placeholder="Merchant or user name"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Please describe the dispute in detail..."
                required
              />
            </div>

            <div className="flex space-x-2">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-kobklein-primary hover:bg-kobklein-primary/90"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                File Dispute
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

