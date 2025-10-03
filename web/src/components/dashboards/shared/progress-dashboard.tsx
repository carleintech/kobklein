"use client";

import { Calendar, CheckCircle, Circle, Clock, Target } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/enhanced-button";
import { KobKleinCard } from "@/components/ui/kobklein-card";

interface PhaseProgress {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: "completed" | "in-progress" | "planned" | "blocked";
  tasks: {
    id: string;
    title: string;
    completed: boolean;
    priority: "high" | "medium" | "low";
  }[];
  estimatedDays?: number;
  actualDays?: number;
  technologies: string[];
}

const projectPhases: PhaseProgress[] = [
  {
    id: "phase-1",
    title: "Foundation Setup",
    description:
      "Next.js project initialization, TypeScript setup, and development environment",
    progress: 100,
    status: "completed",
    actualDays: 2,
    estimatedDays: 3,
    technologies: ["Next.js", "TypeScript", "TailwindCSS", "pnpm"],
    tasks: [
      {
        id: "1-1",
        title: "Project initialization",
        completed: true,
        priority: "high",
      },
      {
        id: "1-2",
        title: "Package manager setup",
        completed: true,
        priority: "high",
      },
      {
        id: "1-3",
        title: "TailwindCSS configuration",
        completed: true,
        priority: "high",
      },
      {
        id: "1-4",
        title: "Shadcn UI components",
        completed: true,
        priority: "medium",
      },
      {
        id: "1-5",
        title: "Global styles and animations",
        completed: true,
        priority: "medium",
      },
      {
        id: "1-6",
        title: "Folder structure organization",
        completed: true,
        priority: "medium",
      },
      {
        id: "1-7",
        title: "TypeScript configuration",
        completed: true,
        priority: "high",
      },
      {
        id: "1-8",
        title: "Development scripts setup",
        completed: true,
        priority: "low",
      },
    ],
  },
  {
    id: "phase-2",
    title: "Internationalization",
    description:
      "Multi-language support for Haiti market (Kreyòl, French, English, Spanish)",
    progress: 100,
    status: "completed",
    actualDays: 3,
    estimatedDays: 4,
    technologies: ["next-intl", "i18n routing", "JSON locale files"],
    tasks: [
      {
        id: "2-1",
        title: "next-intl setup",
        completed: true,
        priority: "high",
      },
      {
        id: "2-2",
        title: "Language files creation",
        completed: true,
        priority: "high",
      },
      {
        id: "2-3",
        title: "Middleware for locale routing",
        completed: true,
        priority: "high",
      },
      {
        id: "2-4",
        title: "Language selector component",
        completed: true,
        priority: "medium",
      },
      {
        id: "2-5",
        title: "Multi-language implementation",
        completed: true,
        priority: "medium",
      },
      {
        id: "2-6",
        title: "Localization utilities",
        completed: true,
        priority: "low",
      },
    ],
  },
  {
    id: "phase-3",
    title: "Welcome Page Design",
    description: "Landing page with fintech styling and language selection",
    progress: 100,
    status: "completed",
    actualDays: 2,
    estimatedDays: 3,
    technologies: ["Framer Motion", "Three.js particles", "Responsive design"],
    tasks: [
      {
        id: "3-1",
        title: "Particle background implementation",
        completed: true,
        priority: "medium",
      },
      {
        id: "3-2",
        title: "Logo-centered layout",
        completed: true,
        priority: "high",
      },
      {
        id: "3-3",
        title: "Language entry point UI",
        completed: true,
        priority: "high",
      },
      {
        id: "3-4",
        title: "Mobile responsive design",
        completed: true,
        priority: "high",
      },
      {
        id: "3-5",
        title: "CTA for app download",
        completed: true,
        priority: "medium",
      },
      {
        id: "3-6",
        title: "Footer with company info",
        completed: true,
        priority: "low",
      },
    ],
  },
  {
    id: "phase-4",
    title: "Core Components & UI",
    description:
      "Reusable UI components, type definitions, and utility functions",
    progress: 100,
    status: "completed",
    actualDays: 4,
    estimatedDays: 5,
    technologies: ["TypeScript types", "Shadcn UI", "Utility functions"],
    tasks: [
      {
        id: "4-1",
        title: "TypeScript type definitions",
        completed: true,
        priority: "high",
      },
      {
        id: "4-2",
        title: "Constants and configuration",
        completed: true,
        priority: "high",
      },
      {
        id: "4-3",
        title: "Utility functions (currency, validation)",
        completed: true,
        priority: "high",
      },
      {
        id: "4-4",
        title: "Enhanced UI components",
        completed: true,
        priority: "medium",
      },
      {
        id: "4-5",
        title: "Loading states and skeletons",
        completed: true,
        priority: "medium",
      },
      {
        id: "4-6",
        title: "Error boundary and handling",
        completed: true,
        priority: "medium",
      },
      {
        id: "4-7",
        title: "Toast notifications system",
        completed: true,
        priority: "medium",
      },
      {
        id: "4-8",
        title: "Responsive layout components",
        completed: true,
        priority: "low",
      },
    ],
  },
  {
    id: "phase-5",
    title: "Authentication System",
    description: "Supabase Auth integration with role-based access control",
    progress: 100,
    status: "completed",
    actualDays: 5,
    estimatedDays: 6,
    technologies: [
      "Supabase Auth",
      "PostgreSQL",
      "Protected routes",
      "Validation",
    ],
    tasks: [
      {
        id: "5-1",
        title: "Supabase Auth setup",
        completed: true,
        priority: "high",
      },
      {
        id: "5-2",
        title: "Login/Register components",
        completed: true,
        priority: "high",
      },
      {
        id: "5-3",
        title: "Multi-step registration",
        completed: true,
        priority: "high",
      },
      {
        id: "5-4",
        title: "Role-based authentication",
        completed: true,
        priority: "high",
      },
      {
        id: "5-5",
        title: "Protected routes and guards",
        completed: true,
        priority: "high",
      },
      {
        id: "5-6",
        title: "Password reset flow",
        completed: true,
        priority: "medium",
      },
      {
        id: "5-7",
        title: "Auth context and session",
        completed: true,
        priority: "medium",
      },
      {
        id: "5-8",
        title: "Haiti phone validation",
        completed: true,
        priority: "medium",
      },
    ],
  },
  {
    id: "phase-6",
    title: "Dashboard Architecture",
    description:
      "Role-based dashboards for all user types (Client, Merchant, Distributor, etc.)",
    progress: 100,
    status: "completed",
    actualDays: 8,
    estimatedDays: 8,
    technologies: [
      "Dashboard layouts",
      "Data visualization",
      "Real-time updates",
    ],
    tasks: [
      {
        id: "6-1",
        title: "Dashboard layout system",
        completed: true,
        priority: "high",
      },
      {
        id: "6-2",
        title: "Client dashboard",
        completed: true,
        priority: "high",
      },
      {
        id: "6-3",
        title: "Merchant dashboard",
        completed: true,
        priority: "high",
      },
      {
        id: "6-4",
        title: "Distributor dashboard",
        completed: true,
        priority: "high",
      },
      {
        id: "6-5",
        title: "Diaspora dashboard",
        completed: true,
        priority: "high",
      },
      {
        id: "6-6",
        title: "Admin dashboard",
        completed: true,
        priority: "medium",
      },
      {
        id: "6-7",
        title: "Role badge component",
        completed: true,
        priority: "low",
      },
      {
        id: "6-8",
        title: "Progress tracking system",
        completed: true,
        priority: "medium",
      },
    ],
  },
  {
    id: "phase-7",
    title: "Payment Processing",
    description: "NFC, QR codes, and digital payment integration",
    progress: 100,
    status: "completed",
    actualDays: 8,
    estimatedDays: 10,
    technologies: ["NFC APIs", "QR code generation", "Payment gateways"],
    tasks: [
      {
        id: "7-1",
        title: "NFC card reader integration",
        completed: true,
        priority: "high",
      },
      {
        id: "7-2",
        title: "QR code payment system",
        completed: true,
        priority: "high",
      },
      {
        id: "7-3",
        title: "Digital wallet functionality",
        completed: true,
        priority: "high",
      },
      {
        id: "7-4",
        title: "Transaction processing",
        completed: true,
        priority: "high",
      },
      {
        id: "7-5",
        title: "Payment confirmation flow",
        completed: true,
        priority: "medium",
      },
      {
        id: "7-6",
        title: "Refund and dispute handling",
        completed: true,
        priority: "medium",
      },
    ],
  },
  {
    id: "phase-8",
    title: "KYC & Verification",
    description: "Identity verification and compliance features",
    progress: 0,
    status: "planned",
    estimatedDays: 7,
    technologies: ["Document scanning", "AI verification", "Compliance APIs"],
    tasks: [
      {
        id: "8-1",
        title: "Document upload system",
        completed: false,
        priority: "high",
      },
      {
        id: "8-2",
        title: "ID verification flow",
        completed: false,
        priority: "high",
      },
      {
        id: "8-3",
        title: "Biometric verification",
        completed: false,
        priority: "medium",
      },
      {
        id: "8-4",
        title: "Compliance reporting",
        completed: false,
        priority: "medium",
      },
      {
        id: "8-5",
        title: "Risk assessment tools",
        completed: false,
        priority: "low",
      },
    ],
  },
  {
    id: "phase-9",
    title: "Mobile Application",
    description: "React Native mobile app for iOS and Android",
    progress: 0,
    status: "planned",
    estimatedDays: 15,
    technologies: ["React Native", "Expo", "Push notifications", "Biometrics"],
    tasks: [
      {
        id: "9-1",
        title: "React Native setup",
        completed: false,
        priority: "high",
      },
      {
        id: "9-2",
        title: "Mobile UI components",
        completed: false,
        priority: "high",
      },
      {
        id: "9-3",
        title: "NFC mobile integration",
        completed: false,
        priority: "high",
      },
      {
        id: "9-4",
        title: "Push notifications",
        completed: false,
        priority: "medium",
      },
      {
        id: "9-5",
        title: "Biometric authentication",
        completed: false,
        priority: "medium",
      },
      {
        id: "9-6",
        title: "App store deployment",
        completed: false,
        priority: "low",
      },
    ],
  },
];

export function ProgressDashboard() {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"overview" | "timeline" | "tasks">(
    "overview"
  );

  const overallProgress = Math.round(
    projectPhases.reduce((acc, phase) => acc + phase.progress, 0) /
      projectPhases.length
  );

  const completedPhases = projectPhases.filter(
    (phase) => phase.status === "completed"
  ).length;
  const totalTasks = projectPhases.reduce(
    (acc, phase) => acc + phase.tasks.length,
    0
  );
  const completedTasks = projectPhases.reduce(
    (acc, phase) => acc + phase.tasks.filter((task) => task.completed).length,
    0
  );

  const getStatusIcon = (status: PhaseProgress["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "planned":
        return <Circle className="h-5 w-5 text-gray-400" />;
      case "blocked":
        return <Circle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: PhaseProgress["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100 border-green-200";
      case "in-progress":
        return "text-blue-600 bg-blue-100 border-blue-200";
      case "planned":
        return "text-gray-600 bg-gray-100 border-gray-200";
      case "blocked":
        return "text-red-600 bg-red-100 border-red-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress Header */}
      <KobKleinCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              KobKlein Development Progress
            </h2>
            <p className="text-muted-foreground">
              Phase 6: Dashboard Architecture - In Progress
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-kobklein-accent">
              {overallProgress}%
            </div>
            <p className="text-sm text-muted-foreground">Overall Complete</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
          <div
            className={`h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-kobklein-accent to-blue-500`}
            data-progress={overallProgress}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {completedPhases}
            </div>
            <p className="text-sm text-muted-foreground">Phases Complete</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {completedTasks}
            </div>
            <p className="text-sm text-muted-foreground">Tasks Complete</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {totalTasks}
            </div>
            <p className="text-sm text-muted-foreground">Total Tasks</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round((completedTasks / totalTasks) * 100)}%
            </div>
            <p className="text-sm text-muted-foreground">Task Completion</p>
          </div>
        </div>
      </KobKleinCard>

      {/* View Mode Toggle */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        {[
          { key: "overview", label: "Overview", icon: Target },
          { key: "timeline", label: "Timeline", icon: Calendar },
          { key: "tasks", label: "Tasks", icon: CheckCircle },
        ].map((mode) => {
          const Icon = mode.icon;
          return (
            <Button
              key={mode.key}
              variant={viewMode === mode.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode(mode.key as any)}
              className="flex items-center space-x-2"
            >
              <Icon className="h-4 w-4" />
              <span>{mode.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Phase Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projectPhases.map((phase) => (
          <KobKleinCard
            key={phase.id}
            className={`p-6 cursor-pointer transition-all duration-200 ${
              selectedPhase === phase.id
                ? "ring-2 ring-kobklein-accent"
                : "hover:shadow-lg"
            }`}
            onClick={() =>
              setSelectedPhase(selectedPhase === phase.id ? null : phase.id)
            }
          >
            <div className="space-y-4">
              {/* Phase Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(phase.status)}
                  <div>
                    <h3 className="font-semibold">{phase.title}</h3>
                    <Badge className={getStatusColor(phase.status)}>
                      {phase.status.replace("-", " ")}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{phase.progress}%</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    phase.status === "completed"
                      ? "bg-green-500"
                      : phase.status === "in-progress"
                      ? "bg-blue-500"
                      : "bg-gray-400"
                  }`}
                  data-progress={phase.progress}
                />
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground">
                {phase.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1">
                {phase.technologies.slice(0, 3).map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {phase.technologies.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{phase.technologies.length - 3} more
                  </Badge>
                )}
              </div>

              {/* Task Summary */}
              {selectedPhase === phase.id && (
                <div className="space-y-2 border-t pt-4">
                  <h4 className="font-medium">Tasks</h4>
                  <div className="space-y-1">
                    {phase.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center space-x-2 text-sm"
                      >
                        {task.completed ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <Circle className="h-3 w-3 text-gray-400" />
                        )}
                        <span
                          className={
                            task.completed
                              ? "line-through text-muted-foreground"
                              : ""
                          }
                        >
                          {task.title}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            task.priority === "high"
                              ? "text-red-600 border-red-200"
                              : task.priority === "medium"
                              ? "text-yellow-600 border-yellow-200"
                              : "text-gray-600 border-gray-200"
                          }`}
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Time Tracking */}
              {(phase.estimatedDays || phase.actualDays) && (
                <div className="flex justify-between text-xs text-muted-foreground border-t pt-2">
                  {phase.estimatedDays && (
                    <span>Est: {phase.estimatedDays} days</span>
                  )}
                  {phase.actualDays && (
                    <span>Actual: {phase.actualDays} days</span>
                  )}
                </div>
              )}
            </div>
          </KobKleinCard>
        ))}
      </div>
    </div>
  );
}

