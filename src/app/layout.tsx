import type { Metadata } from "next";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "pNode Xanalytics | Xandeum Network Analytics",
  description: "Community analytics platform for the Xandeum pNode network. Compare pNode performance, uptime, and storage metrics to make informed delegation decisions.",
  keywords: ["Xandeum", "pNode", "analytics", "Solana", "staking", "delegation", "blockchain"],
  openGraph: {
    title: "pNode Xanalytics",
    description: "Analytics dashboard for Xandeum pNode network",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-xand-border py-6 text-center text-sm text-xand-text-muted">
            <p>Built for the Xandeum community • Data from DevNet</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
