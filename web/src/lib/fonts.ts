import { Inter, Sora } from 'next/font/google';

// Primary font for body text
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

// Display font for headings and brand elements
export const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

// Font combinations for different use cases
export const fontClasses = `${inter.variable} ${sora.variable}`;