import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { locales, isRTL } from '@/lib/i18n';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

async function getMessages(locale: string) {
  try {
    return (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale }
}: RootLayoutProps) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages(locale);
  const direction = isRTL(locale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}