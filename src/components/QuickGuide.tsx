'use client';

import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  Coins,
  BarChart3,
  Target,
  TrendingUp,
  Clock,
  Percent,
  Zap,
  Wallet,
  Users,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export function QuickGuide() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'basics' | 'metrics' | 'strategy'>('basics');

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Collapsed Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
            <HelpCircle className="h-5 w-5 text-violet-400" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-zinc-100">New to pNode Staking?</h3>
            <p className="text-sm text-zinc-500">Learn how to pick the best pNode for your XAND</p>
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
        <div className="border-t border-zinc-800">
          {/* Tabs */}
          <div className="flex border-b border-zinc-800">
            {[
              { id: 'basics' as const, label: 'How It Works', icon: Coins },
              { id: 'metrics' as const, label: 'Key Metrics', icon: BarChart3 },
              { id: 'strategy' as const, label: 'Pick Strategy', icon: Target },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-violet-400 border-b-2 border-violet-400 bg-violet-500/5'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-5">
            {activeTab === 'basics' && (
              <div className="space-y-5">
                {/* STOINC Explanation */}
                <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                  <h4 className="font-semibold text-zinc-100 mb-3 flex items-center gap-2">
                    <Coins className="h-4 w-4 text-emerald-400" />
                    What is STOINC?
                  </h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    <span className="text-emerald-400 font-medium">STOINC (Storage Income)</span> is how pNodes earn rewards.
                    When the network stores data, pNodes get paid based on their <span className="text-zinc-200">activity and reliability</span>—not 
                    based on how much stake they hold.
                  </p>
                </div>

                {/* How Delegation Works - Visual Flow */}
                <div>
                  <h4 className="font-semibold text-zinc-100 mb-4">How Your Rewards Flow</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-violet-400">1</span>
                      </div>
                      <div>
                        <p className="text-sm text-zinc-200">pNode earns STOINC from network storage activity</p>
                        <p className="text-xs text-zinc-500 mt-0.5">Based on uptime, challenges passed, and credits earned</p>
                      </div>
                    </div>
                    <div className="ml-3.5 h-4 border-l border-dashed border-zinc-700" />
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-violet-400">2</span>
                      </div>
                      <div>
                        <p className="text-sm text-zinc-200">Operator takes their fee (2-10%)</p>
                        <p className="text-xs text-zinc-500 mt-0.5">Their cut for running the node infrastructure</p>
                      </div>
                    </div>
                    <div className="ml-3.5 h-4 border-l border-dashed border-zinc-700" />
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-emerald-400">3</span>
                      </div>
                      <div>
                        <p className="text-sm text-zinc-200">Remaining rewards split among all delegators</p>
                        <p className="text-xs text-zinc-500 mt-0.5">Your share depends on % of pool you represent</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Insight Box */}
                <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-200">No Fixed APY</p>
                      <p className="text-xs text-zinc-400 mt-1">
                        Unlike validator staking, pNode rewards vary based on network activity. 
                        More storage demand = more STOINC = better returns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-4">
                <p className="text-sm text-zinc-400 mb-4">
                  Here&apos;s what each metric means and how to prioritize them:
                </p>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Score */}
                  <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-violet-400" />
                      <span className="font-medium text-zinc-100">Score</span>
                      <span className="ml-auto text-xs px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded-full">Most Important</span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Composite of uptime, credits, and fee. Higher = better overall performance.
                    </p>
                    <p className="text-xs text-emerald-400 mt-2">Look for: 90+ score</p>
                  </div>

                  {/* Uptime */}
                  <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-emerald-400" />
                      <span className="font-medium text-zinc-100">Uptime</span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      How often the node is online. Offline nodes don&apos;t earn STOINC.
                    </p>
                    <p className="text-xs text-emerald-400 mt-2">Look for: 99%+ uptime</p>
                  </div>

                  {/* Fee */}
                  <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Percent className="h-4 w-4 text-amber-400" />
                      <span className="font-medium text-zinc-100">Fee</span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Operator&apos;s cut of STOINC. Lower fee = more rewards for you.
                    </p>
                    <p className="text-xs text-emerald-400 mt-2">Look for: 2-5% fee</p>
                  </div>

                  {/* Credits */}
                  <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-cyan-400" />
                      <span className="font-medium text-zinc-100">Credits</span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Network activity score. More credits = node is actively serving storage.
                    </p>
                    <p className="text-xs text-emerald-400 mt-2">Look for: 50,000+ credits</p>
                  </div>

                  {/* Total Stake */}
                  <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="h-4 w-4 text-pink-400" />
                      <span className="font-medium text-zinc-100">Total Stake</span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      All XAND delegated to this node. Higher stake = rewards split more ways.
                    </p>
                    <p className="text-xs text-amber-400 mt-2">Tradeoff: Popular nodes have smaller per-XAND rewards</p>
                  </div>

                  {/* Delegators */}
                  <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-blue-400" />
                      <span className="font-medium text-zinc-100">Delegators</span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Number of people staking to this node. Shows community trust.
                    </p>
                    <p className="text-xs text-zinc-500 mt-2">Secondary metric—focus on performance first</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'strategy' && (
              <div className="space-y-4">
                <p className="text-sm text-zinc-400 mb-4">
                  Choose a strategy based on your goals:
                </p>

                {/* Strategy Cards */}
                <div className="space-y-3">
                  {/* Safe Play */}
                  <div className="p-4 bg-zinc-800/50 rounded-lg border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-zinc-100">🛡️ Safe & Steady</h4>
                        <p className="text-xs text-zinc-400 mt-1">
                          Pick nodes with <span className="text-emerald-400">99%+ uptime</span> and <span className="text-emerald-400">50K+ credits</span>.
                          Accept slightly higher fees for reliability.
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="text-xs px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded">Uptime ≥ 99%</span>
                          <span className="text-xs px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded">Score ≥ 90</span>
                          <span className="text-xs px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded">Any fee</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Max Returns */}
                  <div className="p-4 bg-zinc-800/50 rounded-lg border border-amber-500/20 hover:border-amber-500/40 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/10">
                        <TrendingUp className="h-5 w-5 text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-zinc-100">💰 Maximize Returns</h4>
                        <p className="text-xs text-zinc-400 mt-1">
                          Filter for <span className="text-amber-400">lowest fees (2-3%)</span> with decent performance.
                          Small fee differences compound over time.
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="text-xs px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded">Fee ≤ 3%</span>
                          <span className="text-xs px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded">Uptime ≥ 98%</span>
                          <span className="text-xs px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded">Lower stake pools</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Support Small */}
                  <div className="p-4 bg-zinc-800/50 rounded-lg border border-violet-500/20 hover:border-violet-500/40 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-violet-500/10">
                        <Users className="h-5 w-5 text-violet-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-zinc-100">🌱 Support Small Operators</h4>
                        <p className="text-xs text-zinc-400 mt-1">
                          Pick nodes with <span className="text-violet-400">fewer delegators</span> and lower total stake.
                          Your share of the pool is larger.
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="text-xs px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded">Total Stake &lt; 30K</span>
                          <span className="text-xs px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded">Uptime ≥ 98%</span>
                          <span className="text-xs px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded">Decentralize!</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Decision */}
                <div className="p-4 bg-violet-500/5 border border-violet-500/20 rounded-lg mt-4">
                  <p className="text-sm text-zinc-300">
                    <span className="font-medium text-violet-300">Quick Decision:</span> Sort by Score ↓, 
                    check the top 5, pick the one with lowest fee that has 99%+ uptime.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
