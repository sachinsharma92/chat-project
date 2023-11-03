import { ReactNode } from 'react';

export async function generateMetadata() {
  return {
    title: 'Botnet - Creator dashboard',
    description: 'Creator dashboard',
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
