// File: kobklein/web/src/app/merchant/pos/page.tsx

import { Metadata } from "next";
import { POSInterface } from "@/components/dashboards/merchant/pos-interface";
import { ProtectedRoute } from "@/components/auth/protected-route";

export const metadata: Metadata = {
  title: "POS Terminal | KobKlein Merchant",
  description: "Accept payments from customers using NFC, QR, or manual entry",
};

export default function POSPage() {
  return (
    <ProtectedRoute allowedRoles={['merchant', 'admin', 'super_admin']}>
      <div className="min-h-screen bg-gradient-to-br from-kobklein-dark via-slate-900 to-kobklein-primary p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">KobKlein POS</h1>
            <p className="text-gray-300">Accept customer payments</p>
          </div>
          
          <POSInterface />
          
          <div className="mt-6 text-center">
            <a
              href="/merchant/dashboard"
              className="text-kobklein-accent hover:underline"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}