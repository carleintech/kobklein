import AuthLayout from "@/components/auth/AuthLayout";
import ModernSignInForm from "@/components/auth/ModernSignInForm";

export default function SignInPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your KobKlein account and continue your journey with secure, bank-free payments."
      backgroundImage="/images/auth/signbg.png"
    >
      <ModernSignInForm />
    </AuthLayout>
  );
}
