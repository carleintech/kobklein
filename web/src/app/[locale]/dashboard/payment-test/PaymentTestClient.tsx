"use client";
import { POSInterface } from "@/components/dashboards/merchant/pos-interface";
import { DashboardLayout } from "@/components/dashboards/shared/dashboard-layout";
import { QRCodePayment } from "@/components/payment/qr-code-payment";
import { RefundRequestForm } from "@/components/payment/refund-request-form";
import { SendMoneyForm } from "@/components/payment/send-money-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/lib/toast";
import { UserRole } from "@/types/auth";
import {
  ArrowLeftRight,
  CreditCard,
  QrCode,
  RefreshCw,
  Send,
} from "lucide-react";

export default function PaymentTestClient() {
  const handlePaymentSuccess = (payment: any) => {
    toast.success(
      "✅ Payment Successful",
      `Payment of ${payment.amount} processed successfully`
    );
  };

  const handlePaymentError = (error: string) => {
    toast.error("❌ Payment Failed", error);
  };

  return (
    <DashboardLayout
      title="Payment Flow Integration"
      userRole={UserRole.CLIENT}
      notifications={0}
      navigation={[]}
    >
      <div className="space-y-6 max-w-6xl">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Payment Integration Test</h1>
          <p className="text-muted-foreground">
            Test all payment flows with real backend API integration
          </p>
        </div>

        {/* Payment Flows Tabs */}
        <Tabs defaultValue="send-money" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="send-money" className="flex items-center">
              <Send className="h-4 w-4 mr-2" />
              Send Money
            </TabsTrigger>
            <TabsTrigger value="qr-payment" className="flex items-center">
              <QrCode className="h-4 w-4 mr-2" />
              QR Payment
            </TabsTrigger>
            <TabsTrigger value="pos-interface" className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              POS Interface
            </TabsTrigger>
            <TabsTrigger value="refund-request" className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refund Request
            </TabsTrigger>
          </TabsList>

          {/* Send Money Flow */}
          <TabsContent value="send-money" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="h-5 w-5 mr-2" />
                  Send Money Integration
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Multi-step form with real-time balance validation and backend
                  payment processing
                </p>
              </CardHeader>
              <CardContent>
                <SendMoneyForm
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* QR Code Payment Flow */}
          <TabsContent value="qr-payment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="h-5 w-5 mr-2" />
                  QR Code Payment Integration
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Generate and process QR codes with backend API integration and
                  real-time updates
                </p>
              </CardHeader>
              <CardContent>
                <QRCodePayment
                  mode="both"
                  merchantInfo={{
                    id: "test_merchant_123",
                    name: "Test Merchant Store",
                  }}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* POS Interface Flow */}
          <TabsContent value="pos-interface" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  POS Interface Integration
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Point of sale interface for merchants with QR code generation
                  and payment processing
                </p>
              </CardHeader>
              <CardContent>
                <POSInterface />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Refund Request Flow */}
          <TabsContent value="refund-request" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Refund Request Integration
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Submit refund requests with transaction lookup and backend
                  processing
                </p>
              </CardHeader>
              <CardContent>
                <RefundRequestForm
                  onSuccess={(refund) => {
                    toast.success(
                      "✅ Refund Request Submitted",
                      `Refund request for ${refund.amount} has been submitted`
                    );
                  }}
                  onError={handlePaymentError}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Integration Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ArrowLeftRight className="h-5 w-5 mr-2" />
              Payment Integration Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm font-medium text-green-800">
                  Send Money
                </div>
                <div className="text-xs text-green-600">
                  ✅ Backend Integrated
                </div>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm font-medium text-green-800">
                  QR Payments
                </div>
                <div className="text-xs text-green-600">
                  ✅ Backend Integrated
                </div>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm font-medium text-green-800">
                  POS Interface
                </div>
                <div className="text-xs text-green-600">
                  ✅ Backend Integrated
                </div>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm font-medium text-green-800">
                  Refund System
                </div>
                <div className="text-xs text-green-600">
                  ✅ Backend Integrated
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                Features Implemented:
              </h4>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• Real-time balance validation</li>
                <li>• WebSocket integration for live updates</li>
                <li>• PIN-based payment authorization</li>
                <li>• Multi-currency support (HTG/USD)</li>
                <li>• Error handling and user feedback</li>
                <li>• Transaction status tracking</li>
                <li>• QR code generation and processing</li>
                <li>• Refund request workflows</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
