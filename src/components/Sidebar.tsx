'use client';

import { LayoutDashboard, ListTodo, GitCompare, DollarSign, Link2 } from 'lucide-react';

type View = 'dashboard' | 'items' | 'products' | 'budget' | 'compatibility';

const navItems: { view: View; label: string; icon: React.ReactNode }[] = [
  { view: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { view: 'items', label: 'Items', icon: <ListTodo size={20} /> },
  { view: 'products', label: 'Products', icon: <GitCompare size={20} /> },
  { view: 'budget', label: 'Budget', icon: <DollarSign size={20} /> },
  { view: 'compatibility', label: 'Compatibility', icon: <Link2 size={20} /> },
];

export function Sidebar({ currentView, onViewChange }: { currentView: View; onViewChange: (v: View) => void }) {
  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">Baby Shopping</h1>
        <p className="text-xs text-gray-500 mt-0.5">Research Manager</p>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map(item => (
          <button
            key={item.view}
            onClick={() => onViewChange(item.view)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === item.view
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 text-xs text-gray-400">
        Singapore context | SGD
      </div>
    </aside>
  );
}
