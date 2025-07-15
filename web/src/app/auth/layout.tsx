// File: kobklein/web/src/app/auth/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | KobKlein",
    default: "Authentication | KobKlein",
  },
  description: "Secure authentication for KobKlein - Haiti's cashless payment platform",
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-kobklein-secondary/20 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-sm text-white/70">
          © 2025 KobKlein. Built with ❤️ in Haiti.
        </p>
      </div>
    </div>
  );
}