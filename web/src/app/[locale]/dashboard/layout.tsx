"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import React from "react";

interface DashboardLayoutWrapperProps {
  children: React.ReactNode;
}

export default function DashboardLayoutWrapper({
  children,
}: DashboardLayoutWrapperProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
