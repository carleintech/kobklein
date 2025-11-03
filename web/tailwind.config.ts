import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1400px",
    },
    extend: {
      colors: {
        // 💙 PROFESSIONAL KOBKLEIN FINTECH THEME - Blue Primary, Guava Accent

        // Core Brand Colors (Matching all pages)
        deepBlue: "#07122B",
        primaryBlue: "#0F2A6B",
        lightBlue: "#0B1736",
        accentBlue: "#29A9E0",

        // Professional KobKlein Color System
        kobklein: {
          primary: "#0F2A6B", // Professional deep blue (matching other pages)
          secondary: "#07122B", // Darker blue background
          accent: "#29A9E0", // Bright blue accent (existing from your system)
          background: "#07122B", // Professional dark blue

          // Professional Blue Palette
          blue: {
            50: "#F0F9FF",
            100: "#E0F2FE",
            200: "#BAE6FD",
            300: "#7DD3FC",
            400: "#38BDF8",
            500: "#0EA5E9", // Primary action blue
            600: "#0284C7",
            700: "#0369A1",
            800: "#075985",
            900: "#0C4A6E",
            primary: "#0F2A6B", // Main brand blue
            light: "#0B1736", // Light variant
            dark: "#07122B", // Dark variant
          },

          // Strategic Guava Accent (Limited usage)
          guava: {
            50: "#FFF5F5",
            100: "#FED7D7",
            200: "#FEB2B2",
            300: "#FC8181",
            400: "#F56565",
            500: "#E53E3E",
            600: "#C53030",
            700: "#9B2C2C",
            800: "#742A2A",
            900: "#4A1A1A",
            primary: "#FF6B6B", // CTA accent only
            secondary: "#FF8E8E",
            dark: "#E85555",
            light: "#FFB8B8",
          },

          // Professional Purple Accents
          purple: {
            primary: "#8B5CF6",
            secondary: "#A78BFA",
            dark: "#7C3AED",
          },
        },

        // Premium Accent Colors
        platinum: "#E5E4E2",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",

        // Professional Purple System (Supporting colors)
        purple: {
          50: "#FAF5FF",
          100: "#F3E8FF",
          200: "#E9D5FF",
          300: "#D8B4FE",
          400: "#C084FC",
          500: "#A855F7", // Professional purple
          600: "#9333EA",
          700: "#7C3AED", // Deep purple
          800: "#6D28D9",
          900: "#581C87",
          primary: "#8B5CF6", // Main purple accent
          secondary: "#A78BFA", // Light purple
        },

        // Professional Blue System (Primary brand colors)
        blue: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6", // Standard blue
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          primary: "#0F2A6B", // Brand blue (matching other pages)
          secondary: "#0B1736", // Light brand blue
          dark: "#07122B", // Dark brand blue
          accent: "#29A9E0", // Bright accent
        },

        // 🍊 UNIFIED GUAVA COLOR SYSTEM - Single definition
        guava: {
          50: "#FFF5F5",
          100: "#FED7D7",
          200: "#FEB2B2",
          300: "#FC8181",
          400: "#F56565",
          500: "#E53E3E", // Core guava
          600: "#C53030",
          700: "#9B2C2C",
          800: "#742A2A",
          900: "#4A1A1A",
          DEFAULT: "#FF6B6B",
          primary: "#FF6B6B", // Warm coral-pink
          secondary: "#FF8E8E", // Lighter guava
          dark: "#E85555", // Deeper guava
          light: "#FFB8B8", // Even lighter guava
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0F1E3D",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#29A9E0",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "4xl": "2rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Revolutionary KobKlein Animations
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "float-reverse": {
          "0%, 100%": { transform: "translateY(-10px)" },
          "50%": { transform: "translateY(0px)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 5px #FF6B6B" },
          "50%": { boxShadow: "0 0 20px #FF6B6B, 0 0 30px #FF6B6B" },
        },
        "glow-purple": {
          "0%, 100%": { boxShadow: "0 0 5px #9B4DFF" },
          "50%": { boxShadow: "0 0 25px #9B4DFF, 0 0 40px #9B4DFF" },
        },
        "glow-blue": {
          "0%, 100%": { boxShadow: "0 0 5px #00E0FF" },
          "50%": { boxShadow: "0 0 25px #00E0FF, 0 0 40px #00E0FF" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "scale-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",

        // Floating Animations
        float: "float 3s ease-in-out infinite",
        "float-slow": "float-slow 4s ease-in-out infinite",
        "float-reverse": "float-reverse 3.5s ease-in-out infinite",

        // Glow Effects
        glow: "glow 2s ease-in-out infinite alternate",
        "glow-purple": "glow-purple 2.5s ease-in-out infinite alternate",
        "glow-blue": "glow-blue 2.2s ease-in-out infinite alternate",

        // Pulse Variations
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-slow": "pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",

        // Modern Microinteractions
        shimmer: "shimmer 2s linear infinite",
        "gradient-shift": "gradient-shift 3s ease-in-out infinite",
        "scale-pulse": "scale-pulse 2s ease-in-out infinite",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",

        // Entrance Animations
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "slide-in-right": "slide-in-right 0.6s ease-out",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Sora", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",

        // 💙 PROFESSIONAL KOBKLEIN GRADIENTS - Blue Primary
        "kobklein-primary":
          "linear-gradient(135deg, #0F2A6B 0%, #29A9E0 50%, #0B1736 100%)",
        "kobklein-secondary":
          "linear-gradient(135deg, #07122B 0%, #0F2A6B 100%)",
        "kobklein-accent": "linear-gradient(135deg, #29A9E0 0%, #0F2A6B 100%)",

        // Professional Blue Gradients
        "blue-primary": "linear-gradient(135deg, #0F2A6B 0%, #0B1736 100%)",
        "blue-accent": "linear-gradient(135deg, #29A9E0 0%, #0EA5E9 100%)",
        "blue-deep": "linear-gradient(135deg, #07122B 0%, #0F2A6B 100%)",

        // Strategic Guava Accents (Limited usage)
        "guava-accent": "linear-gradient(135deg, #FF6B6B 0%, #F56565 100%)",
        "guava-cta": "linear-gradient(135deg, #FF6B6B 0%, #E85555 100%)",

        // Professional Purple Supporting Colors
        "purple-professional":
          "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
        "purple-accent": "linear-gradient(135deg, #A855F7 0%, #8B5CF6 100%)",

        // Premium Professional Gradients
        "fintech-primary":
          "linear-gradient(135deg, #0F2A6B 0%, #29A9E0 50%, #8B5CF6 100%)",
        "fintech-secondary":
          "linear-gradient(135deg, #07122B 0%, #0B1736 100%)",

        // Animated Professional Gradients
        "gradient-animated":
          "linear-gradient(-45deg, #0F2A6B, #29A9E0, #8B5CF6, #FF6B6B)",

        // Professional Mesh Gradients
        "mesh-1":
          "radial-gradient(at 40% 20%, #0F2A6B 0px, transparent 50%), radial-gradient(at 80% 0%, #8B5CF6 0px, transparent 50%), radial-gradient(at 0% 50%, #29A9E0 0px, transparent 50%)",
        "mesh-2":
          "radial-gradient(at 20% 80%, #29A9E0 0px, transparent 50%), radial-gradient(at 80% 20%, #0F2A6B 0px, transparent 50%), radial-gradient(at 40% 40%, #8B5CF6 0px, transparent 50%)",

        // Subtle Textures
        noise:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E\")",
      },

      // 💙 PROFESSIONAL KOBKLEIN SHADOW SYSTEM - Blue Primary
      boxShadow: {
        // Professional Blue Glow Effects (Primary)
        "blue-glow":
          "0 0 20px rgba(15, 42, 107, 0.6), 0 0 40px rgba(15, 42, 107, 0.3)",
        "blue-soft": "0 4px 20px rgba(15, 42, 107, 0.4)",
        "blue-hard": "0 8px 32px rgba(15, 42, 107, 0.5)",
        "blue-intense":
          "0 0 30px rgba(15, 42, 107, 0.8), 0 0 60px rgba(15, 42, 107, 0.4)",

        // Accent Blue Effects
        "accent-glow":
          "0 0 20px rgba(41, 169, 224, 0.5), 0 0 40px rgba(41, 169, 224, 0.2)",
        "accent-soft": "0 4px 20px rgba(41, 169, 224, 0.3)",
        "accent-hard": "0 8px 32px rgba(41, 169, 224, 0.4)",

        // Professional Purple Supporting Effects
        "purple-glow":
          "0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.2)",
        "purple-soft": "0 4px 20px rgba(139, 92, 246, 0.3)",
        "purple-hard": "0 8px 32px rgba(139, 92, 246, 0.4)",

        // Strategic Guava Accent Effects (Limited usage)
        "guava-glow":
          "0 0 20px rgba(255, 107, 107, 0.5), 0 0 40px rgba(255, 107, 107, 0.2)",
        "guava-soft": "0 4px 20px rgba(255, 107, 107, 0.3)",
        "guava-hard": "0 8px 32px rgba(255, 107, 107, 0.4)",

        // Glassmorphism Shadows
        glass:
          "0 8px 32px rgba(0, 0, 0, 0.3), 0 1px 0px rgba(255, 255, 255, 0.05) inset",
        "glass-lg":
          "0 20px 40px rgba(0, 0, 0, 0.4), 0 1px 0px rgba(255, 255, 255, 0.05) inset",

        // Professional Premium Shadows
        premium:
          "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(15, 42, 107, 0.2)",
        floating:
          "0 32px 64px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)",

        // Glassmorphism Professional Effects
        glass:
          "0 8px 32px rgba(0, 0, 0, 0.3), 0 1px 0px rgba(255, 255, 255, 0.05) inset",
        "glass-lg":
          "0 20px 40px rgba(0, 0, 0, 0.4), 0 1px 0px rgba(255, 255, 255, 0.05) inset",

        // Professional Interactive Hover States
        "hover-blue":
          "0 10px 30px rgba(15, 42, 107, 0.5), 0 0 20px rgba(15, 42, 107, 0.3)",
        "hover-accent":
          "0 10px 30px rgba(41, 169, 224, 0.4), 0 0 20px rgba(41, 169, 224, 0.2)",
        "hover-purple":
          "0 10px 30px rgba(139, 92, 246, 0.4), 0 0 20px rgba(139, 92, 246, 0.2)",
        "hover-guava":
          "0 10px 30px rgba(255, 107, 107, 0.4), 0 0 20px rgba(255, 107, 107, 0.2)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
