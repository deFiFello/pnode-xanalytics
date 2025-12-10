'use client';

import { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  Target, 
  Scale, 
  TrendingUp,
  Clock,
  HardDrive,
  Percent,
  Users,
  Map,
  Zap
} from 'lucide-react';

export function QuickGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-xand-card border border-xand-border rounded-xl overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-xand-card-hover transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-xand-teal/20">
            <HelpCircle className="h-5 w-5 text-xand-teal" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-xand-text">Quick Guide</h3>
            <p className="text-sm text-xand-text-dim">How to pick the best pNode in 60 seconds</p>
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 text-xand-text-dim transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Collapsible content */}
      {isOpen && (
        <div className="px-6 pb-6 space-y-6 border-t border-xand-border pt-6">
          {/* Goal */}
          <div className="flex gap-4">
            <div className="p-2 h-fit rounded-lg bg-xand-green/10">
              <Target className="h-5 w-5 text-xand-green" />
            </div>
            <div>
              <h4 className="font-semibold text-xand-text mb-1">Your Goal</h4>
              <p className="text-sm text-xand-text-dim">
                Find a reliable pNode to delegate your XAND tokens. Higher uptime + lower fees = better returns.
              </p>
            </div>
          </div>

          {/* Metrics explained */}
          <div>
            <h4 className="font-semibold text-xand-text mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-xand-yellow" />
              Key Metrics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <MetricCard
                icon={<TrendingUp className="h-4 w-4" />}
                label="Performance Score"
                description="Composite of uptime, latency, and challenge success. Higher is better."
                color="teal"
              />
              <MetricCard
                icon={<Clock className="h-4 w-4" />}
                label="Uptime"
                description="How often the node is online. Look for 99%+."
                color="green"
              />
              <MetricCard
                icon={<HardDrive className="h-4 w-4" />}
                label="Storage"
                description="Total capacity dedicated to the network."
                color="blue"
              />
              <MetricCard
                icon={<Percent className="h-4 w-4" />}
                label="Fee"
                description="Operator's cut of your rewards. Lower is better for you."
                color="yellow"
              />
              <MetricCard
                icon={<Users className="h-4 w-4" />}
                label="Delegators"
                description="Number of stakers trusting this node. Social proof."
                color="purple"
              />
              <MetricCard
                icon={<Map className="h-4 w-4" />}
                label="Location"
                description="Geographic diversity improves network resilience."
                color="blue"
              />
            </div>
          </div>

          {/* How to compare */}
          <div className="flex gap-4">
            <div className="p-2 h-fit rounded-lg bg-xand-purple/10">
              <Scale className="h-5 w-5 text-xand-purple" />
            </div>
            <div>
              <h4 className="font-semibold text-xand-text mb-1">Using the Comparison Tool</h4>
              <ol className="text-sm text-xand-text-dim space-y-1 list-decimal list-inside">
                <li>Check the boxes next to 2-5 nodes you're considering</li>
                <li>Scroll to the comparison panel that appears</li>
                <li>Adjust the weight sliders based on what matters most to you</li>
                <li>The tool calculates a weighted score and recommends the best match</li>
              </ol>
            </div>
          </div>

          {/* Quick decision framework */}
          <div className="bg-xand-dark/30 rounded-lg p-4">
            <h4 className="font-semibold text-xand-text mb-2">⚡ Quick Decision Framework</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xand-green font-medium">Safe Choice</p>
                <p className="text-xand-text-dim">99%+ uptime, 2-3% fee, 50+ delegators</p>
              </div>
              <div>
                <p className="text-xand-yellow font-medium">Max Returns</p>
                <p className="text-xand-text-dim">98%+ uptime, lowest fee available</p>
              </div>
              <div>
                <p className="text-xand-purple font-medium">Support Small Operators</p>
                <p className="text-xand-text-dim">Good uptime, fewer delegators, helps decentralization</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  color: 'teal' | 'green' | 'blue' | 'yellow' | 'purple';
}

function MetricCard({ icon, label, description, color }: MetricCardProps) {
  const colorClasses = {
    teal: 'text-xand-teal bg-xand-teal/10',
    green: 'text-xand-green bg-xand-green/10',
    blue: 'text-xand-blue bg-xand-blue/10',
    yellow: 'text-xand-yellow bg-xand-yellow/10',
    purple: 'text-xand-purple bg-xand-purple/10',
  };

  return (
    <div className="flex gap-3 p-3 bg-xand-dark/30 rounded-lg">
      <div className={`p-1.5 h-fit rounded ${colorClasses[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-xand-text">{label}</p>
        <p className="text-xs text-xand-text-muted">{description}</p>
      </div>
    </div>
  );
}
