import { ReactNode } from 'react';

export async function generateMetadata() {
  return {
    title: 'Botnet - Authenticate',
    description: 'Log In or Sign Up',
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}