'use client';

import { useEffect, useState } from 'react';

interface CategoryBudget {
  id: string;
  name: string;
  icon: string;
  totalItems: number;
  budgetEstimate: number;
  actualCost: number;
  purchased: number;
  reviewed: number;
}

interface DashboardData {
  budgetSummary: {
    totalEstimated: number;
    totalSpent: number;
    mustHaveEstimated: number;
    optionalEstimated: number;
  };
  categoryProgress: CategoryBudget[];
}

export function BudgetTracker() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(setData);
  }, []);

  if (!data) return <div className="text-gray-400">Loading budget data...</div>;

  const { budgetSummary, categoryProgress } = data;
  const totalEstimated = budgetSummary.totalEstimated;
  const totalSpent = budgetSummary.totalSpent;
  const remaining = totalEstimated - totalSpent;
  const spentPct = totalEstimated > 0 ? Math.round((totalSpent / totalEstimated) * 100) : 0;

  const maxCatBudget = Math.max(...categoryProgress.map(c => c.budgetEstimate), 1);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Budget Tracker</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <BudgetCard label="Total Estimated" value={totalEstimated} color="blue" />
        <BudgetCard label="Total Spent" value={totalSpent} color="green" />
        <BudgetCard label="Remaining" value={remaining} color={remaining < 0 ? 'red' : 'gray'} />
        <BudgetCard label="Must-Have Est." value={budgetSummary.mustHaveEstimated} color="yellow" />
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Budget Utilization</span>
          <span className="text-sm font-bold text-gray-900">{spentPct}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${spentPct > 100 ? 'bg-red-500' : spentPct > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min(spentPct, 100)}%` }}
          />
        </div>
        {totalEstimated === 0 && (
          <p className="text-xs text-gray-400 mt-2">No budget estimates set yet. Edit items in the Item Manager to add estimates.</p>
        )}
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Category Budget Breakdown</h3>
        </div>
        <div className="p-4 space-y-4">
          {categoryProgress.map(cat => {
            const catPct = cat.budgetEstimate > 0 ? Math.round((cat.actualCost / cat.budgetEstimate) * 100) : 0;
            const barWidth = maxCatBudget > 0 ? Math.round((cat.budgetEstimate / maxCatBudget) * 100) : 0;
            return (
              <div key={cat.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-sm font-medium text-gray-800">{cat.name}</span>
                    <span className="text-xs text-gray-400">({cat.totalItems} items)</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">${cat.actualCost.toLocaleString()}</span>
                    {cat.budgetEstimate > 0 && <span className="text-gray-400"> / ${cat.budgetEstimate.toLocaleString()}</span>}
                  </div>
                </div>
                <div className="flex gap-1 h-2">
                  <div className="bg-gray-100 rounded-full flex-1 relative" style={{ maxWidth: `${barWidth}%` }}>
                    {cat.budgetEstimate > 0 && (
                      <div
                        className={`h-2 rounded-full ${catPct > 100 ? 'bg-red-400' : 'bg-blue-400'}`}
                        style={{ width: `${Math.min(catPct, 100)}%` }}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Must-Have vs Optional */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Must-Have vs Optional</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">Must-Have Items</div>
            <div className="text-2xl font-bold text-red-700">${budgetSummary.mustHaveEstimated.toLocaleString()}</div>
            <div className="text-xs text-gray-400">estimated</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Optional Items</div>
            <div className="text-2xl font-bold text-gray-600">${budgetSummary.optionalEstimated.toLocaleString()}</div>
            <div className="text-xs text-gray-400">estimated</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BudgetCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-700',
    green: 'text-green-700',
    red: 'text-red-700',
    gray: 'text-gray-700',
    yellow: 'text-yellow-700',
  };
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={`text-xl font-bold ${colorMap[color]}`}>${value.toLocaleString()}</div>
      <div className="text-xs text-gray-400">SGD</div>
    </div>
  );
}
