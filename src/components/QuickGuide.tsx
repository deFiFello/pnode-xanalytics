'use client';

import React from 'react';
import { Zap, PieChart, TrendingUp } from 'lucide-react';

export function QuickGuide() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {/* What is STOINC */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-emerald-500/10">
            <Zap className="h-4 w-4 text-emerald-400" />
          </div>
          <h3 className="font-semibold text-zinc-100">What is STOINC?</h3>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">
          <span className="text-emerald-400 font-medium">Storage Income</span> paid in SOL. 
          When dApps use Xandeum storage, they pay fees. 94% of those fees go to pNode 
          operators and their stakers.
        </p>
        <p className="text-xs text-zinc-500 mt-3 pt-3 border-t border-zinc-800/50">
          Not inflationary rewards—real revenue from real usage.
        </p>
      </div>

      {/* Why Pool Size Matters */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-violet-500/10">
            <PieChart className="h-4 w-4 text-violet-400" />
          </div>
          <h3 className="font-semibold text-zinc-100">Why Pool Size Matters</h3>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Your rewards = <span className="text-violet-400">your share of the pool</span>. 
          10K XAND in a 50K pool = 20% share. Same 10K in a 200K pool = only 5%.
        </p>
        <p className="text-xs text-zinc-500 mt-3 pt-3 border-t border-zinc-800/50">
          Smaller pools = bigger share = more STOINC per XAND staked.
        </p>
      </div>

      {/* Early Advantage */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-amber-500/10">
            <TrendingUp className="h-4 w-4 text-amber-400" />
          </div>
          <h3 className="font-semibold text-zinc-100">Early Staker Advantage</h3>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">
          As Xandeum grows, more dApps pay storage fees. Early stakers in quality pools 
          benefit most—<span className="text-amber-400">your share compounds</span> as 
          network revenue increases.
        </p>
        <p className="text-xs text-zinc-500 mt-3 pt-3 border-t border-zinc-800/50">
          Find high-uptime pools before they get crowded.
        </p>
      </div>
    </div>
  );
}
