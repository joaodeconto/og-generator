import 'app/globals.css';
import { ReactNode } from 'react';
import Providers from 'components/Providers';
import { getServerSession } from 'next-auth';
import { authOptions } from 'lib/authOptions';

export const metadata = {
  title: 'OG Image Generator',
  description: 'Generate beautifully branded Open Graph images for your content.',
  icons: {
    icon: '/favicon.ico'
  }
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Get the user's session on the server so it can be passed into SessionProvider
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" className="h-full bg-white">
      <body className="min-h-full text-gray-900 antialiased">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}