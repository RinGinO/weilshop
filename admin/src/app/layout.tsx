// TODO: Root layout админки
// - Auth check
// - Sidebar navigation
// - Header с профилем администратора

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        {children}
      </body>
    </html>
  );
}
