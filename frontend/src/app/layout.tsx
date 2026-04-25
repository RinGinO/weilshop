import './globals.css';
import Link from 'next/link';
import { Pacifico } from 'next/font/google';
import { Providers } from './providers';

const logoFont = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'WeilShop — Автохимия с подбором по задачам ухода',
  description: 'Профессиональная автохимия. Подбор средств по задачам ухода. Только проверенные бренды.',
};

function Header() {
  return (
    <header className="bg-white border-b border-[#D9DCDD] sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className={`text-3xl font-bold text-[#000000] ${logoFont.className}`}>
            WeilShop
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/catalog" className="text-[#1F2328] hover:text-[#000000] transition-colors">
              Каталог
            </Link>
            <Link href="/tasks" className="text-[#1F2328] hover:text-[#000000] transition-colors">
              Задачи ухода
            </Link>
            <Link href="/knowledge" className="text-[#1F2328] hover:text-[#000000] transition-colors">
              База знаний
            </Link>
            <Link href="/consultations" className="text-[#1F2328] hover:text-[#000000] transition-colors">
              Консультации
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="text-[#1F2328] hover:text-[#000000] transition-colors">
              🛒 Корзина
            </Link>
            <Link href="/account" className="text-[#1F2328] hover:text-[#000000] transition-colors">
              👤 Войти
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-[#1F2328] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className={`text-3xl font-bold mb-4 ${logoFont.className}`}>WeilShop</div>
            <p className="text-white/70">
              Профессиональная автохимия с подбором по задачам ухода
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Каталог</h4>
            <ul className="space-y-2 text-white/70">
              <li><Link href="/catalog" className="hover:text-white transition-colors">Все товары</Link></li>
              <li><Link href="/tasks" className="hover:text-white transition-colors">Задачи ухода</Link></li>
              <li><Link href="/knowledge" className="hover:text-white transition-colors">База знаний</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Помощь</h4>
            <ul className="space-y-2 text-white/70">
              <li><Link href="/consultations" className="hover:text-white transition-colors">Консультации</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contacts" className="hover:text-white transition-colors">Контакты</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <ul className="space-y-2 text-white/70">
              <li>info@weilshop.ru</li>
              <li>+7 (999) 000-00-00</li>
              <li>Москва, Россия</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/50">
          © 2025 WeilShop. Все права защищены.
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
  <body className="min-h-screen flex flex-col">
    <Providers>
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </Providers>
  </body>
    </html>
  );
}
