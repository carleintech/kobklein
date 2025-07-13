// src/components/background/particle-config.ts

import type { ISourceOptions } from "@tsparticles/engine";

export const particleConfig: ISourceOptions = {
  fullScreen: {
    enable: false,
  },
  background: {
    color: {
      value: "transparent",
    },
  },
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        area: 800,
      },
    },
    color: {
      value: "#29A9E0",
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.6,
    },
    size: {
      value: { min: 1, max: 5 },
    },
    move: {
      enable: true,
      speed: 1.5,
      direction: "none",
      outModes: {
        default: "bounce",
      },
    },
  },
};

export const mobileParticleConfig: ISourceOptions = {
  ...particleConfig,
  particles: {
    ...particleConfig.particles,
    number: {
      value: 25,
      density: {
        enable: true,
        area: 600,
      },
    },
  },
};
