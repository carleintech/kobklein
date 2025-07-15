import { EnhancedWelcomePage } from '@/components/welcome/enhanced-welcome-page';

interface HomePageProps {
  params: {
    locale: string;
  };
}

export default function HomePage({ params }: HomePageProps) {
  return <EnhancedWelcomePage locale={params.locale} />;
}
