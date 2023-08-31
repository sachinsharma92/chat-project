import './globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';

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
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
