"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Heart,
  Shield,
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
  ArrowRight,
  Target,
  Award,
  Building
} from "lucide-react";
import { WelcomeFooter } from "../../../components/welcome/welcome-footer";
import { WelcomeNavigation } from "../../../components/welcome/welcome-navigation";

const stats = [
  { number: "50K+", label: "Active Users" },
  { number: "$10M+", label: "Processed" },
  { number: "99.9%", label: "Uptime" },
  { number: "24/7", label: "Support" }
];

const values = [
  {
    icon: Shield,
    title: "Security First",
    description: "Bank-grade encryption and advanced fraud protection keep your money safe at all times."
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Connect with family and businesses across Haiti and the diaspora worldwide."
  },
  {
    icon: Users,
    title: "Community Focused",
    description: "Built by Haitians, for Haitians. We understand your unique financial needs."
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Cutting-edge technology delivering seamless financial experiences."
  }
];

const milestones = [
  {
    year: "2023",
    title: "Founded",
    description: "KobKlein was born with the mission to revolutionize Haitian finance"
  },
  {
    year: "2024",
    title: "Haiti Launch",
    description: "Successfully launched across all regions of Haiti"
  },
  {
    year: "2025",
    title: "Global Expansion", 
    description: "Expanding to serve the Haitian diaspora worldwide"
  },
  {
    year: "2026",
    title: "Caribbean Network",
    description: "Building the largest fintech network in the Caribbean"
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <WelcomeNavigation />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-kobklein-primary via-kobklein-secondary to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
            >
              <Heart className="h-5 w-5 text-kobklein-accent" />
              <span className="text-sm font-medium">Our Story</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              Building the Future of
              <span className="block bg-gradient-to-r from-white via-kobklein-accent to-cyan-300 bg-clip-text text-transparent">
                Haitian Finance
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-12"
            >
              KobKlein is revolutionizing digital payments for Haitians worldwide. 
              Our mission is to connect families, empower communities, and build a 
              cashless future for Haiti.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto"
            >
              <button className="w-full sm:w-auto bg-white text-kobklein-primary font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2">
                Join Our Mission
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="w-full sm:w-auto border-2 border-white/40 text-white font-medium px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-kobklein-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-kobklein-primary/10 text-kobklein-primary px-4 py-2 rounded-full mb-6">
                <Target className="h-4 w-4" />
                <span className="text-sm font-semibold">Our Mission</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Empowering Financial
                <span className="block bg-gradient-to-r from-kobklein-primary to-kobklein-accent bg-clip-text text-transparent">
                  Freedom for All
                </span>
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                We believe every Haitian deserves access to modern financial services. 
                KobKlein bridges the gap between traditional banking and the digital economy, 
                providing secure, accessible, and affordable financial solutions.
              </p>

              <div className="space-y-4">
                {[
                  "Connect Haitian families worldwide",
                  "Empower local businesses and merchants", 
                  "Provide secure digital payment solutions",
                  "Build Haiti's financial infrastructure"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-kobklein-primary/10 to-kobklein-accent/10 rounded-3xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-kobklein-primary to-kobklein-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Globe className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Global Impact</h3>
                  <p className="text-gray-600">
                    Connecting Haitians across continents through innovative financial technology
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-kobklein-primary/10 text-kobklein-primary px-4 py-2 rounded-full mb-6">
              <Award className="h-4 w-4" />
              <span className="text-sm font-semibold">Our Values</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Drives Us
              <span className="block bg-gradient-to-r from-kobklein-primary to-kobklein-accent bg-clip-text text-transparent">
                Every Day
              </span>
            </h2>

            <p className="text-xl text-gray-600 leading-relaxed">
              Our core values guide every decision and shape the future we're building together.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full text-center">
                  <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-kobklein-primary to-kobklein-accent rounded-xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="h-7 w-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-kobklein-primary/10 text-kobklein-primary px-4 py-2 rounded-full mb-6">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-semibold">Our Journey</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Building Haiti's
              <span className="block bg-gradient-to-r from-kobklein-primary to-kobklein-accent bg-clip-text text-transparent">
                Digital Future
              </span>
            </h2>

            <p className="text-xl text-gray-600 leading-relaxed">
              From vision to reality, here's how we're transforming Haitian finance.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`flex flex-col md:flex-row items-center mb-16 last:mb-0 ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1 mb-8 md:mb-0">
                  <div className={`${index % 2 === 1 ? 'md:pl-12 md:text-right' : 'md:pr-12'}`}>
                    <div className={`inline-flex items-center gap-3 mb-4 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                      <span className="text-sm font-bold text-white bg-kobklein-primary px-3 py-1 rounded-full">
                        {milestone.year}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {milestone.title}
                    </h3>
                    
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-kobklein-primary to-kobklein-accent rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {index + 1}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-kobklein-primary/10 text-kobklein-primary px-4 py-2 rounded-full mb-6">
              <Users className="h-4 w-4" />
              <span className="text-sm font-semibold">Our Team</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Meet the People
              <span className="block bg-gradient-to-r from-kobklein-primary to-kobklein-accent bg-clip-text text-transparent">
                Behind KobKlein
              </span>
            </h2>

            <p className="text-xl text-gray-600 leading-relaxed">
              Passionate innovators dedicated to transforming Haitian finance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="aspect-video bg-gradient-to-br from-kobklein-primary/10 to-kobklein-accent/10 rounded-3xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-kobklein-primary to-kobklein-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Team</h3>
                  <p className="text-gray-600">
                    Passionate professionals working together to build Haiti's financial future
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <p className="text-lg text-gray-600 leading-relaxed">
                Our diverse team combines deep expertise in fintech, blockchain, 
                and mobile development with an intimate understanding of Haitian 
                culture and financial needs.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Building, label: "10+ Years Experience" },
                  { icon: Globe, label: "Global Perspective" },
                  { icon: Heart, label: "Haitian Heritage" },
                  { icon: Zap, label: "Innovation Focus" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-gradient-to-br from-kobklein-primary to-kobklein-accent rounded-lg flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-kobklein-primary to-kobklein-accent">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Join the Revolution?
            </h2>
            
            <p className="text-xl text-white/90 leading-relaxed mb-12">
              Be part of Haiti's financial transformation. Experience the future 
              of payments with KobKlein today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <button className="w-full sm:w-auto bg-white text-kobklein-primary font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2">
                Get Started Now
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="w-full sm:w-auto border-2 border-white/40 text-white font-medium px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <WelcomeFooter />
    </div>
  );
}