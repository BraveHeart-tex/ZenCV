import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import ConfirmDialog from '@/components/ConfirmDialog';
import { APP_NAME } from '@/lib/appConfig';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: `${APP_NAME}`,
  description: `${APP_NAME} makes building your CV effortless and stress-free. Design a professional CV in minutes with our intuitive visual editor. Export as PDF with unlimited downloads. Your data stays 100% private and never leaves your device. Job hunting is tough enough. Why pay for tools you only use when you're looking for work?`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ConfirmDialog />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
