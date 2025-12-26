'use client';

import { ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-purple-500/10 py-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-zinc-600">
          Pnode Xanalytics • Real-time data from pRPC
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://www.xandeum.network"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
          >
            Xandeum <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://docs.xandeum.network"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
          >
            Docs <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://discord.gg/xandeum"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
          >
            Discord <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://explorer.xandeum.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
          >
            Explorer <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
