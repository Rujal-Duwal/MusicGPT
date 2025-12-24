import './globals.css';
import Providers from './providers';
import { IBM_Plex_Sans, Space_Grotesk } from 'next/font/google';

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700']
});

const body = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600']
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
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="selection-glow">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
