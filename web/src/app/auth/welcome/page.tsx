// File: kobklein/web/src/app/auth/welcome/page.tsx
"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KobKleinCard } from "@/components/ui/card";
import { RoleBadge } from "@/components/auth/role-badge";

export default function WelcomePage() {
  const auth = useAuth();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      if (auth.user) {
        auth.redirectToDashboard();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [auth]);

  if (!auth.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kobklein-primary via-kobklein-primary/90 to-kobklein-secondary px-4">
        <KobKleinCard className="w-full max-w-md p-6">
          <div className="text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </KobKleinCard>
      </div>
    );
  }

  const getRoleWelcomeMessage = (role: string) => {
    const messages = {
      client: "Welcome to KobKlein! You can now send, receive, and manage your digital wallet.",
      merchant: "Welcome to KobKlein! Start accepting payments and growing your business.",
      distributor: "Welcome to KobKlein! Help expand our network by onboarding new users.",
      diaspora: "Welcome to KobKlein! Send money to your loved ones in Haiti with ease.",
      admin: "Welcome to the KobKlein admin panel. You have full system access.",
    };
    return messages[role as keyof typeof messages] || "Welcome to KobKlein!";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kobklein-primary via-kobklein-primary/90 to-kobklein-secondary px-4">
      <KobKleinCard className="w-full max-w-md p-6">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          
          <div>
            <h1 className="text-xl font-bold text-kobklein-primary">
              Welcome, {auth.user.name}!
            </h1>
            <div className="flex justify-center mt-2">
              <RoleBadge role={auth.user.role} />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              {getRoleWelcomeMessage(auth.user.role)}
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={auth.redirectToDashboard}
              className="w-full"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <p className="text-xs text-muted-foreground">
              You'll be automatically redirected in a few seconds...
            </p>
          </div>
        </div>
      </KobKleinCard>
    </div>
  );
}