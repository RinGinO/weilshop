// TODO: Root layout
// - Providers (QueryClient, Zustand)
// - Header
// - Footer
// - Mobile navigation

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
