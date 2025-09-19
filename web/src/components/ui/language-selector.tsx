"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { locales, localeLabels, type Locale } from "@/i18n";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  variant?: "default" | "compact" | "icon-only";
  className?: string;
}

export function LanguageSelector({ 
  variant = "default",
  className 
}: LanguageSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;
  const t = useTranslations('common');

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    // Replace the current locale in the pathname
    const segments = pathname.split('/');
    const isLocaleInPath = locales.includes(segments[1] as Locale);
    
    let newPathname;
    if (isLocaleInPath) {
      // Replace existing locale
      segments[1] = newLocale;
      newPathname = segments.join('/');
    } else {
      // Add locale to the beginning
      newPathname = `/${newLocale}${pathname}`;
    }

    router.push(newPathname);
  };

  const currentLanguage = localeLabels[currentLocale];

  // Compact version for mobile/small spaces
  if (variant === "compact" || variant === "icon-only") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className={cn(
              "flex items-center gap-1 text-sm font-medium",
              className
            )}
          >
            <Globe className="h-4 w-4" />
            {variant === "compact" && (
              <span className="uppercase text-xs tracking-wide">
                {currentLocale}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {locales.map((locale) => (
            <DropdownMenuItem
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className={cn(
                "flex items-center justify-between cursor-pointer",
                locale === currentLocale && "bg-kobklein-accent/10"
              )}
            >
              <span className="flex items-center gap-2">
                <span className="text-sm">{getFlagEmoji(locale)}</span>
                <span>{localeLabels[locale]}</span>
              </span>
              {locale === currentLocale && (
                <Check className="h-4 w-4 text-kobklein-accent" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default version for desktop/main navigation
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn(
            "flex items-center gap-2 text-sm font-medium hover:bg-kobklein-accent/10",
            className
          )}
        >
          <Globe className="h-4 w-4" />
          <span>{getFlagEmoji(currentLocale)}</span>
          <span className="hidden sm:inline">{currentLanguage}</span>
          <span className="sm:hidden uppercase text-xs">
            {currentLocale}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <div className="p-2 text-xs text-muted-foreground font-medium">
          Choose Language / Choisir la langue
        </div>
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className={cn(
              "flex items-center justify-between cursor-pointer p-3",
              locale === currentLocale && "bg-kobklein-accent/10"
            )}
          >
            <span className="flex items-center gap-3">
              <span className="text-lg">{getFlagEmoji(locale)}</span>
              <div className="flex flex-col">
                <span className="font-medium">{localeLabels[locale]}</span>
                <span className="text-xs text-muted-foreground uppercase">
                  {locale}
                </span>
              </div>
            </span>
            {locale === currentLocale && (
              <Check className="h-4 w-4 text-kobklein-accent" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Helper function to get flag emojis
function getFlagEmoji(locale: Locale): string {
  const flags = {
    en: "🇺🇸", // English - US flag
    fr: "🇫🇷", // French - France flag  
    ht: "🇭🇹", // Kreyòl - Haiti flag
    es: "🇪🇸", // Spanish - Spain flag
  };
  return flags[locale] || "🌐";
}