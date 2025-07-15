"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ParticleBackground } from '@/components/background/particle-background';
import { Button } from '@/components/ui/button';
import { 
  CreditCardIcon,
  DevicePhoneMobileIcon,
  BoltIcon,
  ShieldCheckIcon,
  MapPinIcon,
  UserGroupIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

interface ClientPageProps {
  params: {
    locale: string;
  };
}

export default function ClientPage({ params }: ClientPageProps) {
  const t = useTranslations();

  const steps = [
    {
      number: "1",
      title: "Get Your Card",
      description: "Visit a local distributor or order online to get your KobKlein card",
      icon: CreditCardIcon
    },
    {
      number: "2", 
      title: "Activate with Phone",
      description: "Link your phone number to your card for secure access",
      icon: DevicePhoneMobileIcon
    },
    {
      number: "3",
      title: "Start Transacting",
      description: "Send, receive, and spend money anywhere KobKlein is accepted",
      icon: BoltIcon
    }
  ];

  const faqs = [
    {
      question: "Where can I buy KobKlein cards?",
      answer: "Visit any authorized KobKlein distributor across Haiti or order online through our app."
    },
    {
      question: "How do I refill my card?",
      answer: "Refill at any distributor, receive money from diaspora, or add funds through the mobile app."
    },
    {
      question: "Is my money safe?",
      answer: "Yes! We use bank-level security with encryption and multi-factor authentication to protect your funds."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900" />
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
                For the <span className="text-blue-300">People</span>. By the People.
              </h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed">
                Don&apos;t have a bank account? You don&apos;t need one. With a KobKlein personal card, 
                anyone in Haiti can become financially included. You are no longer invisible. You are connected.
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 text-lg"
                  onClick={() => window.location.href = `/${params.locale}/auth/register?role=client`}
                >
                  Sign as Client
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Card Showcase Section */}
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
                Your <span className="text-blue-300">KobKlein</span> Card
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Beautiful, secure, and powerful. Your gateway to financial freedom.
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
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-2xl p-6 text-white transform-gpu">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <div className="text-sm opacity-75">KobKlein</div>
                        <div className="text-lg font-bold">Personal Card</div>
                      </div>
                      <div className="w-12 h-8 bg-white/20 rounded flex items-center justify-center">
                        <div className="w-6 h-4 bg-yellow-400 rounded-sm"></div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="text-2xl font-mono tracking-wider">
                        •••• •••• •••• 1234
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xs opacity-75">VALID THRU</div>
                        <div className="text-sm font-mono">12/28</div>
                      </div>
                      <div>
                        <div className="text-xs opacity-75">CARDHOLDER</div>
                        <div className="text-sm font-semibold">JEAN BAPTISTE</div>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                        <div className="w-8 h-8 bg-white/30 rounded-full -ml-2"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-blue-400/20 rounded-2xl blur-xl -z-10"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 3-Step Flow */}
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
                Get Started in <span className="text-blue-300">3 Steps</span>
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
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white font-bold text-2xl">{step.number}</span>
                  </div>
                  <step.icon className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-white/70">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
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
                Frequently Asked <span className="text-blue-300">Questions</span>
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <QuestionMarkCircleIcon className="h-6 w-6 text-blue-300 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                      <p className="text-white/70">{faq.answer}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Distributor Map Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass rounded-3xl p-8 md:p-12 text-center"
            >
              <MapPinIcon className="h-16 w-16 text-blue-300 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Find Your Nearest <span className="text-blue-300">Distributor</span>
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
                Get your KobKlein card today from one of our trusted distributors across Haiti.
              </p>
              
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 text-lg"
                onClick={() => window.location.href = `/${params.locale}#distributor-finder`}
              >
                Find Distributor
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="glass rounded-2xl p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">PM</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Pierre Moïse</h3>
                    <p className="text-blue-300">Client from Jacmel</p>
                  </div>
                </div>
                <p className="text-white/80 italic">
                  No more carrying cash everywhere. My KobKlein card works at all my favorite stores. Simple and secure!
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
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">ML</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Marie Lucie</h3>
                    <p className="text-blue-300">Client from Port-au-Prince</p>
                  </div>
                </div>
                <p className="text-white/80 italic">
                  I receive money from my daughter in Miami instantly. KobKlein changed my life!
                </p>
              </motion.div>
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
