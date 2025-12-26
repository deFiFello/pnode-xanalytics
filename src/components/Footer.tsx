'use client';

import { ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-purple-500/10 py-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xs text-zinc-600">
          <span>Pnode Xanalytics</span>
          <span className="mx-2">•</span>
          <span>Built for Xandeum pNode Analytics Bounty</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/deFiFello/pnode-xanalytics"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
          >
            GitHub <ExternalLink className="h-3 w-3" />
          </a>
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
