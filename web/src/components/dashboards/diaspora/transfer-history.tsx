import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Filter,
  Search,
  XCircle,
} from "lucide-react";

interface Transaction {
  id: string;
  type: "sent" | "received";
  amount: number;
  currency: "USD" | "HTG" | "EUR";
  recipient?: string;
  sender?: string;
  status: "completed" | "pending" | "failed" | "cancelled";
  date: string;
  time: string;
  method: "cash" | "mobile" | "bank";
  fees: number;
  exchangeRate?: number;
  referenceNumber: string;
  notes?: string;
}

interface TransferHistoryProps {
  transactions: Transaction[];
}

export function TransferHistory({ transactions }: TransferHistoryProps) {
  const totalTransactions = transactions.length;
  const completedTransactions = transactions.filter(
    (t) => t.status === "completed"
  ).length;
  const pendingTransactions = transactions.filter(
    (t) => t.status === "pending"
  ).length;
  const totalSent = transactions
    .filter((t) => t.type === "sent" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "sent" ? (
      <ArrowUpRight className="h-4 w-4 text-red-600" />
    ) : (
      <ArrowDownLeft className="h-4 w-4 text-green-600" />
    );
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return "💵";
      case "mobile":
        return "📱";
      case "bank":
        return "🏦";
      default:
        return "💳";
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transfers
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              All time transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTransactions}</div>
            <p className="text-xs text-muted-foreground">
              Successful transfers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTransactions}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalSent.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Money transferred</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transfer History</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-kobklein-primary"
              />
            </div>
          </div>

          {/* Transaction List */}
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(transaction.type)}
                      {getStatusIcon(transaction.status)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="font-medium">
                          {transaction.type === "sent"
                            ? `To: ${transaction.recipient}`
                            : `From: ${transaction.sender}`}
                        </div>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.date} at {transaction.time}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Ref: {transaction.referenceNumber}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${
                        transaction.type === "sent"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {transaction.type === "sent" ? "-" : "+"}$
                      {transaction.amount.toLocaleString()}{" "}
                      {transaction.currency}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getMethodIcon(transaction.method)}{" "}
                      {transaction.method.toUpperCase()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Fee: ${transaction.fees}
                    </div>
                  </div>
                </div>

                {transaction.exchangeRate && (
                  <div className="mt-2 pt-2 border-t">
                    <div className="text-xs text-muted-foreground">
                      Exchange Rate: 1 USD = {transaction.exchangeRate} HTG
                    </div>
                  </div>
                )}

                {transaction.notes && (
                  <div className="mt-2 pt-2 border-t">
                    <div className="text-sm text-muted-foreground">
                      Note: {transaction.notes}
                    </div>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex space-x-2">
                    {transaction.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                      >
                        Cancel
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                  {transaction.status === "completed" && (
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Receipt
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {transactions.length === 0 && (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <div className="text-lg font-medium text-muted-foreground">
                No transactions yet
              </div>
              <div className="text-sm text-muted-foreground">
                Your transfer history will appear here
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

