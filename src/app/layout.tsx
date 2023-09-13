import './globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Providers from './providers';
import { Inter } from './fonts';

export const metadata: Metadata = {
  title: 'Botnet',
  description: 'The Botnet project',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={Inter.className}>
      <head>
        <meta name="theme-color" content="#f8f4e8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no, minimum-scale=1, maximum-scale=1, viewport-fit=cover"
        />
        <link rel="icon" href="/favicon.svg" />
        <script
          src="https://open.spotify.com/embed-podcast/iframe-api/v1"
          async
        ></script>
      </head>
      <body>
        <div id="root">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
