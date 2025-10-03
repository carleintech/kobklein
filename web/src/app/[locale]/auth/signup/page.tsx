import AuthLayout from "@/components/auth/AuthLayout";
import ModernSignUpForm from "@/components/auth/ModernSignUpForm";

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Join KobKlein"
      subtitle="Create your account and start your journey with secure, bank-free payments. Connect with Haiti and the diaspora community worldwide."
    >
      <ModernSignUpForm />
    </AuthLayout>
  );
}
