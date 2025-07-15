"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ParticleBackground } from '@/components/background/particle-background';
import { Button } from '@/components/ui/button';
import { 
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  UserGroupIcon,
  PaperAirplaneIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

interface ContactPageProps {
  params: {
    locale: string;
  };
}

export default function ContactPage({ params }: ContactPageProps) {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    message: '',
    attachment: null as File | null
  });

  const contactMethods = [
    {
      icon: ChatBubbleLeftRightIcon,
      title: "WhatsApp",
      description: "Chat with us instantly",
      value: "+509 1234-5678",
      action: "Chat Now",
      color: "green"
    },
    {
      icon: PhoneIcon,
      title: "Phone Support",
      description: "Call us directly",
      value: "+509 2222-3333",
      action: "Call Now",
      color: "blue"
    },
    {
      icon: EnvelopeIcon,
      title: "Email",
      description: "Send us a message",
      value: "support@kobklein.com",
      action: "Send Email",
      color: "purple"
    },
    {
      icon: MapPinIcon,
      title: "Visit Us",
      description: "KobKlein HQ",
      value: "Port-au-Prince, Haiti",
      action: "Get Directions",
      color: "orange"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'from-green-600 to-green-700 border-green-500/50';
      case 'blue':
        return 'from-blue-600 to-blue-700 border-blue-500/50';
      case 'purple':
        return 'from-purple-600 to-purple-700 border-purple-500/50';
      case 'orange':
        return 'from-orange-600 to-orange-700 border-orange-500/50';
      default:
        return 'from-gray-600 to-gray-700 border-gray-500/50';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-cyan-800 to-blue-900" />
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
                  <span className="text-teal-600 font-bold text-xl">K</span>
                </div>
                <span className="text-white font-bold text-xl">KobKlein</span>
              </motion.div>
              
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-teal-600"
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
                Let&apos;s <span className="text-teal-300">Talk</span>. Let&apos;s Build.
              </h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed">
                Questions? Ideas? Feedback? We want to hear from you. Contact the KobKlein team directly — 
                via WhatsApp, phone, email, or in person at our partner offices. We&apos;re here to support you, 24/7.
              </p>
              
              <motion.div className="flex items-center justify-center gap-2 text-teal-300">
                <ClockIcon className="h-6 w-6" />
                <span className="text-lg font-semibold">Typical reply in under 2 hours</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Contact Methods */}
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
                Get in <span className="text-teal-300">Touch</span>
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Choose your preferred way to reach us
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className={`glass rounded-2xl p-6 text-center border-2 ${getColorClasses(method.color)}`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${getColorClasses(method.color)} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <method.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{method.title}</h3>
                  <p className="text-white/70 text-sm mb-3">{method.description}</p>
                  <p className="text-teal-300 font-semibold mb-4">{method.value}</p>
                  <Button 
                    className={`w-full bg-gradient-to-r ${getColorClasses(method.color)} text-white py-2 px-4`}
                  >
                    {method.action}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="glass rounded-3xl p-8"
              >
                <h2 className="text-3xl font-bold text-white mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-teal-400"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-teal-400"
                      title="Select your role"
                      required
                    >
                      <option value="">Select your role</option>
                      <option value="client">Client</option>
                      <option value="merchant">Merchant</option>
                      <option value="distributor">Distributor</option>
                      <option value="diaspora">Diaspora</option>
                      <option value="developer">Developer</option>
                      <option value="investor">Investor</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={5}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-teal-400 resize-none"
                      placeholder="Tell us how we can help you..."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Attachment (Optional)</label>
                    <input
                      type="file"
                      onChange={(e) => setFormData({...formData, attachment: e.target.files?.[0] || null})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-teal-600 file:text-white hover:file:bg-teal-700"
                      title="Upload attachment"
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 px-6 text-lg flex items-center justify-center gap-2"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                    Send Message
                  </Button>
                </form>
              </motion.div>

              {/* Support Team & Info */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                {/* Support Team */}
                <div className="glass rounded-3xl p-8">
                  <UserGroupIcon className="h-12 w-12 text-teal-300 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-4">Our Support Team</h3>
                  <p className="text-white/80 mb-6">
                    Our dedicated support team is here to help you succeed with KobKlein. 
                    We speak Kreyòl, French, and English.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {['MS', 'JB', 'AL'].map((initials, index) => (
                      <div key={index} className="text-center">
                        <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white font-bold">{initials}</span>
                        </div>
                        <div className="text-white/70 text-sm">Support Agent</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Office Location */}
                <div className="glass rounded-3xl p-8">
                  <MapPinIcon className="h-12 w-12 text-teal-300 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-4">Visit Our Office</h3>
                  <div className="space-y-3 text-white/80">
                    <p><strong>KobKlein Headquarters</strong></p>
                    <p>123 Rue de la Révolution<br />Port-au-Prince, Haiti</p>
                    <p><strong>Hours:</strong><br />Monday - Friday: 8:00 AM - 6:00 PM<br />Saturday: 9:00 AM - 2:00 PM</p>
                  </div>
                  <Button 
                    className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white py-3"
                  >
                    Get Directions
                  </Button>
                </div>

                {/* Live Status */}
                <div className="glass rounded-3xl p-8 text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white font-semibold">We&apos;re Online</span>
                  </div>
                  <p className="text-white/70 text-sm">
                    Average response time: <strong className="text-teal-300">1.5 hours</strong>
                  </p>
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
              <HeartIcon className="h-16 w-16 text-teal-300 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Let&apos;s Change <span className="text-teal-300">Lives</span> Together
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
                Every conversation is a step toward building a better financial future for Haiti. 
                We&apos;re here to listen, help, and grow together.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-teal-600 hover:bg-teal-700 text-white py-4 px-8 text-lg flex items-center gap-2"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  Start Conversation
                </Button>
                <Button 
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-teal-600 py-4 px-8 text-lg"
                  onClick={() => window.location.href = `/${params.locale}/join`}
                >
                  Join Our Team
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
