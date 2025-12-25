'use client';

import React from 'react';
import { Clock, Shield, TrendingUp, HelpCircle, Coins, Server, Zap } from 'lucide-react';

export function StakingInfo() {
  return (
    <div className="space-y-4">
      {/* Quick Facts - The must-knows */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5">
        <h3 className="text-base font-semibold text-zinc-100 mb-4">Before You Stake</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-zinc-800/30 rounded-lg">
            <Clock className="h-5 w-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-zinc-200">No Lockup</p>
            <p className="text-xs text-zinc-500">Withdraw anytime</p>
          </div>
          <div className="text-center p-3 bg-zinc-800/30 rounded-lg">
            <Coins className="h-5 w-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-zinc-200">No Minimum</p>
            <p className="text-xs text-zinc-500">Stake any amount</p>
          </div>
          <div className="text-center p-3 bg-zinc-800/30 rounded-lg">
            <Shield className="h-5 w-5 text-amber-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-zinc-200">Your XAND is Safe</p>
            <p className="text-xs text-zinc-500">No slashing risk</p>
          </div>
          <div className="text-center p-3 bg-zinc-800/30 rounded-lg">
            <TrendingUp className="h-5 w-5 text-violet-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-zinc-200">Manual Claim</p>
            <p className="text-xs text-zinc-500">Rewards don't auto-compound</p>
          </div>
        </div>
      </div>

      {/* Key Concepts */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* What is a pNode */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Server className="h-5 w-5 text-cyan-400" />
            <h4 className="font-semibold text-zinc-100">What is a pNode?</h4>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Physical storage servers run by operators worldwide. They store data for Solana dApps 
            and earn <span className="text-zinc-200">STOINC rewards</span> for their service.
          </p>
          <p className="text-xs text-zinc-500 mt-3 pt-3 border-t border-zinc-800/50">
            You don't run a pNode—you stake XAND with one and share its rewards.
          </p>
        </div>

        {/* What is STOINC */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-5 w-5 text-emerald-400" />
            <h4 className="font-semibold text-zinc-100">What is STOINC?</h4>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-emerald-400 font-medium">Storage Income</span>—rewards paid in 
            <span className="text-emerald-400"> SOL</span>. When dApps use Xandeum storage, they pay fees. 
            <span className="text-zinc-200"> 94% goes to pNodes and their stakers.</span>
          </p>
          <p className="text-xs text-zinc-500 mt-3 pt-3 border-t border-zinc-800/50">
            Real revenue from real usage—not inflationary token rewards.
          </p>
        </div>

        {/* Where does yield come from */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="h-5 w-5 text-amber-400" />
            <h4 className="font-semibold text-zinc-100">Where Does Yield Come From?</h4>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Solana dApps pay <span className="text-zinc-200">storage fees in SOL</span> to use Xandeum's 
            decentralized storage. These fees are distributed to pNode operators and stakers every epoch (~2 days).
          </p>
          <p className="text-xs text-zinc-500 mt-3 pt-3 border-t border-zinc-800/50">
            More dApps using storage = more rewards for everyone.
          </p>
        </div>
      </div>

      {/* APY & Risks */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Variable APY */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5">
          <h4 className="font-semibold text-zinc-100 mb-3">What's the APY?</h4>
          <p className="text-sm text-zinc-400 leading-relaxed mb-3">
            <span className="text-amber-400 font-medium">Variable</span>—there's no fixed APY. 
            Rewards depend on:
          </p>
          <ul className="text-sm text-zinc-400 space-y-1">
            <li>• Network storage demand (more usage = more fees)</li>
            <li>• Your share of the pool (smaller pool = bigger share)</li>
            <li>• The pNode's performance and uptime</li>
          </ul>
          <p className="text-xs text-zinc-500 mt-3 pt-3 border-t border-zinc-800/50">
            As Xandeum adoption grows, so does earning potential.
          </p>
        </div>

        {/* Risks */}
        <div className="bg-zinc-900/50 border border-amber-500/20 rounded-xl p-5">
          <h4 className="font-semibold text-zinc-100 mb-3">What Are the Risks?</h4>
          <p className="text-sm text-zinc-400 leading-relaxed mb-3">
            Your staked XAND is <span className="text-emerald-400">not at risk</span>—there's no slashing. However:
          </p>
          <ul className="text-sm text-zinc-400 space-y-1">
            <li>• <span className="text-zinc-300">Rewards vary</span>—low network usage = low rewards</li>
            <li>• <span className="text-zinc-300">Network is new</span>—DevNet is live, Mainnet coming 2025</li>
            <li>• <span className="text-zinc-300">XAND price can change</span>—market risk applies</li>
          </ul>
          <p className="text-xs text-amber-400/80 mt-3 pt-3 border-t border-amber-500/20">
            Only stake what you can afford to leave for a while.
          </p>
        </div>
      </div>
    </div>
  );
}
