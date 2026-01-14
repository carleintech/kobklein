import AuthLayout from "@/components/auth/AuthLayout";
import SupabaseSignInForm from "@/components/auth/SupabaseSignInForm";
import { unstable_setRequestLocale } from "next-intl/server";

type PageProps = {
  params: { locale: string };
};

export default function SignInPage({ params: { locale } }: PageProps) {
  unstable_setRequestLocale(locale);
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your KobKlein account and continue your journey with secure, bank-free payments."
      backgroundImage="/images/auth/signbg.png"
    >
      <SupabaseSignInForm />
    </AuthLayout>
  );
}
