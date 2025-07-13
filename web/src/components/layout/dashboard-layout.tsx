"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { Container } from "../ui/container";
import type { UserRole } from "@/types";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
  className?: string;
}

export function DashboardLayout({
  children,
  userRole,
  sidebarOpen = true,
  onSidebarToggle,
  className,
}: DashboardLayoutProps) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Sidebar */}
      <Sidebar
        userRole={userRole}
        isOpen={sidebarOpen}
        isMobile={isMobile}
        onToggle={onSidebarToggle}
      />

      {/* Main content */}
      <div className={cn(
        "transition-all duration-300",
        sidebarOpen && !isMobile ? "ml-64" : "ml-0"
      )}>
        {/* Header */}
        <Header
          userRole={userRole}
          onSidebarToggle={onSidebarToggle}
          showMenuButton={isMobile || !sidebarOpen}
        />

        {/* Page content */}
        <main className="pt-16">
          <Container className="py-6">
            {children}
          </Container>
        </main>
      </div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onSidebarToggle}
        />
      )}
    </div>
  );
}