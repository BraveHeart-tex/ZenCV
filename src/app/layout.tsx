import './globals.css';
import '@/styles/shepherd.css';
import '@/styles/tiptap.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { APP_NAME } from '@/lib/appConfig';
import 'shepherd.js/dist/css/shepherd.css';

const inter = Inter({
  weight: 'variable',
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
      <body className={`${inter.className} antialiased`}>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js" defer />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <ConfirmDialog />
        </ThemeProvider>
      </body>
    </html>
  );
}
