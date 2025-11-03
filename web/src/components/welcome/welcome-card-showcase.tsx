"use client";

import { motion } from "framer-motion";
import { ArrowRight, CreditCard, Download, Shield, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";

export function WelcomeHowItWorks() {
  const t = useTranslations('howItWorks');
  
  const steps = [
    {
      step: "01",
      icon: Download,
      index: 0
    },
    {
      step: "02", 
      icon: CreditCard,
      index: 1
    },
    {
      step: "03",
      icon: Shield,
      index: 2
    },
    {
      step: "04",
      icon: Smartphone,
      index: 3
    }
  ];
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`flex flex-col md:flex-row items-center mb-16 last:mb-0 ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Content */}
              <div className="flex-1 mb-8 md:mb-0">
                <div className={`${index % 2 === 1 ? 'md:pl-12' : 'md:pr-12'}`}>
                  <div className="inline-flex items-center gap-3 mb-4">
                    <span className="text-sm font-bold text-kobklein-primary bg-kobklein-primary/10 px-3 py-1 rounded-full">
                      STEP {step.step}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {t(`steps.${step.index}.title`)}
                  </h3>
                  
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    {t(`steps.${step.index}.description`)}
                  </p>

                  {index < steps.length - 1 && (
                    <div className="hidden md:flex items-center text-kobklein-primary">
                      <ArrowRight className="h-5 w-5" />
                      <span className="ml-2 text-sm font-medium">Next Step</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-kobklein-primary to-kobklein-accent rounded-2xl flex items-center justify-center shadow-xl">
                  <step.icon className="h-12 w-12 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-20"
        >
          <button className="bg-kobklein-primary hover:bg-kobklein-primary/90 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors inline-flex items-center gap-2">
            Get Started Today
            <ArrowRight className="h-5 w-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}