import IndividualDashboard from "@/components/dashboard/IndividualDashboard";
import { unstable_setRequestLocale } from "next-intl/server";

type PageProps = {
  params: { locale: string };
};

export default function IndividualDashboardPage({
  params: { locale },
}: PageProps) {
  unstable_setRequestLocale(locale);

  return <IndividualDashboard />;
}
