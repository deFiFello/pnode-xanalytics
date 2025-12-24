import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pnode Xanalytics | Find the Best pNode for Your XAND',
  description: 'Analytics platform for Xandeum pNode network. Compare uptime, fees, pool sizes, and find your optimal share of rewards.',
  keywords: ['Xandeum', 'pNode', 'XAND', 'staking', 'delegation', 'analytics', 'Solana', 'storage'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
