import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/hooks/useToast';
import { CartProvider } from '@/hooks/useCart';
import { AuthModalProvider } from '@/hooks/useAuthModal';
import { ProductModalProvider } from '@/hooks/useProductModal';
import Toast from '@/components/Toast';
import CartDrawer from '@/components/CartDrawer';
import AuthModal from '@/components/AuthModal';
import ProductModal from '@/components/ProductModal';
import Analytics from '@/components/Analytics';
import { SITE_URL, SITE_NAME, DEFAULT_TITLE, DEFAULT_DESCRIPTION, KEYWORDS, restaurantJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ['/og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    yandex: 'YANDEX_VERIFICATION_TOKEN',
    google: 'GOOGLE_VERIFICATION_TOKEN',
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: '/apple-touch-icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen flex flex-col antialiased selection:bg-accent selection:text-white">
        <Script
          id="ld-restaurant"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()) }}
        />
        <Analytics />
        <ToastProvider>
          <CartProvider>
            <AuthModalProvider>
              <ProductModalProvider>
                <Header />
                <main className="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
                  {children}
                </main>
                <Footer />
                <Toast />
                <CartDrawer />
                <AuthModal />
                <ProductModal />
              </ProductModalProvider>
            </AuthModalProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
