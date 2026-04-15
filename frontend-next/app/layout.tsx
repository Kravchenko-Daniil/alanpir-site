import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
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

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'АланПир — Осетинские пироги',
  description: 'Доставка горячих осетинских пирогов по Москве от 20 минут',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col antialiased selection:bg-terracotta selection:text-white">
        <ToastProvider>
          <CartProvider>
            <AuthModalProvider>
              <ProductModalProvider>
                <Header />
                <main className="flex-1 w-full max-w-[940px] mx-auto px-4 sm:px-6 lg:px-8">
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
