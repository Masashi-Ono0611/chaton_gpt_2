// app/layout.tsx
import { ReactNode } from 'react';

export const metadata = {
  title: 'Chat Application',
  description: 'A simple chat app with Firebase and ChatGPT',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" /> 
      </head>
      <body>{children}</body>
    </html>
  );
}
