"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ParticleBackground } from '@/components/background/particle-background';
import { Button } from '@/components/ui/button';
import { 
  HeartIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  BoltIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface DiasporaPageProps {
  params: {
    locale: string;
  };
}

export default function DiasporaPage({ params }: DiasporaPageProps) {
  const t = useTranslations();

  const steps = [
    {
      number: "1",
      title: "Link Your Wallet",
      description: "Connect your bank account or debit card securely",
      icon: ShieldCheckIcon
    },
    {
      number: "2", 
      title: "Select Recipient",
      description: "Choose your family member in Haiti from your contacts",
      icon: UserGroupIcon
    },
    {
      number: "3",
      title: "Send Instantly",
      description: "Transfer money with just a few taps - arrives in seconds",
      icon: BoltIcon
    }
  ];

  const benefits = [
    {
      icon: CurrencyDollarIcon,
      title: "$2 Flat Fee",
      description: "No matter the amount - $20 or $200, always just $2",
      highlight: "90% Less Fees"
    },
    {
      icon: BoltIcon,
      title: "Instant Transfer",
      description: "Money arrives in seconds, not days",
      highlight: "Real-time"
    },
    {
      icon: ShieldCheckIcon,
      title: "Bank-Level Security",
      description: "Your money and data are protected with encryption",
      highlight: "100% Secure"
    },
    {
      icon: HeartIcon,
      title: "Direct Impact",
      description: "Your money goes directly to your loved ones",
      highlight: "No Middlemen"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900" />
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
                  <span className="text-green-600 font-bold text-xl">K</span>
                </div>
                <span className="text-white font-bold text-xl">KobKlein</span>
              </motion.div>
              
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-green-600"
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
                Send <span className="text-green-300">Love</span>, Not Fees
              </h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed">
                Sending money to Haiti has never been easier — or more powerful. With KobKlein, 
                you reload a loved one&apos;s wallet instantly for just $2 flat, no matter the amount. 
                No middlemen. No hidden charges. Just family.
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white py-4 px-8 text-lg"
                  onClick={() => window.location.href = `/${params.locale}/auth/register?role=diaspora`}
                >
                  Join Diaspora
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Diaspora Card Showcase */}
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
                Your <span className="text-green-300">Diaspora</span> Portal
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Designed specifically for Haitians abroad who want to support their families back home.
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, rotateY: -15 }}
                whileInView={{ opacity: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                whileHover={{ rotateY: 15, scale: 1.05 }}
                className="perspective-1000"
              >
                <div className="relative w-96 h-60 mx-auto">
                  {/* Card Front */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 rounded-2xl shadow-2xl p-6 text-white transform-gpu">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <div className="text-sm opacity-75">KobKlein</div>
                        <div className="text-lg font-bold">Diaspora Card</div>
                      </div>
                      <div className="w-12 h-8 bg-white/20 rounded flex items-center justify-center">
                        <GlobeAltIcon className="w-6 h-4 text-white" />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="text-2xl font-mono tracking-wider">
                        •••• •••• •••• 5678
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xs opacity-75">VALID THRU</div>
                        <div className="text-sm font-mono">12/28</div>
                      </div>
                      <div>
                        <div className="text-xs opacity-75">CARDHOLDER</div>
                        <div className="text-sm font-semibold">NADIA THERMITUS</div>
                      </div>
                      <div className="flex gap-1">
                        <HeartIcon className="w-6 h-6 text-red-300" />
                        <span className="text-xs">🇭🇹</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-green-400/20 rounded-2xl blur-xl -z-10"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Demo Flow Section */}
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
                Send Money in <span className="text-green-300">3 Simple Steps</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white font-bold text-2xl">{step.number}</span>
                  </div>
                  <step.icon className="h-12 w-12 text-green-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-white/70">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
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
                Why Choose <span className="text-green-300">KobKlein</span>?
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="glass rounded-2xl p-6 text-center"
                >
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-white/70 text-sm mb-3">{benefit.description}</p>
                  <div className="text-green-300 font-bold">{benefit.highlight}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Price Comparison */}
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
                <span className="text-green-300">Save Money</span> on Every Transfer
              </h2>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Traditional Services */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="glass rounded-2xl p-8 border-2 border-red-500/30"
                >
                  <h3 className="text-2xl font-bold text-red-300 mb-6 text-center">Traditional Services</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-white">Send $100:</span>
                      <span className="text-red-300 font-bold">$15 fee</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Send $200:</span>
                      <span className="text-red-300 font-bold">$25 fee</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Transfer Time:</span>
                      <span className="text-red-300">1-3 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Hidden Fees:</span>
                      <span className="text-red-300">Yes</span>
                    </div>
                  </div>
                </motion.div>

                {/* KobKlein */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="glass rounded-2xl p-8 border-2 border-green-500/50 relative"
                >
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                      BEST VALUE
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-green-300 mb-6 text-center">KobKlein</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-white">Send $100:</span>
                      <span className="text-green-300 font-bold">$2 fee</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Send $200:</span>
                      <span className="text-green-300 font-bold">$2 fee</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Transfer Time:</span>
                      <span className="text-green-300">Instant</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Hidden Fees:</span>
                      <span className="text-green-300">None</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
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
                Real Stories from <span className="text-green-300">Diaspora</span>
              </h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="glass rounded-2xl p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">NT</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Nadia Thermitus</h3>
                    <p className="text-green-300">Brooklyn, NY 🇺🇸</p>
                  </div>
                </div>
                <p className="text-white/80 italic">
                  I can send money to my family in Haiti instantly. No more Western Union fees or long waits. KobKlein is a game-changer!
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="glass rounded-2xl p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">JM</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Jean Michel</h3>
                    <p className="text-green-300">Miami, FL 🇺🇸</p>
                  </div>
                </div>
                <p className="text-white/80 italic">
                  I send money with 90% less fees. My mother receives it instantly and can use it anywhere. This is the future!
                </p>
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
              <HeartIcon className="h-16 w-16 text-green-300 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Start Sending <span className="text-green-300">Love</span> Today
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
                Join thousands of Haitians abroad who trust KobKlein to support their families back home.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white py-4 px-8 text-lg flex items-center gap-2"
                  onClick={() => window.location.href = `/${params.locale}/auth/register?role=diaspora`}
                >
                  <HeartIcon className="h-5 w-5" />
                  Join Diaspora
                </Button>
                <Button 
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-green-600 py-4 px-8 text-lg"
                  onClick={() => window.location.href = `/${params.locale}/app`}
                >
                  Download App
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
