'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HardDrive, Coins, Zap, ExternalLink } from 'lucide-react';

export function StakingInfo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden">
      {/* Toggle Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">📚</span>
          <span className="font-medium text-zinc-200">Learn: pNodes, STOINC & XAND</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-zinc-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-zinc-500" />
        )}
      </button>

      {/* Expandable Content */}
      {isOpen && (
        <div className="px-6 pb-6 space-y-6">
          {/* Three Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* What is a pNode? */}
            <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-violet-500/20 rounded-lg">
                  <HardDrive className="h-5 w-5 text-violet-400" />
                </div>
                <h3 className="font-semibold text-zinc-100">What is a pNode?</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                A <strong className="text-zinc-200">pNode</strong> (storage node) is a server that provides decentralized storage for the Xandeum network. pNodes store encrypted data chunks and earn rewards for their service.
              </p>
              <div className="mt-4 pt-3 border-t border-zinc-700/30">
                <p className="text-xs text-zinc-500">
                  Think of it like Filecoin or Arweave, but built specifically for Solana smart contracts.
                </p>
              </div>
            </div>

            {/* What is STOINC? */}
            <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Coins className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-zinc-100">What is STOINC?</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                <strong className="text-zinc-200">STOINC</strong> (Storage Income) is the reward paid to pNode operators and their delegators. It's paid in SOL based on storage work performed.
              </p>
              <div className="mt-4 pt-3 border-t border-zinc-700/30">
                <p className="text-xs text-zinc-500">
                  Distribution: 94% to operators & delegators, 3% to DAO, 3% to investors.
                </p>
              </div>
            </div>

            {/* What is XAND? */}
            <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <Zap className="h-5 w-5 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-zinc-100">What is XAND?</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                <strong className="text-zinc-200">XAND</strong> is the native token of the Xandeum network. Staking XAND to pNodes increases their reward share and earns you a portion of STOINC.
              </p>
              <div className="mt-4 pt-3 border-t border-zinc-700/30">
                <p className="text-xs text-zinc-500">
                  More stake = higher storageCredits = bigger share of rewards.
                </p>
              </div>
            </div>
          </div>

          {/* Understanding Credits */}
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-5">
            <h4 className="font-semibold text-cyan-400 mb-2">Understanding Credits</h4>
            <p className="text-sm text-zinc-300 leading-relaxed">
              <strong>Credits</strong> measure storage work completed by each pNode. Higher credits = more active node = more rewards earned. This is the primary metric from the network API.
            </p>
            <div className="mt-3 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-cyan-400">Activity</p>
                <p className="text-xs text-zinc-500">How much work done</p>
              </div>
              <div>
                <p className="text-lg font-bold text-cyan-400">Reliability</p>
                <p className="text-xs text-zinc-500">Consistent performance</p>
              </div>
              <div>
                <p className="text-lg font-bold text-cyan-400">Rewards</p>
                <p className="text-xs text-zinc-500">Higher credits = more SOL</p>
              </div>
            </div>
          </div>

          {/* How to Participate */}
          <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-5">
            <h4 className="font-semibold text-zinc-100 mb-3">How to Participate</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-violet-400 mb-1">As a Delegator (Staker)</p>
                <p className="text-sm text-zinc-400">
                  Stake XAND to high-performing pNodes via the Xandeum Foundation Delegation Program. Join Discord to coordinate delegation.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-400 mb-1">As an Operator</p>
                <p className="text-sm text-zinc-400">
                  Run your own pNode server to provide storage and earn STOINC directly. See pnodes.xandeum.network for setup guide.
                </p>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.xandeum.network/xand-tokenomics"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 rounded-lg text-sm text-zinc-300 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              XAND Tokenomics
            </a>
            <a
              href="https://pnodes.xandeum.network"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 rounded-lg text-sm text-zinc-300 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              pNode Setup Guide
            </a>
            <a
              href="https://docs.xandeum.network"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 rounded-lg text-sm text-zinc-300 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Technical Docs
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
