import './globals.css';
import Providers from './providers';
import { Inter } from 'next/font/google';

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700']
});

export const metadata = {
  title: 'MusicGPT | Create Music',
  description: 'Prompt-to-music generation UI simulation.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={body.variable}>
      <body className="selection-glow">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
