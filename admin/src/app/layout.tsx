import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'WeilShop Admin — Панель администратора',
  description: 'Панель управления интернет-магазином автохимии WeilShop',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-[#F5F4EF]`}>{children}</body>
    </html>
  );
}
