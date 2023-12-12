import { ReactNode } from 'react';

export async function generateMetadata() {
  return {
    title: 'Botnet - Creator settings',
    description: 'Creator settings',
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
