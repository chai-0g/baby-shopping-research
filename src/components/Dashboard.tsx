'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, ShoppingCart, CheckCircle2, Search, Clock } from 'lucide-react';

interface DashboardData {
  totalItems: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  budgetSummary: {
    totalEstimated: number;
    totalSpent: number;
    mustHaveEstimated: number;
    optionalEstimated: number;
  };
  categoryProgress: {
    id: string;
    name: string;
    icon: string;
    totalItems: number;
    purchased: number;
    reviewed: number;
    researching: number;
    pending: number;
    budgetEstimate: number;
    actualCost: number;
  }[];
  recentItems: {
    id: string;
    name: string;
    status: string;
    categoryName: string;
    categoryIcon: string;
  }[];
}

const statusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-700',
  researching: 'bg-blue-100 text-blue-700',
  reviewed: 'bg-green-100 text-green-700',
  purchased: 'bg-purple-100 text-purple-700',
};

export function Dashboard({ onRefresh }: { onRefresh: () => void }) {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(setData);
  }, []);

  if (!data) return <div className="text-gray-400">Loading dashboard...</div>;

  const completedCount = (data.byStatus.reviewed || 0) + (data.byStatus.purchased || 0);
  const progress = data.totalItems > 0 ? Math.round((completedCount / data.totalItems) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <button onClick={onRefresh} className="text-gray-400 hover:text-gray-600">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard icon={<ShoppingCart size={20} />} label="Total Items" value={data.totalItems} color="blue" />
        <SummaryCard icon={<Search size={20} />} label="Researching" value={data.byStatus.researching || 0} color="yellow" />
        <SummaryCard icon={<CheckCircle2 size={20} />} label="Reviewed" value={data.byStatus.reviewed || 0} color="green" />
        <SummaryCard icon={<Clock size={20} />} label="Pending" value={data.byStatus.pending || 0} color="gray" />
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-bold text-gray-900">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex gap-4 mt-3 text-xs text-gray-500">
          <span>Must-have: {data.byPriority.must_have || 0}</span>
          <span>Optional: {data.byPriority.optional || 0}</span>
          <span>Purchased: {data.byStatus.purchased || 0}</span>
        </div>
      </div>

      {/* Category Progress */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Category Progress</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {data.categoryProgress.map(cat => {
            const catComplete = cat.reviewed + cat.purchased;
            const catPct = cat.totalItems > 0 ? Math.round((catComplete / cat.totalItems) * 100) : 0;
            return (
              <div key={cat.id} className="flex items-center gap-4 px-4 py-3">
                <span className="text-xl w-8 text-center">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-800 truncate">{cat.name}</span>
                    <span className="text-xs text-gray-500">{catComplete}/{cat.totalItems}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${catPct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      {data.recentItems.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {data.recentItems.map(item => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                <span className="text-lg">{item.categoryIcon}</span>
                <span className="text-sm text-gray-800 flex-1">{item.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[item.status]}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
    gray: 'bg-gray-50 text-gray-600',
  };
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}
