"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ParticleBackground } from '@/components/background/particle-background';
import { Button } from '@/components/ui/button';
import { 
  CreditCardIcon,
  DevicePhoneMobileIcon,
  ShoppingBagIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  HeartIcon,
  CakeIcon,
  WrenchScrewdriverIcon,
  BeakerIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  BanknotesIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface MerchantPageProps {
  params: {
    locale: string;
  };
}

export default function MerchantPage({ params }: MerchantPageProps) {
  const t = useTranslations();

  const businessTypes = [
    {
      icon: ShoppingBagIcon,
      title: "Retail Stores",
      description: "Clothing, electronics, and general merchandise",
      count: "2,500+",
      color: "bg-blue-600"
    },
    {
      icon: BuildingStorefrontIcon,
      title: "Restaurants",
      description: "Fine dining, fast food, and local eateries",
      count: "1,200+",
      color: "bg-green-600"
    },
    {
      icon: CakeIcon,
      title: "Bakeries & Cafés",
      description: "Coffee shops, bakeries, and dessert places",
      count: "800+",
      color: "bg-yellow-600"
    },
    {
      icon: TruckIcon,
      title: "Gas Stations",
      description: "Fuel stations and automotive services",
      count: "300+",
      color: "bg-red-600"
    },
    {
      icon: HeartIcon,
      title: "Pharmacies",
      description: "Medical supplies and health products",
      count: "600+",
      color: "bg-pink-600"
    },
    {
      icon: WrenchScrewdriverIcon,
      title: "Service Centers",
      description: "Repair shops and technical services",
      count: "450+",
      color: "bg-purple-600"
    },
    {
      icon: BeakerIcon,
      title: "Beauty Salons",
      description: "Hair salons and beauty treatments",
      count: "350+",
      color: "bg-indigo-600"
    },
    {
      icon: AcademicCapIcon,
      title: "Educational",
      description: "Schools, tutoring, and training centers",
      count: "200+",
      color: "bg-teal-600"
    }
  ];

  const posFeatures = [
    {
      icon: CreditCardIcon,
      title: "NFC Card Payments",
      description: "Accept contactless payments with KobKlein cards"
    },
    {
      icon: DevicePhoneMobileIcon,
      title: "QR Code Scanning",
      description: "Quick payments via QR code scanning"
    },
    {
      icon: BanknotesIcon,
      title: "Instant Settlement",
      description: "Receive payments instantly in your account"
    },
    {
      icon: ClockIcon,
      title: "24/7 Availability",
      description: "Process payments anytime, even offline"
    },
    {
      icon: ShieldCheckIcon,
      title: "Secure Transactions",
      description: "Bank-level security for all transactions"
    },
    {
      icon: CheckCircleIcon,
      title: "Easy Integration",
      description: "Simple setup with existing systems"
    }
  ];

  const benefits = [
    {
      title: "Increase Sales",
      description: "Accept digital payments and attract more customers",
      percentage: "40%"
    },
    {
      title: "Reduce Cash Handling",
      description: "Minimize theft risk and counting errors",
      percentage: "90%"
    },
    {
      title: "Faster Transactions",
      description: "Process payments in seconds, not minutes",
      percentage: "75%"
    },
    {
      title: "Lower Fees",
      description: "Competitive rates compared to traditional processors",
      percentage: "60%"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-orange-800 to-red-900" />
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
                  <span className="text-orange-600 font-bold text-xl">K</span>
                </div>
                <span className="text-white font-bold text-xl">KobKlein</span>
              </motion.div>
              
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-orange-600"
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
                <span className="text-orange-300">Merchant</span> Solutions
              </h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed">
                Transform your business with KobKlein&apos;s advanced POS system. Accept digital payments, 
                increase sales, and join thousands of successful merchants across Haiti.
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  className="bg-orange-600 hover:bg-orange-700 text-white py-4 px-8 text-lg"
                  onClick={() => window.location.href = `/${params.locale}/auth/register?role=merchant`}
                >
                  Sign as Merchant
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Business Types Section */}
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
                Perfect for <span className="text-orange-300">Every Business</span>
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                From small shops to large enterprises, KobKlein serves all types of businesses
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {businessTypes.map((business, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="glass rounded-2xl p-6 text-center"
                >
                  <div className={`w-16 h-16 ${business.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <business.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{business.title}</h3>
                  <p className="text-white/70 text-sm mb-3">{business.description}</p>
                  <div className="text-orange-300 font-bold text-lg">{business.count}</div>
                  <div className="text-white/60 text-xs">Active Merchants</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* POS System Showcase */}
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
                  Advanced <span className="text-orange-300">POS System</span>
                </h2>
                <p className="text-lg text-white/80 leading-relaxed">
                  Our state-of-the-art Point of Sale system makes accepting payments simple, 
                  secure, and efficient. Compatible with all KobKlein cards and mobile payments.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {posFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <feature.icon className="h-6 w-6 text-orange-300 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white">{feature.title}</h4>
                        <p className="text-white/70 text-sm">{feature.description}</p>
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
                className="relative"
              >
                <div className="glass rounded-3xl p-8 text-center">
                  <div className="w-32 h-48 bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl mx-auto mb-6 flex items-center justify-center border-4 border-orange-300">
                    <div className="text-center">
                      <CreditCardIcon className="h-12 w-12 text-orange-300 mx-auto mb-2" />
                      <div className="text-white text-sm font-bold">KobKlein POS</div>
                      <div className="text-orange-300 text-xs">Ready to Accept</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Professional POS Terminal</h3>
                  <p className="text-white/70">Sleek, modern design that fits any business environment</p>
                </div>
              </motion.div>
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
                Proven <span className="text-orange-300">Business Results</span>
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                See how KobKlein merchants are transforming their businesses
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-6 text-center"
                >
                  <div className="text-4xl font-bold text-orange-300 mb-2">{benefit.percentage}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-white/70">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
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
                How <span className="text-orange-300">Payment</span> Works
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Simple, fast, and secure payment process for your customers
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Customer Taps Card</h3>
                <p className="text-white/70">Customer places their KobKlein card near your POS terminal</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Instant Verification</h3>
                <p className="text-white/70">Payment is verified and processed in real-time</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Payment Complete</h3>
                <p className="text-white/70">Funds are instantly credited to your merchant account</p>
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
                Ready to <span className="text-orange-300">Transform</span> Your Business?
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
                Join thousands of successful merchants who trust KobKlein for their payment processing needs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-orange-600 hover:bg-orange-700 text-white py-4 px-8 text-lg"
                  onClick={() => window.location.href = `/${params.locale}/auth/register?role=merchant`}
                >
                  Sign as Merchant
                </Button>
                <Button 
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-orange-600 py-4 px-8 text-lg"
                  onClick={() => window.location.href = `/${params.locale}/contact`}
                >
                  Contact Sales
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
