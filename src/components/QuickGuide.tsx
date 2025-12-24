'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Coins, Server, Users } from 'lucide-react';

export function QuickGuide() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'basics' | 'stoinc' | 'choosing'>('basics');

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden">
      {/* Collapsed Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-800/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-violet-400" />
          <div className="text-left">
            <h3 className="font-medium text-zinc-100">New to pNode Staking?</h3>
            <p className="text-sm text-zinc-500">Learn how Xandeum staking works and how to earn rewards</p>
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
        <div className="border-t border-zinc-800/50">
          {/* Tabs */}
          <div className="flex border-b border-zinc-800/50">
            <button
              onClick={() => setActiveTab('basics')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'basics' 
                  ? 'text-violet-400 border-b-2 border-violet-400 bg-violet-500/5' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              The Basics
            </button>
            <button
              onClick={() => setActiveTab('stoinc')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'stoinc' 
                  ? 'text-violet-400 border-b-2 border-violet-400 bg-violet-500/5' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              STOINC Rewards
            </button>
            <button
              onClick={() => setActiveTab('choosing')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'choosing' 
                  ? 'text-violet-400 border-b-2 border-violet-400 bg-violet-500/5' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Choosing a pNode
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'basics' && (
              <div className="space-y-5">
                <div>
                  <h4 className="text-lg font-semibold text-zinc-100 mb-3">What is Xandeum?</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Xandeum is a decentralized storage layer built on Solana. It allows applications to store 
                    large amounts of data affordably and securely, without relying on centralized servers 
                    like AWS or Google Cloud.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
                    <Server className="h-5 w-5 text-cyan-400 mb-2" />
                    <h5 className="font-medium text-zinc-200 mb-1">pNodes</h5>
                    <p className="text-xs text-zinc-500">
                      Physical storage servers run by operators around the world. They store data and earn rewards.
                    </p>
                  </div>
                  <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
                    <Coins className="h-5 w-5 text-amber-400 mb-2" />
                    <h5 className="font-medium text-zinc-200 mb-1">XAND Token</h5>
                    <p className="text-xs text-zinc-500">
                      The native token of Xandeum. You delegate XAND to pNodes to help secure the network and earn rewards.
                    </p>
                  </div>
                  <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
                    <Users className="h-5 w-5 text-violet-400 mb-2" />
                    <h5 className="font-medium text-zinc-200 mb-1">Delegators</h5>
                    <p className="text-xs text-zinc-500">
                      XAND holders who stake their tokens with pNodes. You don't need hardware—just choose a pNode.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                  <p className="text-sm text-zinc-300">
                    <span className="font-semibold text-violet-300">How it works:</span> You delegate your XAND to a pNode. 
                    The pNode stores data for the network and earns STOINC rewards. You receive a share of those rewards 
                    based on how much you staked.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'stoinc' && (
              <div className="space-y-5">
                <div>
                  <h4 className="text-lg font-semibold text-zinc-100 mb-3">What is STOINC?</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    <span className="text-emerald-400 font-medium">STOINC (Storage Income)</span> is the reward token 
                    earned by pNodes for providing storage to the Xandeum network. When you delegate XAND to a pNode, 
                    you receive a share of the STOINC that pNode earns.
                  </p>
                </div>

                <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
                  <h5 className="font-medium text-zinc-200 mb-3">How STOINC is distributed:</h5>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center">1</span>
                      <p className="text-sm text-zinc-400">pNode earns STOINC by storing data and passing network challenges</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center">2</span>
                      <p className="text-sm text-zinc-400">Operator takes their fee (typically 2-8%)</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center">3</span>
                      <p className="text-sm text-zinc-400">Remaining STOINC is split among all delegators based on stake %</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <p className="text-sm text-zinc-300">
                    <span className="font-semibold text-amber-300">Important:</span> STOINC rewards are not fixed. 
                    They depend on network storage demand—more storage usage means more STOINC earned. This is different 
                    from traditional staking with fixed APY.
                  </p>
                </div>

                <div>
                  <h5 className="font-medium text-zinc-200 mb-2">Claiming Rewards</h5>
                  <p className="text-sm text-zinc-400">
                    STOINC rewards accumulate automatically. You can claim them through the Xandeum staking portal 
                    at <a href="https://stakexand.xandeum.network" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300">stakexand.xandeum.network</a>.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'choosing' && (
              <div className="space-y-5">
                <div>
                  <h4 className="text-lg font-semibold text-zinc-100 mb-3">How to Choose a pNode</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Your rewards depend on three main factors. Understanding these will help you make the best choice.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-emerald-400">Uptime (Reliability)</h5>
                      <span className="text-xs text-zinc-500">Most important</span>
                    </div>
                    <p className="text-sm text-zinc-400 mb-2">
                      A pNode that's offline earns nothing. Look for nodes with <span className="text-emerald-400">99%+ uptime</span>.
                    </p>
                    <p className="text-xs text-zinc-500">
                      Shown as a percentage in the Uptime column. Green = excellent, amber = acceptable, red = avoid.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-amber-400">Fee (Operator Cut)</h5>
                      <span className="text-xs text-zinc-500">Lower is better</span>
                    </div>
                    <p className="text-sm text-zinc-400 mb-2">
                      The operator takes this percentage before distributing rewards. Typical range is <span className="text-amber-400">2-8%</span>.
                    </p>
                    <p className="text-xs text-zinc-500">
                      A 5% fee means if the pNode earns 100 STOINC, 95 goes to delegators.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-800/30 rounded-xl border border-violet-500/30">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-violet-400">Pool Size (Your Share)</h5>
                      <span className="text-xs text-violet-400">Often overlooked</span>
                    </div>
                    <p className="text-sm text-zinc-400 mb-2">
                      Your rewards = <span className="text-violet-400">(Your Stake ÷ Total Pool)</span> × STOINC earned.
                    </p>
                    <p className="text-xs text-zinc-500">
                      10,000 XAND in a 50K pool = 20% share. Same 10,000 in a 200K pool = only 5%. 
                      Smaller pools mean bigger share of rewards.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-700/30">
                  <h5 className="font-medium text-zinc-200 mb-2">Quick Decision Guide</h5>
                  <ol className="space-y-2 text-sm text-zinc-400">
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400 font-mono">1.</span>
                      Filter for 99%+ uptime (non-negotiable)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400 font-mono">2.</span>
                      Look at "Your Share" column—bigger percentage = more rewards
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400 font-mono">3.</span>
                      Among similar share options, pick the lowest fee
                    </li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
