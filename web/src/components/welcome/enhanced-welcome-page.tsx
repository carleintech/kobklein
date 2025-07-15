"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { KobKleinCard } from "@/components/ui/kobklein-card";
import { BalanceDisplay } from "@/components/ui/balance-display";
import EnhancedParticleBackground from "@/components/background/enhanced-particle-background";
import { EnhancedWelcomeNavigation } from "@/components/welcome/enhanced-welcome-navigation";
import { 
  Smartphone, 
  Shield, 
  Globe, 
  Zap, 
  Users, 
  CreditCard,
  ArrowRight,
  CheckCircle,
  Star,
  MapPin,
  ChevronDown,
  Play,
  Download,
  Heart,
  TrendingUp,
  Clock,
  Award,
  Banknote,
  Wifi,
  QrCode,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Building,
  Store,
  Coffee,
  ShoppingBag,
  Utensils,
  Car
} from "lucide-react";

interface EnhancedWelcomePageProps {
  locale: string;
}

export function EnhancedWelcomePage({ locale }: EnhancedWelcomePageProps) {
  const t = useTranslations('welcome');
  const router = useRouter();
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const handleGetApp = () => {
    router.push(`/${locale}/app`);
  };

  const handleBecomeDistributor = () => {
    router.push(`/${locale}/distributor`);
  };

  const handleRoleNavigation = (role: string) => {
    router.push(`/${locale}/${role}`);
  };

  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Bank-Level Security",
      description: "Advanced encryption and multi-factor authentication protect your funds",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Transfers",
      description: "Send money to family in Haiti instantly, 24/7",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Reach",
      description: "Connect Haitian diaspora worldwide with seamless payments",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "NFC Payments",
      description: "Tap-to-pay technology for modern, contactless transactions",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Network",
      description: "Join thousands of Haitians building a cashless future",
      color: "from-indigo-400 to-blue-500"
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "No Hidden Fees",
      description: "Transparent pricing with competitive exchange rates",
      color: "from-teal-400 to-cyan-500"
    }
  ];

  const stats = [
    { value: "50K+", label: "Active Users", icon: <Users className="h-6 w-6" /> },
    { value: "$2M+", label: "Transferred", icon: <TrendingUp className="h-6 w-6" /> },
    { value: "99.9%", label: "Uptime", icon: <Clock className="h-6 w-6" /> },
    { value: "24/7", label: "Support", icon: <Award className="h-6 w-6" /> }
  ];

  const departments = [
    "Ouest", "Sud-Est", "Nord", "Nord-Est", "Nord-Ouest", 
    "Artibonite", "Centre", "Grand'Anse", "Nippes", "Sud"
  ];

  const cities = {
    "Ouest": ["Port-au-Prince", "Pétion-Ville", "Delmas", "Carrefour", "Croix-des-Bouquets"],
    "Nord": ["Cap-Haïtien", "Fort-Dauphin", "Limonade", "Quartier-Morin"],
    "Sud-Est": ["Jacmel", "Marigot", "Cayes-Jacmel", "Bainet"],
    "Artibonite": ["Gonaïves", "Saint-Marc", "Dessalines", "Gros-Morne"],
    "Sud": ["Les Cayes", "Port-Salut", "Aquin", "Saint-Louis du Sud"]
  };

  const testimonials = [
    {
      name: "Jean Baptiste",
      role: "Merchant",
      location: "Port-au-Prince",
      content: "KobKlein transformed my business. I can now accept payments instantly without worrying about cash theft. My sales increased by 40%!",
      avatar: "JB",
      rating: 5
    },
    {
      name: "Nadia Thermitus", 
      role: "Diaspora",
      location: "Brooklyn, NY",
      content: "I can send money to my family in Haiti instantly. No more Western Union fees or long waits. KobKlein is a game-changer!",
      avatar: "NT",
      rating: 5
    },
    {
      name: "Marie Claire",
      role: "Distributor", 
      location: "Cap-Haïtien",
      content: "As a distributor, I help my community access digital payments. The commission system is fair and the app works even offline.",
      avatar: "MC",
      rating: 5
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Get Your Card",
      description: "Visit a local distributor or order online to get your KobKlein card",
      icon: <CreditCard className="h-8 w-8" />
    },
    {
      step: 2,
      title: "Register Your Phone",
      description: "Download the app and link your phone number to your card",
      icon: <Smartphone className="h-8 w-8" />
    },
    {
      step: 3,
      title: "Start Using",
      description: "Send money, pay merchants, and manage your finances digitally",
      icon: <Zap className="h-8 w-8" />
    }
  ];

  const roleCards = [
    {
      title: "For Clients",
      description: "Experience seamless digital payments with your KobKlein card",
      icon: <Users className="h-12 w-12" />,
      features: ["NFC Payments", "QR Code Scanning", "Instant Transfers", "Balance Management"],
      cta: "Sign as Client",
      route: "client",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "For Diaspora",
      description: "Send money to Haiti instantly from anywhere in the world",
      icon: <Globe className="h-12 w-12" />,
      features: ["Global Transfers", "Low Fees", "Real-time Exchange", "Family Support"],
      cta: "Join Diaspora",
      route: "diaspora",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "For Distributors",
      description: "Build your business and earn commissions with KobKlein",
      icon: <Building className="h-12 w-12" />,
      features: ["Commission Earnings", "Job Creation", "Community Impact", "Business Growth"],
      cta: "Become Distributor",
      route: "distributor",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "For Merchants",
      description: "Accept digital payments and grow your business",
      icon: <Store className="h-12 w-12" />,
      features: ["POS Integration", "Instant Payments", "Sales Analytics", "Customer Insights"],
      cta: "Sign as Merchant",
      route: "merchant",
      color: "from-orange-500 to-red-500"
    }
  ];

  const businessTypes = [
    { name: "Restaurants", icon: <Utensils className="h-8 w-8" />, count: "1,200+" },
    { name: "Retail Stores", icon: <ShoppingBag className="h-8 w-8" />, count: "2,500+" },
    { name: "Coffee Shops", icon: <Coffee className="h-8 w-8" />, count: "800+" },
    { name: "Gas Stations", icon: <Car className="h-8 w-8" />, count: "300+" },
    { name: "Supermarkets", icon: <Building className="h-8 w-8" />, count: "450+" },
    { name: "Pharmacies", icon: <Heart className="h-8 w-8" />, count: "600+" }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
      {/* Enhanced Particle Background */}
      <EnhancedParticleBackground />
      
      {/* Navigation */}
      <EnhancedWelcomeNavigation locale={locale} />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30 backdrop-blur-sm">
                  <Star className="h-4 w-4 text-yellow-400 mr-2" />
                  <span className="text-sm font-medium">Trusted by 50,000+ Haitians</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Bank-Free Payments.
                  </span>
                  <br />
                  <span className="text-white">Powered by You.</span>
                </h1>
                
                <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
                  A secure and cashless digital wallet system designed for Haitians 
                  and their families worldwide. Send money instantly, pay merchants, 
                  and build financial freedom together.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={handleGetApp}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Get the App
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
                  onClick={handleBecomeDistributor}
                >
                  <Users className="mr-2 h-5 w-5" />
                  Become a Distributor
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                    <div className="flex justify-center mb-2 text-cyan-400 group-hover:text-cyan-300">
                      {stat.icon}
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-cyan-400">
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - 3D Card Showcase */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl scale-110 group-hover:scale-125 transition-transform duration-500"></div>
                
                {/* Card */}
                <KobKleinCard className="relative bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-8 max-w-md transform group-hover:rotateY-12 transition-all duration-500 hover:shadow-2xl">
                  <div className="text-center space-y-6">
                    <div className="text-slate-400 text-sm font-medium">
                      Welcome back, Jean
                    </div>
                    
                    <BalanceDisplay
                      balance={53200.00}
                      currency="HTG"
                      className="text-4xl font-bold"
                    />
                    
                    <div className="text-slate-400 text-sm">
                      ≈ $ 401.51 USD
                    </div>
                    
                    <div className="flex items-center justify-center space-x-2 text-green-400 text-sm">
                      <CheckCircle className="h-4 w-4" />
                      <span>Card Active • NFC Ready</span>
                    </div>

                    {/* NFC & QR Icons */}
                    <div className="flex justify-center space-x-4 pt-4">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Wifi className="h-6 w-6 text-blue-400" />
                      </div>
                      <div className="p-2 bg-cyan-500/20 rounded-lg">
                        <QrCode className="h-6 w-6 text-cyan-400" />
                      </div>
                    </div>
                  </div>
                </KobKleinCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Cards Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Choose Your <span className="text-cyan-400">KobKlein</span> Journey
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Whether you&apos;re sending money, accepting payments, or building a business, KobKlein has the perfect solution for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roleCards.map((card, index) => (
              <div
                key={index}
                className="group bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl p-6"
              >
                <div className={`text-transparent bg-gradient-to-r ${card.color} bg-clip-text mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {card.title}
                </h3>
                <p className="text-slate-300 mb-4 text-sm">
                  {card.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {card.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full bg-gradient-to-r ${card.color} hover:opacity-90 text-white font-medium`}
                  onClick={() => handleRoleNavigation(card.route)}
                >
                  {card.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose <span className="text-cyan-400">KobKlein</span>?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Built specifically for the Haitian community, with features that matter most to you and your family.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl"
              >
                <div className={`text-transparent bg-gradient-to-r ${feature.color} bg-clip-text mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Types Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Accepted at <span className="text-cyan-400">5,000+</span> Businesses
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Use your KobKlein card at thousands of businesses across Haiti
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {businessTypes.map((business, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-4 group-hover:border-cyan-400/50 transition-colors duration-300">
                  <div className="text-cyan-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                    {business.icon}
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {business.count}
                  </div>
                </div>
                <div className="text-sm text-slate-300 font-medium">
                  {business.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How <span className="text-cyan-400">KobKlein</span> Works
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Get started with KobKlein in just three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-cyan-400 text-slate-900 rounded-full flex items-center justify-center font-bold text-sm">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {step.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Find Your Local Distributor Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <MapPin className="inline-block mr-3 h-10 w-10 text-cyan-400" />
              Find Your Local <span className="text-cyan-400">Distributor</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Locate KobKlein distributors near you across Haiti
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Department Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Select Department
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDepartment}
                      onChange={(e) => {
                        setSelectedDepartment(e.target.value);
                        setSelectedCity("");
                      }}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent appearance-none"
                      aria-label="Select Department"
                    >
                      <option value="">Choose a department...</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* City Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Select City
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      disabled={!selectedDepartment}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent appearance-none disabled:opacity-50"
                      aria-label="Select City"
                    >
                      <option value="">Choose a city...</option>
                      {selectedDepartment && cities[selectedDepartment as keyof typeof cities]?.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Search Results */}
              {selectedDepartment && selectedCity && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Distributors in {selectedCity}, {selectedDepartment}
                  </h3>
                  <div className="grid gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-white">KobKlein Distributor #{i}</h4>
                            <p className="text-slate-300 text-sm mt-1">
                              {selectedCity}, {selectedDepartment}
                            </p>
                            <div className="flex items-center mt-2 text-sm text-slate-400">
                              <Phone className="h-4 w-4 mr-1" />
                              +509 {Math.floor(Math.random() * 9000) + 1000} {Math.floor(Math.random() * 9000) + 1000}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-green-400 text-sm font-medium">Open</div>
                            <div className="text-slate-400 text-xs">8AM - 6PM</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Join thousands of satisfied users across Haiti and the diaspora who trust KobKlein for their financial needs.
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
              <div className="text-center">
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-xl md:text-2xl font-medium mb-8 leading-relaxed text-white">
                  &ldquo;{testimonials[currentTestimonial].content}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-lg text-white">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-cyan-400 font-medium">
                      {testimonials[currentTestimonial].role}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {testimonials[currentTestimonial].location}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-700/50 hover:bg-slate-600/50 rounded-full flex items-center justify-center transition-colors duration-200"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-700/50 hover:bg-slate-600/50 rounded-full flex items-center justify-center transition-colors duration-200"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-cyan-400 scale-125'
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Exchange Rate Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Live Exchange <span className="text-cyan-400">Rates</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Get the best rates for your money transfers with transparent, real-time pricing
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
              <div className="grid grid-cols-2 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-white mb-2">133.50</div>
                  <div className="text-slate-400">HTG per USD</div>
                  <div className="text-green-400 text-sm mt-1">↑ 0.5%</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white mb-2">0.0075</div>
                  <div className="text-slate-400">USD per HTG</div>
                  <div className="text-red-400 text-sm mt-1">↓ 0.5%</div>
                </div>
              </div>
              <div className="text-center mt-6">
                <div className="text-sm text-slate-400">
                  Last updated: Just now
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Rates update every 30 seconds
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Download <span className="text-cyan-400">KobKlein</span> Today
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Available on iOS and Android. Join the financial revolution in Haiti.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl p-12 border border-blue-400/20 text-center">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Ready to Get Started?
                  </h3>
                  <p className="text-slate-300 mb-6">
                    Join thousands of Haitians who are already using KobKlein to send money, 
                    pay bills, and build a better financial future.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={handleGetApp}
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Download for iOS
                    </Button>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={handleGetApp}
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Download for Android
                    </Button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-64 h-64 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl flex items-center justify-center">
                      <Smartphone className="h-32 w-32 text-cyan-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-700/50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <span className="text-white font-bold text-xl">KobKlein</span>
              </div>
              <p className="text-slate-400 text-sm">
                Building the future of digital payments in Haiti. Bank-free, secure, and powered by community.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href={`/${locale}/about`} className="text-slate-400 hover:text-white transition-colors text-sm">About Us</a></li>
                <li><a href={`/${locale}/app`} className="text-slate-400 hover:text-white transition-colors text-sm">Download App</a></li>
                <li><a href={`/${locale}/join`} className="text-slate-400 hover:text-white transition-colors text-sm">Join Us</a></li>
                <li><a href={`/${locale}/contact`} className="text-slate-400 hover:text-white transition-colors text-sm">Contact</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-white font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href={`/${locale}/client`} className="text-slate-400 hover:text-white transition-colors text-sm">For Clients</a></li>
                <li><a href={`/${locale}/diaspora`} className="text-slate-400 hover:text-white transition-colors text-sm">For Diaspora</a></li>
                <li><a href={`/${locale}/distributor`} className="text-slate-400 hover:text-white transition-colors text-sm">For Distributors</a></li>
                <li><a href={`/${locale}/merchant`} className="text-slate-400 hover:text-white transition-colors text-sm">For Merchants</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-slate-400 text-sm">
                  <Mail className="h-4 w-4 mr-2" />
                  support@kobklein.com
                </li>
                <li className="flex items-center text-slate-400 text-sm">
                  <Phone className="h-4 w-4 mr-2" />
                  +509 1234 5678
                </li>
                <li className="flex items-center text-slate-400 text-sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  Port-au-Prince, Haiti
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700/50 mt-12 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              © 2025 TECHKLEIN | Built with <Heart className="inline h-4 w-4 text-red-400" /> in Haiti
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
