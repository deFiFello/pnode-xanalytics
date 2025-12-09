'use client';

import { Activity, Github, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-xand-border bg-xand-darker/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-xand-teal/20 blur-xl rounded-full group-hover:bg-xand-teal/30 transition-colors" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-xand-teal to-xand-blue">
                <Activity className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                <span className="text-xand-teal">pNode</span>
                <span className="text-xand-text"> Xanalytics</span>
              </h1>
              <p className="text-[10px] text-xand-text-muted uppercase tracking-widest">
                Xandeum Network
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/" active>Dashboard</NavLink>
            <NavLink href="/leaderboard">Leaderboard</NavLink>
            <NavLink href="/compare">Compare</NavLink>
            <NavLink href="/network">Network</NavLink>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Network status indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-xand-card border border-xand-border">
              <div className="pulse-dot" />
              <span className="text-xs text-xand-text-dim">DevNet</span>
            </div>

            {/* External links */}
            <a
              href="https://github.com/Xandeum"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-xand-text-dim hover:text-xand-text hover:bg-xand-card transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://xandeum.network"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-xand-text-dim hover:text-xand-text hover:bg-xand-card transition-colors"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ 
  href, 
  children, 
  active = false 
}: { 
  href: string; 
  children: React.ReactNode; 
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        active
          ? 'text-xand-teal bg-xand-teal/10'
          : 'text-xand-text-dim hover:text-xand-text hover:bg-xand-card'
      }`}
    >
      {children}
    </Link>
  );
}
