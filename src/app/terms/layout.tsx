import { ReactNode } from 'react';

export async function generateMetadata() {
  return {
    title: 'Botnet - Terms of Service',
    description: 'Terms of Service',
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
