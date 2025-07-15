"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Container, Engine } from "tsparticles-engine";

interface EnhancedParticleBackgroundProps {
  className?: string;
}

export default function EnhancedParticleBackground({ 
  className = "" 
}: EnhancedParticleBackgroundProps) {
  const particlesInit = useCallback(async (engine: Engine) => {
    console.log("🎆 Initializing enhanced KobKlein particles...");
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log("✨ Enhanced KobKlein particles animation started!");
  }, []);

  return (
    <Particles
      id="kobklein-particles"
      className={`absolute inset-0 z-0 ${className}`}
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 2,
            },
            repulse: {
              distance: 100,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: ["#3B82F6", "#06B6D4", "#8B5CF6", "#F59E0B"],
          },
          links: {
            color: "#3B82F6",
            distance: 120,
            enable: true,
            opacity: 0.4,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 1000,
            },
            value: 80,
          },
          opacity: {
            value: 0.8,
            random: {
              enable: true,
              minimumValue: 0.4,
            },
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.2,
              sync: false,
            },
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 2, max: 6 },
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 1,
              sync: false,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
