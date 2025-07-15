"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ParticleBackground } from '@/components/background/particle-background';
import { Button } from '@/components/ui/button';
import { 
  UserIcon,
  BuildingStorefrontIcon,
  UserGroupIcon,
  CogIcon,
  RocketLaunchIcon,
  HeartIcon,
  BoltIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface JoinPageProps {
  params: {
    locale: string;
  };
}

export default function JoinPage({ params }: JoinPageProps) {
  const t = useTranslations();

  const roles = [
    {
      icon: UserIcon,
      title: "Client",
      description: "Get your personal KobKlein card and join the cashless revolution",
      benefits: ["No bank account needed", "Instant payments", "Receive diaspora funds", "Shop anywhere"],
      color: "blue",
      action: "Sign as Client",
      route: "/auth/register?role=client"
    },
    {
      icon: BuildingStorefrontIcon,
      title: "Merchant",
      description: "Accept digital payments and grow your business with KobKlein",
      benefits: ["Accept all payments", "No transaction fees", "Daily cash-out", "POS terminal included"],
      color: "orange",
      action: "Become Merchant",
      route: "/auth/register?role=merchant"
    },
    {
      icon: UserGroupIcon,
      title: "Distributor",
      description: "Earn commissions while serving your community as a KobKlein agent",
      benefits: ["Earn 2-5% commission", "Territory rights", "Training provided", "Create local jobs"],
      color: "purple",
      action: "Become Distributor",
      route: "/auth/register?role=distributor"
    },
    {
      icon: CogIcon,
      title: "Admin",
      description: "Manage operations and oversee the KobKlein network (Coming Soon)",
      benefits: ["System oversight", "User management", "Analytics access", "Regional control"],
      color: "gray",
      action: "Coming Soon",
      route: "#",
      disabled: true
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'from-blue-600 to-blue-700',
          border: 'border-blue-500/50',
          text: 'text-blue-300',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'orange':
        return {
          bg: 'from-orange-600 to-orange-700',
          border: 'border-orange-500/50',
          text: 'text-orange-300',
          button: 'bg-orange-600 hover:bg-orange-700'
        };
      case 'purple':
        return {
          bg: 'from-purple-600 to-purple-700',
          border: 'border-purple-500/50',
          text: 'text-purple-300',
          button: 'bg-purple-600 hover:bg-purple-700'
        };
      default:
        return {
          bg: 'from-gray-600 to-gray-700',
          border: 'border-gray-500/50',
          text: 'text-gray-300',
          button: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900" />
      <ParticleBackground className="z-[5] pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="sticky top-0 glass border-b border-white/20 backdrop-blur-md z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <motion.div 
                className="flex items-center gap-3 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={() => window.location.href = `/${params.locale}`}
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-purple-600 font-bold text-xl">K</span>
                </div>
                <span className="text-white font-bold text-xl">KobKlein</span>
              </motion.div>
              
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-purple-600"
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
                Your Role in the <span className="text-purple-300">Revolution</span>
              </h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed">
                Whether you&apos;re a developer, investor, designer, or visionary — KobKlein has a place for you. 
                Join our network of changemakers and help transform Haiti&apos;s economy from the inside out.
              </p>
              
              <motion.div className="flex items-center justify-center gap-2 text-purple-300">
                <RocketLaunchIcon className="h-6 w-6" />
                <span className="text-lg font-semibold">We&apos;re hiring, partnering, and growing fast</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Role Cards Section */}
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
                Choose Your <span className="text-purple-300">Path</span>
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Every role is essential to building Haiti&apos;s financial future
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {roles.map((role, index) => {
                const colors = getColorClasses(role.color);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className={`glass rounded-3xl p-8 border-2 ${colors.border} ${role.disabled ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-start gap-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${colors.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                        <role.icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-3">{role.title}</h3>
                        <p className="text-white/70 mb-6 leading-relaxed">{role.description}</p>
                        
                        <div className="space-y-3 mb-6">
                          {role.benefits.map((benefit, benefitIndex) => (
                            <div key={benefitIndex} className="flex items-center gap-3">
                              <div className={`w-2 h-2 ${colors.bg} bg-gradient-to-r rounded-full`}></div>
                              <span className="text-white/80 text-sm">{benefit}</span>
                            </div>
                          ))}
                        </div>
                        
                        <Button 
                          className={`w-full ${colors.button} text-white py-3 px-6 ${role.disabled ? 'cursor-not-allowed' : ''}`}
                          disabled={role.disabled}
                          onClick={() => {
                            if (!role.disabled) {
                              window.location.href = `/${params.locale}${role.route}`;
                            }
                          }}
                        >
                          {role.action}
                          {!role.disabled && <ArrowRightIcon className="h-4 w-4 ml-2" />}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Live Tracker Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass rounded-3xl p-8 md:p-12 text-center"
            >
              <BoltIcon className="h-16 w-16 text-purple-300 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Join the <span className="text-purple-300">Movement</span>
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
                Be part of the financial revolution that&apos;s transforming Haiti, one transaction at a time.
              </p>
              
              {/* Simulated Live Stats */}
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-300 mb-2">2,847</div>
                  <div className="text-white/70">New Users This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-300 mb-2">156</div>
                  <div className="text-white/70">New Merchants</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-300 mb-2">89</div>
                  <div className="text-white/70">New Distributors</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white py-4 px-8 text-lg flex items-center gap-2"
                  onClick={() => window.location.href = `/${params.locale}/contact`}
                >
                  <HeartIcon className="h-5 w-5" />
                  Let&apos;s Build Together
                </Button>
                <Button 
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-purple-600 py-4 px-8 text-lg"
                  onClick={() => window.location.href = `/${params.locale}/about`}
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Career Opportunities */}
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
                Now Hiring <span className="text-purple-300">Talent</span>
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Join our team of innovators building the future of finance in Haiti
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Software Engineers", count: "5 positions", location: "Remote/Haiti" },
                { title: "Product Designers", count: "2 positions", location: "Remote" },
                { title: "Business Development", count: "3 positions", location: "Haiti" },
                { title: "Customer Success", count: "4 positions", location: "Haiti" },
                { title: "Marketing Specialists", count: "2 positions", location: "Remote/Haiti" },
                { title: "Operations Manager", count: "1 position", location: "Port-au-Prince" }
              ].map((job, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-6 hover:border-purple-500/50 transition-colors"
                >
                  <h3 className="text-lg font-bold text-white mb-2">{job.title}</h3>
                  <p className="text-purple-300 text-sm mb-1">{job.count}</p>
                  <p className="text-white/60 text-sm">{job.location}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white py-4 px-8 text-lg"
                onClick={() => window.location.href = `/${params.locale}/contact`}
              >
                View All Positions
              </Button>
            </div>
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
