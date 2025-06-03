import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { AppProvider } from '../contexts/AppContext';
import { Toaster } from '../components/ui/toaster';


export const metadata: Metadata = {
  title: 'A Kalender - Görev Yöneticisi',
  description: 'A Kalender ile görevlerinizi kolayca yönetin.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${GeistSans.variable} font-sans antialiased`}>
        <AppProvider>
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}