'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, Info } from 'lucide-react';
import { PNode } from '@/types';

interface SmartCalculatorProps {
  node: PNode;
  onClose: () => void;
}

export function SmartCalculator({ node, onClose }: SmartCalculatorProps) {
  const [myStake, setMyStake] = useState<number>(10000);

  // Calculate based on actual node data
  const calculations = useMemo(() => {
    const myShareOfPool = (myStake / (node.totalStake + myStake)) * 100;
    const operatorCut = node.fee;
    const delegatorPoolShare = 100 - operatorCut;
    const myEffectiveShare = (myShareOfPool * delegatorPoolShare) / 100;
    
    // Estimate based on credits (rough conversion)
    const estimatedDailyStoinc = node.credits / 1000; // Simplified estimate
    const myDailyStoinc = (estimatedDailyStoinc * myEffectiveShare) / 100;
    const myMonthlyStoinc = myDailyStoinc * 30;

    return {
      myShareOfPool: myShareOfPool.toFixed(2),
      delegatorPoolShare,
      myEffectiveShare: myEffectiveShare.toFixed(3),
      myDailyStoinc: myDailyStoinc.toFixed(2),
      myMonthlyStoinc: myMonthlyStoinc.toFixed(2),
      newTotalStake: node.totalStake + myStake,
    };
  }, [myStake, node]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
              <Calculator className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-100">Return Calculator</h3>
              <p className="text-sm text-zinc-500">{node.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Node Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-zinc-800/50 rounded-lg text-center">
              <p className="text-xs text-zinc-500 mb-1">Current Stake</p>
              <p className="text-lg font-semibold text-zinc-100">{(node.totalStake / 1000).toFixed(1)}K</p>
            </div>
            <div className="p-3 bg-zinc-800/50 rounded-lg text-center">
              <p className="text-xs text-zinc-500 mb-1">Delegators</p>
              <p className="text-lg font-semibold text-zinc-100">{node.delegators}</p>
            </div>
            <div className="p-3 bg-zinc-800/50 rounded-lg text-center">
              <p className="text-xs text-zinc-500 mb-1">Operator Fee</p>
              <p className="text-lg font-semibold text-amber-400">{node.fee}%</p>
            </div>
          </div>

          {/* Stake Input */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              How much XAND will you stake?
            </label>
            <div className="relative">
              <input
                type="number"
                value={myStake}
                onChange={(e) => setMyStake(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-lg font-mono text-zinc-100 focus:outline-none focus:border-violet-500"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">XAND</span>
            </div>
            <div className="flex gap-2 mt-2">
              {[1000, 5000, 10000, 25000, 50000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setMyStake(amount)}
                  className={`flex-1 py-1.5 text-xs rounded border transition-colors ${
                    myStake === amount 
                      ? 'bg-violet-600 border-violet-500 text-white' 
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  {amount >= 1000 ? `${amount/1000}K` : amount}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Breakdown */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-zinc-300">Your Share Breakdown</h4>
            
            {/* Pool Share Visual */}
            <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-400">Your % of pool</span>
                <span className="text-lg font-semibold text-cyan-400">{calculations.myShareOfPool}%</span>
              </div>
              <div className="h-3 bg-zinc-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-300"
                  style={{ width: `${Math.min(parseFloat(calculations.myShareOfPool), 100)}%` }}
                />
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                {myStake.toLocaleString()} / {calculations.newTotalStake.toLocaleString()} XAND after your delegation
              </p>
            </div>

            {/* Fee Visual */}
            <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-400">After {node.fee}% operator fee</span>
                <span className="text-lg font-semibold text-emerald-400">{calculations.delegatorPoolShare}% to delegators</span>
              </div>
              <div className="h-3 bg-zinc-700 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-emerald-500"
                  style={{ width: `${calculations.delegatorPoolShare}%` }}
                />
                <div 
                  className="h-full bg-amber-500"
                  style={{ width: `${node.fee}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-zinc-500 mt-2">
                <span>Your share: {calculations.myEffectiveShare}%</span>
                <span className="text-amber-400">Operator: {node.fee}%</span>
              </div>
            </div>
          </div>

          {/* Estimated Returns */}
          <div className="p-4 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/20 rounded-lg">
            <h4 className="text-sm font-medium text-zinc-300 mb-3">Estimated STOINC Earnings</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-zinc-500">Daily (est.)</p>
                <p className="text-xl font-semibold text-emerald-400">{calculations.myDailyStoinc} XAND</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Monthly (est.)</p>
                <p className="text-xl font-semibold text-emerald-400">{calculations.myMonthlyStoinc} XAND</p>
              </div>
            </div>
            <p className="text-xs text-zinc-500 mt-3">
              * Estimates based on current {node.credits.toLocaleString()} credits. Actual returns depend on network storage activity.
            </p>
          </div>

          {/* Comparison Hint */}
          <div className="flex items-start gap-3 p-3 bg-zinc-800/30 rounded-lg">
            <Info className="h-4 w-4 text-violet-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-400">
              <span className="text-zinc-300 font-medium">Pro tip:</span> Compare 2-3 nodes with similar scores but different fees and pool sizes to find the best returns for your stake amount.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
