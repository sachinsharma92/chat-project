import './globals.css';

import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { atlasGrotesk } from './fonts';

import Script from 'next/script';
import ProvidersContainer from './providersContainer';

export const metadata: Metadata = {
  title: 'Botnet',
  description: 'The Botnet project',
};

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <html lang="en" className={`${atlasGrotesk.className}`}>
      <head>
        <Script src="/google-tag-manager.js" />

        <meta name="theme-color" content="#f8f4e8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no, minimum-scale=1, maximum-scale=1, viewport-fit=cover"
        />
        <link rel="icon" href="/favicon.svg" />

        <Script src="/twitter-pixel.js" strategy="lazyOnload" />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WRLF43JJ"
            height="0"
            width="0"
            className="invisible h-0 w-0"
          ></iframe>
        </noscript>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-KDQQYC94GB" />
        <Script src="/gtag.js" />
        <div id="root">
          <ProvidersContainer>
            {children}
            <Toaster />
          </ProvidersContainer>
        </div>
      </body>
    </html>
  );
}
