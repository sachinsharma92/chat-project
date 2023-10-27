import { ReactNode } from 'react';

export async function generateMetadata() {
  return {
    title: 'Botnet - Sign Up',
    description: 'Create an account',
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}