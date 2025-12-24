'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, AlertTriangle } from 'lucide-react';

export function QuickGuide() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden">
      {/* Collapsed Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-800/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <HelpCircle className="h-5 w-5 text-violet-400" />
          <div className="text-left">
            <h3 className="font-medium text-zinc-100">How pNode rewards work</h3>
            <p className="text-sm text-zinc-500">The key insight most stakers miss</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-zinc-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-zinc-500" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-zinc-800/50 pt-5">
          {/* The Key Formula */}
          <div className="bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20 rounded-xl p-5 mb-5">
            <h4 className="text-sm font-semibold text-violet-300 mb-3">Your rewards depend on your SHARE of the pool:</h4>
            <div className="bg-zinc-900/50 rounded-lg p-4 font-mono text-center">
              <p className="text-zinc-400 text-sm">Your Rewards = </p>
              <p className="text-xl text-zinc-100 my-2">
                <span className="text-violet-400">(Your Stake ÷ Total Pool)</span> × STOINC Earned
              </p>
              <p className="text-zinc-500 text-xs mt-2">Then subtract the operator's fee</p>
            </div>
          </div>

          {/* What this means */}
          <div className="space-y-4 mb-5">
            <h4 className="text-sm font-medium text-zinc-300">What this means:</h4>
            
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 bg-zinc-800/30 rounded-lg">
                <span className="text-emerald-400 text-lg">→</span>
                <div>
                  <p className="text-sm text-zinc-200">Smaller pools = bigger share</p>
                  <p className="text-xs text-zinc-500">10K in a 50K pool = 20% share. Same 10K in a 200K pool = only 5%.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-zinc-800/30 rounded-lg">
                <span className="text-emerald-400 text-lg">→</span>
                <div>
                  <p className="text-sm text-zinc-200">Low fee matters, but pool size can matter MORE</p>
                  <p className="text-xs text-zinc-500">A 5% fee node with small pool often beats a 2% fee node with huge pool.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-zinc-800/30 rounded-lg">
                <span className="text-emerald-400 text-lg">→</span>
                <div>
                  <p className="text-sm text-zinc-200">Uptime is non-negotiable</p>
                  <p className="text-xs text-zinc-500">A node that's offline earns nothing. Look for 99%+ uptime.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-200">No Fixed APY</p>
              <p className="text-xs text-zinc-400 mt-1">
                Unlike traditional staking, pNode rewards vary based on network storage demand. 
                More storage usage = more STOINC earned = better returns for everyone.
              </p>
            </div>
          </div>

          {/* Quick Decision */}
          <div className="mt-5 pt-5 border-t border-zinc-800/50">
            <h4 className="text-sm font-medium text-zinc-300 mb-3">Quick decision guide:</h4>
            <ol className="text-sm text-zinc-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-violet-400 font-mono">1.</span>
                <span>Filter for <span className="text-emerald-400">99%+ uptime</span> (reliability)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400 font-mono">2.</span>
                <span>Look at the <span className="text-violet-400">"Your Share"</span> column (bigger = better)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400 font-mono">3.</span>
                <span>Compare 2-3 options with similar shares, pick the lowest fee</span>
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
