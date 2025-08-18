import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/store/Provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'FitGirl Repacks - Repacked Games',
  description: 'Browse and search through a collection of repacked games with advanced filtering and search capabilities.',
  keywords: ['games', 'repacks', 'gaming', 'download', 'fitgirl', 'repacked'],
  authors: [{ name: 'FitGirl Repacks' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#06B6D4',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' }
    ]
  },
  openGraph: {
    title: 'FitGirl Repacks - Repacked Games',
    description: 'Browse and search through a collection of repacked games with advanced filtering and search capabilities.',
    type: 'website',
    images: ['/screenshot1.png']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FitGirl Repacks - Repacked Games',
    description: 'Browse and search through a collection of repacked games with advanced filtering and search capabilities.',
    images: ['/screenshot1.png']
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`}>
      <head>
        {/* Microsoft Clarity Analytics */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "py2etcr18e");
            `
          }}
        />
      </head>
      <body className={`${inter.className} bg-gaming-bg text-white antialiased`}>
        <StoreProvider>
          <div className="gaming-bg min-h-screen">
            {children}
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
