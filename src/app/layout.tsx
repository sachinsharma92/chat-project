import './globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Camp',
  description: 'The camp project',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
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
