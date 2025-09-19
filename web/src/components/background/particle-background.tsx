"use client";

import type { Container, ISourceOptions } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useCallback, useEffect, useState } from "react";

interface ParticleBackgroundProps {
  className?: string;
  id?: string;
}

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

  // Production particle configuration
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
        value: ["#FFFFFF", "#00BFFF", "#FFD700", "#33CCFF", "#4169FF"], // White and bright colors for visibility
      },
      links: {
        color: "#FFFFFF", // White links for better visibility
        distance: 200, // Increased distance for more connections
        enable: true,
        opacity: 0.8, // Increased opacity for stronger lines
        width: 2, // Thicker lines
        triangles: {
          enable: true, // Enable triangle connections for more visual complexity
          opacity: 0.1,
        },
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
        value: 60, // Increased number of particles for more connections
      },
      opacity: {
        value: { min: 0.6, max: 1.0 }, // Higher minimum opacity
        animation: {
          enable: true,
          speed: 1,
          sync: false,
        },
      },
      shape: {
        type: ["circle", "triangle"],
      },
      size: {
        value: { min: 3, max: 8 }, // Larger particles for better visibility
        animation: {
          enable: true,
          speed: 2,
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
          quantity: 5, // More particles on click
        },
        repulse: {
          distance: 120,
          duration: 0.4,
        },
      },
    },
    detectRetina: true,
    fpsLimit: 60,
  };

  if (!init) {
    return <div className={`absolute inset-0 ${className}`} />;
  }

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      <Particles
        id={id}
        particlesLoaded={particlesLoaded}
        options={options}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 5,
        }}
      />
    </div>
  );
}
