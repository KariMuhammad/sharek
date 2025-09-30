'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import { locales, localeNames, type Locale } from '@/lib/i18n';

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (locale: Locale) => {
    const segments = pathname.split('/');
    segments[1] = locale;
    const newPath = segments.join('/');
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span>{localeNames[currentLocale]}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => switchLanguage(locale)}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                locale === currentLocale ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              {localeNames[locale]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}