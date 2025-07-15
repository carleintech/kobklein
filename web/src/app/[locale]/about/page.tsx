"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ParticleBackground } from '@/components/background/particle-background';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheckIcon, 
  GlobeAltIcon, 
  HeartIcon,
  UsersIcon,
  BanknotesIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface AboutPageProps {
  params: {
    locale: string;
  };
}

export default function AboutPage({ params }: AboutPageProps) {
  const t = useTranslations();

  const stats = [
    { number: "50,000+", label: "Active Users", icon: UsersIcon },
    { number: "5,000+", label: "Partner Merchants", icon: BanknotesIcon },
    { number: "10", label: "Departments Covered", icon: GlobeAltIcon },
    { number: "99.9%", label: "Uptime Reliability", icon: ShieldCheckIcon },
  ];

  const values = [
    {
      icon: HeartIcon,
      title: "Community First",
      description: "We believe in empowering the Haitian community through accessible financial technology."
    },
    {
      icon: ShieldCheckIcon,
      title: "Security & Trust",
      description: "Bank-level security with transparent operations to build lasting trust with our users."
    },
    {
      icon: SparklesIcon,
      title: "Innovation",
      description: "Cutting-edge technology designed specifically for the unique needs of Haiti."
    },
    {
      icon: GlobeAltIcon,
      title: "Global Connection",
      description: "Bridging the gap between Haiti and the diaspora worldwide."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-kobklein-primary via-kobklein-primary/90 to-kobklein-accent/20" />
      <ParticleBackground className="z-[5] pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="sticky top-0 glass border-b border-white/20 backdrop-blur-md z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-kobklein-primary font-bold text-xl">K</span>
                </div>
                <span className="text-white font-bold text-xl">KobKlein</span>
              </motion.div>
              
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-kobklein-primary"
                  onClick={() => window.location.href = `/${params.locale}`}
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-20 sm:py-32">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white space-y-8"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                About <span className="text-kobklein-accent">KobKlein</span>
              </h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed">
                Revolutionizing digital payments in Haiti through innovative technology, 
                community empowerment, and unwavering commitment to financial inclusion.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                  Our <span className="text-kobklein-accent">Mission</span>
                </h2>
                <p className="text-lg text-white/80 leading-relaxed">
                  To create a cashless, secure, and inclusive financial ecosystem that empowers 
                  every Haitian, whether at home or abroad, to participate in the digital economy 
                  without traditional banking barriers.
                </p>
                <p className="text-lg text-white/80 leading-relaxed">
                  We&apos;re building more than just a payment system – we&apos;re fostering economic 
                  independence, connecting families across borders, and laying the foundation 
                  for Haiti&apos;s digital financial future.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="glass rounded-3xl p-8"
              >
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center"
                    >
                      <stat.icon className="h-8 w-8 text-kobklein-accent mx-auto mb-3" />
                      <div className="text-2xl font-bold text-white">{stat.number}</div>
                      <div className="text-white/70 text-sm">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our <span className="text-kobklein-accent">Values</span>
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                The principles that guide everything we do at KobKlein
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="glass rounded-2xl p-6 text-center"
                >
                  <value.icon className="h-12 w-12 text-kobklein-accent mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-white/70 leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass rounded-3xl p-8 md:p-12 text-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                Our <span className="text-kobklein-accent">Story</span>
              </h2>
              <div className="max-w-4xl mx-auto space-y-6 text-lg text-white/80 leading-relaxed">
                <p>
                  KobKlein was born from a simple observation: millions of Haitians, both at home 
                  and in the diaspora, were underserved by traditional banking systems. High fees, 
                  long wait times, and limited access were barriers to financial inclusion.
                </p>
                <p>
                  Founded by TECHKLEIN in 2024, we set out to create a solution that would be 
                  truly Haitian – built by Haitians, for Haitians. Our team combines deep 
                  understanding of local needs with cutting-edge financial technology.
                </p>
                <p>
                  Today, KobKlein serves thousands of users across Haiti and the diaspora, 
                  facilitating instant transfers, enabling merchant payments, and empowering 
                  distributors to build sustainable businesses in their communities.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to Join the <span className="text-kobklein-accent">Revolution</span>?
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Be part of Haiti&apos;s financial transformation. Choose your role and get started today.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white py-4"
                  onClick={() => window.location.href = `/${params.locale}/client`}
                >
                  Sign as Client
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white py-4"
                  onClick={() => window.location.href = `/${params.locale}/diaspora`}
                >
                  Join Diaspora
                </Button>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white py-4"
                  onClick={() => window.location.href = `/${params.locale}/distributor`}
                >
                  Become Distributor
                </Button>
                <Button 
                  className="bg-orange-600 hover:bg-orange-700 text-white py-4"
                  onClick={() => window.location.href = `/${params.locale}/merchant`}
                >
                  Sign as Merchant
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-white/20">
          <div className="container mx-auto px-4">
            <div className="text-center text-white/60">
              <p>© 2025 TECHKLEIN | Built with ❤️ in Haiti</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
