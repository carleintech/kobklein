"use client";

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { 
  CreditCardIcon, 
  DevicePhoneMobileIcon, 
  ArrowRightIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const steps = [
  {
    number: '01',
    icon: CreditCardIcon,
    titleKey: 'getCard',
    title: 'Get Your KobKlein Card',
    description: 'Visit a local distributor or order online. Choose from Client, Merchant, or Distributor cards.',
    color: 'text-kobklein-gold'
  },
  {
    number: '02',
    icon: DevicePhoneMobileIcon,
    titleKey: 'registerPhone',
    title: 'Register Your Phone',
    description: 'Download the KobKlein app, scan your card, and link it to your phone number.',
    color: 'text-kobklein-accent'
  },
  {
    number: '03',
    icon: CheckCircleIcon,
    titleKey: 'startUsing',
    title: 'Start Using KobKlein',
    description: 'Send, receive, refill, and spend money instantly. No bank account required!',
    color: 'text-green-400'
  }
];

export function WelcomeHowItWorks() {
  const t = useTranslations();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="how-it-works" className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center text-white"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="text-heading font-bold mb-6">
              How KobKlein Works
            </h2>
            <p className="text-subheading opacity-80 max-w-3xl mx-auto">
              Get started with KobKlein in three simple steps. No complicated setup, no bank requirements.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={step.number}
                  variants={itemVariants}
                  className="relative"
                >
                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-16 left-full w-full z-0">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + index * 0.3, duration: 0.8 }}
                        className="h-0.5 bg-gradient-to-r from-white/30 to-transparent origin-left"
                      />
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1 + index * 0.3, duration: 0.5 }}
                        className="absolute right-0 top-1/2 -translate-y-1/2"
                      >
                        <ArrowRightIcon className="h-4 w-4 text-white/50" />
                      </motion.div>
                    </div>
                  )}

                  {/* Step Content */}
                  <div className="relative z-10">
                    {/* Step Number */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6 font-bold text-2xl"
                    >
                      {step.number}
                    </motion.div>

                    {/* Icon */}
                    <div className={`inline-flex p-4 rounded-2xl bg-white/10 mb-6`}>
                      <IconComponent className={`h-8 w-8 ${step.color}`} />
                    </div>

                    {/* Content */}
                    <h3 className="font-bold text-xl mb-4">
                      {step.title}
                    </h3>
                    <p className="text-white/80 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            className="mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="kobklein-button bg-kobklein-accent hover:bg-kobklein-accent/90 text-white font-semibold px-8 py-4 text-lg"
            >
              Get Started Today
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}