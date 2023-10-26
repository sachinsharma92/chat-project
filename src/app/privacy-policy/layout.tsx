import { ReactNode } from 'react';

export async function generateMetadata() {
  return {
    title: 'Botnet - Privacy Policy',
    description: 'Privacy Policy',
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}