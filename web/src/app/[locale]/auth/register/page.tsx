"use client";

import { motion } from 'framer-motion';
import { ParticleBackground } from '@/components/background/particle-background';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface RegisterPageProps {
  params: {
    locale: string;
  };
  searchParams: {
    role?: string;
  };
}

export default function RegisterPage({ params, searchParams }: RegisterPageProps) {
  const role = searchParams?.role || 'client';
  
  const getRoleTitle = (role: string) => {
    switch (role) {
      case 'client': return 'Client Registration';
      case 'merchant': return 'Merchant Registration';
      case 'distributor': return 'Distributor Registration';
      case 'diaspora': return 'Diaspora Registration';
      default: return 'Registration';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'client': return 'from-blue-600 to-blue-700';
      case 'merchant': return 'from-orange-600 to-orange-700';
      case 'distributor': return 'from-purple-600 to-purple-700';
      case 'diaspora': return 'from-green-600 to-green-700';
      default: return 'from-blue-600 to-blue-700';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getRoleColor(role)}`} />
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
                  className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-blue-600 flex items-center gap-2"
                  onClick={() => window.location.href = `/${params.locale}`}
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <section className="py-20 sm:py-32">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl mx-auto text-center text-white space-y-8"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                {getRoleTitle(role)}
              </h1>
              <div className="glass rounded-3xl p-8 md:p-12">
                <h2 className="text-2xl font-bold mb-6">Coming Soon!</h2>
                <p className="text-lg opacity-90 mb-8">
                  We&apos;re working hard to bring you the best registration experience. 
                  Our {role} registration will be available very soon.
                </p>
                
                <div className="space-y-4">
                  <p className="text-white/80">
                    In the meantime, you can:
                  </p>
                  <ul className="text-left space-y-2 text-white/70">
                    <li>• Learn more about KobKlein on our About page</li>
                    <li>• Contact us for early access</li>
                    <li>• Follow our updates on social media</li>
                  </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Button 
                    className="bg-white/20 hover:bg-white/30 text-white"
                    onClick={() => window.location.href = `/${params.locale}/contact`}
                  >
                    Contact Us
                  </Button>
                  <Button 
                    variant="outline"
                    className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-blue-600"
                    onClick={() => window.location.href = `/${params.locale}/about`}
                  >
                    Learn More
                  </Button>
                </div>
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
