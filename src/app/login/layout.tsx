import { ReactNode } from 'react';

export async function generateMetadata() {
  return {
    title: 'Botnet - Log in',
    description: 'Log in to your account',
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}