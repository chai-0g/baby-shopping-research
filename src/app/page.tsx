'use client';

import { useEffect, useState, useCallback } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { ItemManager } from '@/components/ItemManager';
import { ProductComparison } from '@/components/ProductComparison';
import { BudgetTracker } from '@/components/BudgetTracker';
import { CompatibilityMatrix } from '@/components/CompatibilityMatrix';

type View = 'dashboard' | 'items' | 'products' | 'budget' | 'compatibility';

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [seeded, setSeeded] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetch('/api/seed', { method: 'POST' }).then(r => r.json()).then(() => setSeeded(true));
  }, []);

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  if (!seeded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 overflow-y-auto p-6">
        {currentView === 'dashboard' && <Dashboard key={refreshKey} onRefresh={refresh} />}
        {currentView === 'items' && <ItemManager key={refreshKey} onRefresh={refresh} />}
        {currentView === 'products' && <ProductComparison key={refreshKey} />}
        {currentView === 'budget' && <BudgetTracker key={refreshKey} />}
        {currentView === 'compatibility' && <CompatibilityMatrix key={refreshKey} />}
      </main>
    </div>
  );
}
