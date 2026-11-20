import type { Metadata, Viewport } from 'next';
import { Noto_Sans_Devanagari } from 'next/font/google';
import { headers } from 'next/headers';
import './globals.css';

export const dynamic = 'force-dynamic';

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans-devanagari',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'QCLEAR • Bilingual GenAI Urban Smog & Air Quality Companion',
  description:
    'Empowering families and communities to navigate severe winter smog and urban air pollution with tailored routines, indoor air hacks, and sustainable swaps.',
  icons: {
    icon: '/icon.svg',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Reading headers() triggers dynamic per-request rendering and informs Next.js
  // to attach the CSP nonce from middleware to hydration script tags.
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') || undefined;

  return (
    <html lang="en" className={notoDevanagari.variable} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
