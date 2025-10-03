"use client";

import type { Container, ISourceOptions } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

interface ParticleBackgroundProps {
  className?: string;
  id?: string;
}

// Financial Symbol Components
const FinancialSymbols = () => {
  const symbols = ["$", "€", "£", "¥", "₿", "₹", "₩"];
  const chartPatterns = [
    "M10,20 L15,10 L20,15 L25,5 L30,12",
    "M5,25 Q15,5 25,15 T45,10",
    "M8,18 L12,8 L16,14 L20,4 L24,10 L28,2",
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Floating Financial Symbols - Enhanced Visibility */}
      {symbols.map((symbol, i) => (
        <motion.div
          key={`symbol-${i}`}
          className={`absolute text-kobklein-neon-blue/70 font-bold select-none drop-shadow-lg ${
            i % 4 === 0 ? 'text-4xl' :
            i % 4 === 1 ? 'text-5xl' :
            i % 4 === 2 ? 'text-6xl' : 'text-7xl'
          }`}
          style={{
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [0.4, 0.8, 0.4],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: Math.random() * 8 + 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 3,
          }}
        >
          {symbol}
        </motion.div>
      ))}

      {/* Animated Chart Lines */}
      {chartPatterns.map((path, i) => (
        <motion.svg
          key={`chart-${i}`}
          className="absolute"
          width="60"
          height="40"
          style={{
            left: Math.random() * 90 + "%",
            top: Math.random() * 90 + "%",
          }}
          animate={{
            opacity: [0.2, 0.6, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: Math.random() * 8 + 12,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        >
          <motion.path
            d={path}
            stroke="#4A7BFF"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
            animate={{
              strokeDashoffset: [0, -20],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.path
            d={path}
            stroke="#9B4DFF"
            strokeWidth="1"
            fill="none"
            opacity={0.6}
          />
        </motion.svg>
      ))}

      {/* Data Stream Lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`stream-${i}`}
          className="absolute w-px h-32 bg-gradient-to-b from-transparent via-kobklein-neon-purple/40 to-transparent"
          style={{
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scaleY: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 4 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Holographic Grid */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern
              id="grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="#4A7BFF"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  );
};

export function ParticleBackground({
  className = "",
  id = "tsparticles",
}: ParticleBackgroundProps) {
  const [init, setInit] = useState(false);

  // Initialize particles engine
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = useCallback(async (container?: Container) => {
    // Particles loaded successfully
  }, []);

  // Clean Modern Particle Configuration
  const options: ISourceOptions = {
    background: {
      color: {
        value: "transparent",
      },
    },
    fullScreen: {
      enable: false,
    },
    particles: {
      color: {
        value: ["#4A7BFF", "#9B4DFF", "#FFB533"],
      },
      links: {
        color: "#4A7BFF",
        distance: 120,
        enable: true,
        opacity: 0.9,
        width: 3,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: true,
        speed: 1.5,
        straight: false,
      },
      number: {
        density: {
          enable: true,
        },
        value: 30,
      },
      opacity: {
        value: { min: 0.2, max: 0.6 },
        animation: {
          enable: true,
          speed: 2,
          sync: false,
        },
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 3 },
        animation: {
          enable: true,
          speed: 3,
          sync: false,
        },
      },
    },
    interactivity: {
      detectsOn: "window",
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 100,
          duration: 0.4,
        },
      },
    },
    detectRetina: true,
    fpsLimit: 60,
  };

  if (!init) {
    return (
      <div className={`absolute inset-0 ${className}`}>
        <FinancialSymbols />
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`} style={{ zIndex: 100 }}>
      {/* Clean Modern Particles */}
      <div className="absolute inset-0 z-50">
        {/* Elegant Floating Particles - KobKlein Brand Colors */}
        <motion.div
          className="absolute top-20 left-20 w-3 h-3 bg-kobklein-neon-blue/60 rounded-full shadow-lg"
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 0.8, 0.4],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-32 right-32 w-2 h-2 bg-kobklein-neon-purple/70 rounded-full shadow-md"
          animate={{
            x: [0, 12, 0],
            opacity: [0.3, 0.7, 0.3],
            rotate: [0, 180],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-32 left-1/3 w-4 h-4 bg-kobklein-gold/50 rounded-full shadow-lg"
          animate={{
            y: [0, 20, 0],
            x: [0, -8, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-2 h-2 bg-kobklein-neon-blue/40 rounded-full shadow-sm"
          animate={{
            scale: [0.6, 1.3, 0.6],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-kobklein-neon-purple/50 rounded-full shadow-md"
          animate={{
            rotate: [0, 360],
            opacity: [0.2, 0.6, 0.2],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-2 h-2 bg-kobklein-gold/60 rounded-full shadow-sm"
          animate={{
            x: [0, 15, 0],
            scale: [0.7, 1.2, 0.7],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
      </div>

      {/* Financial Symbols and Charts Layer */}
      <div className="absolute inset-0 z-40">
        <FinancialSymbols />
      </div>

      {/* Particle System */}
      <div className="absolute inset-0 z-40">
        <Particles
          id={id}
          particlesLoaded={particlesLoaded}
          options={options}
          className="w-full h-full opacity-100"
        />
      </div>

      {/* Subtle Background Accent Particles */}
      <div className="absolute inset-0 z-30">
        {/* Minimalist Accent Particles */}
        <motion.div
          className="absolute top-16 left-16 w-1 h-1 bg-kobklein-neon-blue/30 rounded-full"
          animate={{
            y: [0, -8, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-24 right-24 w-1 h-1 bg-kobklein-neon-purple/40 rounded-full"
          animate={{
            x: [0, 6, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-24 left-1/5 w-2 h-2 bg-kobklein-gold/25 rounded-full"
          animate={{
            scale: [0.5, 1, 0.5],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
        <motion.div
          className="absolute top-2/3 left-3/4 w-1 h-1 bg-kobklein-neon-blue/20 rounded-full"
          animate={{
            rotate: [0, 360],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Holographic Overlay Effects */}
      <div className="absolute inset-0 z-40">
        {/* Scanning Lines */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-kobklein-neon-blue/20 to-transparent h-32"
          animate={{
            y: ["-100%", "100vh"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Pulsing Grid Overlay */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(74, 123, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(74, 123, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </motion.div>

        {/* Corner Tech Elements */}
        <div className="absolute top-4 left-4">
          <motion.div
            className="w-16 h-16 border-l-2 border-t-2 border-kobklein-neon-blue/30"
            animate={{
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />
        </div>

        <div className="absolute bottom-4 right-4">
          <motion.div
            className="w-16 h-16 border-r-2 border-b-2 border-kobklein-neon-purple/30"
            animate={{
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: 1.5,
            }}
          />
        </div>

        {/* Floating Data Nodes */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={`node-${i}`}
            className="absolute w-2 h-2 bg-kobklein-gold rounded-full shadow-lg shadow-kobklein-gold/50"
            style={{
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
            animate={{
              scale: [0.5, 1.5, 0.5],
              opacity: [0.4, 1, 0.4],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </div>
  );
}
