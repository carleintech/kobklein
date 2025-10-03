"use client";

import { AuthProvider } from "@/contexts/SupabaseAuthContext";
import { PWAProvider } from "@/contexts/PWAContext";
import { OfflineNotifications, ConnectionStatus, NetworkStatusToast } from "@/components/ui/offline-notifications";
import { InAppNotificationManager } from "@/components/ui/in-app-notifications";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <AuthProvider>
      <PWAProvider>
        {children}
        <OfflineNotifications />
        <ConnectionStatus />
        <NetworkStatusToast />
        <InAppNotificationManager maxNotifications={3} />
      </PWAProvider>
    </AuthProvider>
  );
}

