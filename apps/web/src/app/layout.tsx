import {AuthProvider} from '@/lib/auth-context';
import './globals.css';
import React from 'react';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}