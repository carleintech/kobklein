"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ParticleBackground } from '@/components/background/particle-background';
import { Button } from '@/components/ui/button';
import { 
  UserGroupIcon,
  BanknotesIcon,
  MapPinIcon,
  TrophyIcon,
  ChartBarIcon,
  ClockIcon,
  HandRaisedIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  UsersIcon,
  GlobeAltIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface DistributorPageProps {
  params: {
    locale: string;
  };
}

export default function DistributorPage({ params }: DistributorPageProps) {
  const t = useTranslations();

  const opportunities = [
    {
      icon: BanknotesIcon,
      title: "Earn Commission",
      description: "Earn 2-5% commission on every card activation and transaction",
      highlight: "Up to 5%"
    },
    {
      icon: UserGroupIcon,
      title: "Build Your Network",
      description: "Create a network of merchants and clients in your community",
      highlight: "Unlimited"
    },
    {
      icon: MapPinIcon,
      title: "Territory Rights",
      description: "Exclusive distribution rights in your designated area",
      highlight: "Exclusive"
    },
    {
      icon: TrophyIcon,
      title: "Performance Bonuses",
      description: "Monthly and quarterly bonuses for top performers",
      highlight: "Extra Income"
    }
  ];

  const services = [
    {
      icon: HandRaisedIcon,
      title: "Card Distribution",
      description: "Distribute KobKlein cards to new users in your area",
      commission: "HTG 50 per card"
    },
    {
      icon: BuildingOfficeIcon,
      title: "Merchant Onboarding",
      description: "Help local businesses set up KobKlein payment systems",
      commission: "HTG 500 per merchant"
    },
    {
      icon: UsersIcon,
      title: "Customer Support",
      description: "Provide local support and assistance to users",
      commission: "HTG 25 per support"
    },
    {
      icon: ChartBarIcon,
      title: "Transaction Processing",
      description: "Facilitate offline transactions and cash-in/cash-out",
      commission: "1-3% per transaction"
    }
  ];

  const requirements = [
    {
      title: "Community Standing",
      description: "Respected member of your local community"
    },
    {
      title: "Basic Education",
      description: "Ability to read, write, and use mobile devices"
    },
    {
      title: "Initial Investment",
      description: "Small startup capital for initial card inventory"
    },
    {
      title: "Commitment",
      description: "Dedicated to serving your community full-time"
    }
  ];

  const successStories = [
    {
      name: "Marie Claire Augustin",
      location: "Cap-Haïtien",
      achievement: "Top Distributor 2024",
      income: "HTG 45,000/month",
      story: "Started with 50 cards, now serves 500+ families in my neighborhood"
    },
    {
      name: "Jean-Baptiste Pierre",
      location: "Jacmel",
      achievement: "Community Leader",
      income: "HTG 38,000/month",
      story: "Helped 200+ merchants accept digital payments, transforming local commerce"
    },
    {
      name: "Roseline Joseph",
      location: "Gonaïves",
      achievement: "Growth Champion",
      income: "HTG 52,000/month",
      story: "Built a network of 15 sub-distributors, creating jobs for my community"
    }
  ];

  const stats = [
    { number: "1,500+", label: "Active Distributors" },
    { number: "HTG 35K", label: "Average Monthly Income" },
    { number: "85%", label: "Satisfaction Rate" },
    { number: "10", label: "Departments Covered" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900" />
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
                <span className="text-purple-300">Distributor</span> Opportunities
              </h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed">
                Create employment, serve your community, and build a sustainable income as a 
                KobKlein distributor. Join our network of successful entrepreneurs across Haiti.
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white py-4 px-8 text-lg"
                  onClick={() => window.location.href = `/${params.locale}/auth/register?role=distributor`}
                >
                  Become Distributor
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-6 text-center"
                >
                  <div className="text-3xl font-bold text-purple-300 mb-2">{stat.number}</div>
                  <div className="text-white/70">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Opportunities Section */}
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
                Income <span className="text-purple-300">Opportunities</span>
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Multiple revenue streams to maximize your earning potential
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {opportunities.map((opportunity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="glass rounded-2xl p-6 text-center"
                >
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <opportunity.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{opportunity.title}</h3>
                  <p className="text-white/70 text-sm mb-3">{opportunity.description}</p>
                  <div className="text-purple-300 font-bold">{opportunity.highlight}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
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
                <span className="text-purple-300">Services</span> You&apos;ll Provide
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Help your community while earning competitive commissions
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                      <p className="text-white/70 mb-3">{service.description}</p>
                      <div className="text-purple-300 font-bold">Commission: {service.commission}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
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
                <span className="text-purple-300">Success</span> Stories
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Real distributors, real results, real impact on their communities
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-6"
                >
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-xl">{story.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{story.name}</h3>
                    <p className="text-purple-300">{story.location}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <StarIcon className="h-5 w-5 text-yellow-400" />
                      <span className="text-white font-semibold">{story.achievement}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CurrencyDollarIcon className="h-5 w-5 text-green-400" />
                      <span className="text-white font-semibold">{story.income}</span>
                    </div>
                    <p className="text-white/70 italic">{story.story}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements Section */}
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
                  <span className="text-purple-300">Requirements</span> to Join
                </h2>
                <p className="text-lg text-white/80 leading-relaxed">
                  We&apos;re looking for dedicated individuals who want to make a positive impact 
                  in their communities while building a sustainable business.
                </p>
                
                <div className="space-y-4">
                  {requirements.map((req, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{req.title}</h4>
                        <p className="text-white/70 text-sm">{req.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="glass rounded-3xl p-8 text-center"
              >
                <GlobeAltIcon className="h-16 w-16 text-purple-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">Join Our Network</h3>
                <p className="text-white/70 mb-6">
                  Become part of Haiti&apos;s largest financial inclusion network and help 
                  bring digital payments to every corner of the country.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-white/70">Training Provided:</span>
                    <span className="text-white font-semibold">✓ Yes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Marketing Support:</span>
                    <span className="text-white font-semibold">✓ Yes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Ongoing Support:</span>
                    <span className="text-white font-semibold">✓ 24/7</span>
                  </div>
                </div>
              </motion.div>
            </div>
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
              className="glass rounded-3xl p-8 md:p-12 text-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to <span className="text-purple-300">Start</span> Your Journey?
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
                Join hundreds of successful distributors who are transforming their communities 
                and building sustainable businesses with KobKlein.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white py-4 px-8 text-lg"
                  onClick={() => window.location.href = `/${params.locale}/auth/register?role=distributor`}
                >
                  Become Distributor
                </Button>
                <Button 
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-purple-600 py-4 px-8 text-lg"
                  onClick={() => window.location.href = `/${params.locale}/contact`}
                >
                  Learn More
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
