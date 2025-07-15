"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ParticleBackground } from '@/components/background/particle-background';
import { Button } from '@/components/ui/button';
import { 
  DevicePhoneMobileIcon,
  QrCodeIcon,
  CreditCardIcon,
  BoltIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

interface AppPageProps {
  params: {
    locale: string;
  };
}

export default function AppPage({ params }: AppPageProps) {
  const t = useTranslations();

  const features = [
    {
      icon: ShieldCheckIcon,
      title: "Secure Login",
      description: "PIN, Face ID, and biometric authentication"
    },
    {
      icon: BoltIcon,
      title: "Instant Transfers",
      description: "Send money to anyone in seconds"
    },
    {
      icon: QrCodeIcon,
      title: "Merchant Scan",
      description: "Pay at any KobKlein merchant with QR"
    },
    {
      icon: GlobeAltIcon,
      title: "Refill from Abroad",
      description: "Receive money from diaspora instantly"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900" />
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
                  <span className="text-blue-600 font-bold text-xl">K</span>
                </div>
                <span className="text-white font-bold text-xl">KobKlein</span>
              </motion.div>
              
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-blue-600"
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
                The <span className="text-blue-300">Wallet</span> That Fits in Your Hand
              </h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed">
                No Bank Needed. Download the KobKlein app and take your financial life with you, 
                wherever you go. Make instant transfers, receive money from family abroad, 
                pay with NFC or QR, and manage your card in real-time.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 3D Phone Mockup Section */}
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
                  Your <span className="text-blue-300">Digital Wallet</span>
                </h2>
                <p className="text-lg text-white/80 leading-relaxed">
                  Industry-grade security, lightning-fast UI, and support in Kreyòl, French, and English. 
                  Everything you need for modern financial freedom.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <feature.icon className="h-6 w-6 text-blue-300 mt-1 flex-shrink-0" />
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
                  <div className="w-48 h-96 bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl mx-auto mb-6 flex flex-col items-center justify-center border-4 border-blue-300 relative overflow-hidden">
                    {/* Phone Screen Content */}
                    <div className="absolute inset-2 bg-gradient-to-b from-blue-600 to-purple-600 rounded-2xl flex flex-col">
                      <div className="p-4 text-white">
                        <div className="text-center mb-4">
                          <div className="text-sm opacity-75">KobKlein Wallet</div>
                          <div className="text-2xl font-bold">HTG 15,250</div>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-white/20 rounded-lg p-2 text-xs">
                            <div className="flex justify-between">
                              <span>Send Money</span>
                              <QrCodeIcon className="h-4 w-4" />
                            </div>
                          </div>
                          <div className="bg-white/20 rounded-lg p-2 text-xs">
                            <div className="flex justify-between">
                              <span>Pay Merchant</span>
                              <CreditCardIcon className="h-4 w-4" />
                            </div>
                          </div>
                          <div className="bg-white/20 rounded-lg p-2 text-xs">
                            <div className="flex justify-between">
                              <span>Receive Funds</span>
                              <BoltIcon className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">KobKlein Mobile App</h3>
                  <p className="text-white/70">Available on Android, iOS coming soon</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Download Section */}
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
                Download <span className="text-blue-300">KobKlein</span> Today
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Join the financial revolution in Haiti. Get started in minutes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white py-4 px-8 text-lg flex items-center gap-2"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  Download for Android
                </Button>
                <Button 
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-blue-600 py-4 px-8 text-lg flex items-center gap-2"
                >
                  <DevicePhoneMobileIcon className="h-5 w-5" />
                  iOS Coming Soon
                </Button>
              </div>

              <div className="glass rounded-2xl p-6 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-white mb-3">Join Beta Access</h3>
                <p className="text-white/70 text-sm mb-4">
                  Be among the first to experience the future of payments in Haiti
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Join Waitlist
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
