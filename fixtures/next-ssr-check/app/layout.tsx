import type { ReactNode } from 'react';

export const metadata = { title: 'Next.js + Lit custom elements — CTORNDSD-646b' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: '"Fira Sans", sans-serif', padding: 24, maxWidth: 820 }}>{children}</body>
    </html>
  );
}
