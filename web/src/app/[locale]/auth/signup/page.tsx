import AuthLayout from "@/components/auth/AuthLayout";
import ModernSignUpForm from "@/components/auth/ModernSignUpForm";
import { unstable_setRequestLocale } from "next-intl/server";

type PageProps = {
  params: { locale: string };
};

export default function SignUpPage({ params: { locale } }: PageProps) {
  unstable_setRequestLocale(locale);
  return (
    <AuthLayout
      title="Join KobKlein"
      subtitle="Create your account and start your journey with secure, bank-free payments. Connect with Haiti and the diaspora community worldwide."
      backgroundImage="/images/auth/signupbg.png"
    >
      <ModernSignUpForm />
    </AuthLayout>
  );
}
