'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, AlertTriangle, CheckCircle2, HelpCircle, X } from 'lucide-react';

interface Dependency {
  id: string;
  itemId: string;
  dependsOnItemId: string;
  dependencyType: string;
  description: string;
  status: string;
  itemName: string;
  itemStatus: string;
  dependsOnName: string;
  dependsOnStatus: string;
}

interface Item {
  id: string;
  name: string;
  categoryIcon: string;
  status: string;
}

const statusIcon: Record<string, React.ReactNode> = {
  compatible: <CheckCircle2 size={16} className="text-green-500" />,
  incompatible: <AlertTriangle size={16} className="text-red-500" />,
  unverified: <HelpCircle size={16} className="text-yellow-500" />,
};

const statusColors: Record<string, string> = {
  compatible: 'bg-green-50 border-green-200 text-green-800',
  incompatible: 'bg-red-50 border-red-200 text-red-800',
  unverified: 'bg-yellow-50 border-yellow-200 text-yellow-800',
};

const typeLabels: Record<string, string> = {
  size_match: 'Size Match',
  compatibility: 'Compatibility',
  complementary: 'Complementary',
};

export function CompatibilityMatrix() {
  const [deps, setDeps] = useState<Dependency[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDep, setNewDep] = useState({ itemId: '', dependsOnItemId: '', dependencyType: 'compatibility', description: '' });

  useEffect(() => {
    fetch('/api/dependencies').then(r => r.json()).then(setDeps);
    fetch('/api/items').then(r => r.json()).then(setItems);
  }, []);

  const addDep = async () => {
    if (!newDep.itemId || !newDep.dependsOnItemId) return;
    await fetch('/api/dependencies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDep),
    });
    setNewDep({ itemId: '', dependsOnItemId: '', dependencyType: 'compatibility', description: '' });
    setShowAddForm(false);
    fetch('/api/dependencies').then(r => r.json()).then(setDeps);
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/dependencies/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetch('/api/dependencies').then(r => r.json()).then(setDeps);
  };

  const deleteDep = async (id: string) => {
    if (!confirm('Delete this dependency?')) return;
    await fetch(`/api/dependencies/${id}`, { method: 'DELETE' });
    fetch('/api/dependencies').then(r => r.json()).then(setDeps);
  };

  const alerts = deps.filter(d => d.status === 'incompatible' || (d.status === 'unverified' && d.dependsOnStatus !== 'pending'));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Compatibility Matrix</h2>
        <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus size={16} /> Add Dependency
        </button>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h3 className="font-semibold text-yellow-800 text-sm mb-2 flex items-center gap-2">
            <AlertTriangle size={16} /> Attention Needed
          </h3>
          <div className="space-y-2">
            {alerts.map(a => (
              <div key={a.id} className="text-xs text-yellow-700">
                <span className="font-medium">{a.itemName}</span> depends on <span className="font-medium">{a.dependsOnName}</span>
                {a.status === 'incompatible' ? ' — INCOMPATIBLE' : ' — needs verification'}
                {a.description && <span className="text-yellow-600"> ({a.description})</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl border border-blue-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-gray-800">Add Dependency</h3>
            <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Item (needs)</label>
              <select value={newDep.itemId} onChange={e => setNewDep({ ...newDep, itemId: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2">
                <option value="">Select item...</option>
                {items.map(i => <option key={i.id} value={i.id}>{i.categoryIcon} {i.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Depends on</label>
              <select value={newDep.dependsOnItemId} onChange={e => setNewDep({ ...newDep, dependsOnItemId: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2">
                <option value="">Select item...</option>
                {items.filter(i => i.id !== newDep.itemId).map(i => <option key={i.id} value={i.id}>{i.categoryIcon} {i.name}</option>)}
              </select>
            </div>
            <select value={newDep.dependencyType} onChange={e => setNewDep({ ...newDep, dependencyType: e.target.value })} className="text-sm border border-gray-200 rounded-lg px-3 py-2">
              <option value="size_match">Size Match</option>
              <option value="compatibility">Compatibility</option>
              <option value="complementary">Complementary</option>
            </select>
            <input type="text" placeholder="Description" value={newDep.description} onChange={e => setNewDep({ ...newDep, description: e.target.value })} className="text-sm border border-gray-200 rounded-lg px-3 py-2" />
          </div>
          <button onClick={addDep} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Add</button>
        </div>
      )}

      {/* Dependencies List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Dependencies ({deps.length})</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {deps.map(dep => (
            <div key={dep.id} className={`flex items-center gap-4 px-4 py-3 ${dep.status === 'incompatible' ? 'bg-red-50/50' : ''}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm">
                  {statusIcon[dep.status]}
                  <span className="font-medium text-gray-900">{dep.itemName}</span>
                  <span className="text-gray-400">depends on</span>
                  <span className="font-medium text-gray-900">{dep.dependsOnName}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-0.5 rounded">{typeLabels[dep.dependencyType]}</span>
                  {dep.description && <span className="truncate">{dep.description}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={dep.status}
                  onChange={e => updateStatus(dep.id, e.target.value)}
                  className={`text-xs px-2 py-1 rounded-lg border font-medium ${statusColors[dep.status]}`}
                >
                  <option value="unverified">Unverified</option>
                  <option value="compatible">Compatible</option>
                  <option value="incompatible">Incompatible</option>
                </select>
                <button onClick={() => deleteDep(dep.id)} className="p-1 text-gray-300 hover:text-red-500 rounded">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {deps.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              No dependencies tracked yet. Add one to start tracking compatibility.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
