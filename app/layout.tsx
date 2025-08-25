import 'app/globals.css';
import { ReactNode } from 'react';
import Providers from 'components/Providers';
import { auth } from 'lib/auth';

export const metadata = {
  title: 'OG Image Generator',
  description: 'Generate beautifully branded Open Graph images for your content.',
  icons: {
    icon: '/favicon.ico'
  }
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  return (
    <html lang="en" className="h-full bg-white">
      <body className="min-h-full text-gray-900 antialiased">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}