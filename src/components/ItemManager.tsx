'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, Filter } from 'lucide-react';

interface Item {
  id: string;
  categoryId: string;
  name: string;
  priority: 'must_have' | 'optional';
  status: 'pending' | 'researching' | 'reviewed' | 'purchased';
  notes: string;
  budgetEstimate: number | null;
  actualCost: number | null;
  paperclipIssueId: string | null;
  categoryName: string;
  categoryIcon: string;
  productCount: number;
  topPickCount: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

const statusOptions = ['pending', 'researching', 'reviewed', 'purchased'] as const;
const priorityOptions = ['must_have', 'optional'] as const;

const statusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-700',
  researching: 'bg-blue-100 text-blue-700',
  reviewed: 'bg-green-100 text-green-700',
  purchased: 'bg-purple-100 text-purple-700',
};

const priorityColors: Record<string, string> = {
  must_have: 'bg-red-50 text-red-700 border-red-200',
  optional: 'bg-gray-50 text-gray-600 border-gray-200',
};

export function ItemManager({ onRefresh }: { onRefresh: () => void }) {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Item>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<{ name: string; categoryId: string; priority: 'must_have' | 'optional'; notes: string }>({ name: '', categoryId: '', priority: 'must_have', notes: '' });

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filterCategory) params.set('categoryId', filterCategory);
    if (filterStatus) params.set('status', filterStatus);
    if (filterPriority) params.set('priority', filterPriority);
    if (searchQuery) params.set('q', searchQuery);
    fetch(`/api/items?${params}`).then(r => r.json()).then(setItems);
  }, [filterCategory, filterStatus, filterPriority, searchQuery]);

  const startEdit = (item: Item) => {
    setEditingId(item.id);
    setEditForm({ name: item.name, priority: item.priority, status: item.status, notes: item.notes, budgetEstimate: item.budgetEstimate, actualCost: item.actualCost, categoryId: item.categoryId });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await fetch(`/api/items/${editingId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editForm) });
    setEditingId(null);
    refreshItems();
    onRefresh();
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    refreshItems();
    onRefresh();
  };

  const addItem = async () => {
    if (!newItem.name || !newItem.categoryId) return;
    await fetch('/api/items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newItem) });
    setNewItem({ name: '', categoryId: '', priority: 'must_have', notes: '' });
    setShowAddForm(false);
    refreshItems();
    onRefresh();
  };

  const quickStatusChange = async (id: string, status: string) => {
    await fetch(`/api/items/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    refreshItems();
    onRefresh();
  };

  const refreshItems = () => {
    const params = new URLSearchParams();
    if (filterCategory) params.set('categoryId', filterCategory);
    if (filterStatus) params.set('status', filterStatus);
    if (filterPriority) params.set('priority', filterPriority);
    if (searchQuery) params.set('q', searchQuery);
    fetch(`/api/items?${params}`).then(r => r.json()).then(setItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Item Manager</h2>
        <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus size={16} /> Add Item
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200">
        <Filter size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 text-sm border-0 focus:ring-0 outline-none"
        />
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-1">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-1">
          <option value="">All Statuses</option>
          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-1">
          <option value="">All Priorities</option>
          {priorityOptions.map(p => <option key={p} value={p}>{p === 'must_have' ? 'Must Have' : 'Optional'}</option>)}
        </select>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl border border-blue-200 p-4 space-y-3">
          <h3 className="font-semibold text-sm text-gray-800">Add New Item</h3>
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Item name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} className="text-sm border border-gray-200 rounded-lg px-3 py-2" />
            <select value={newItem.categoryId} onChange={e => setNewItem({ ...newItem, categoryId: e.target.value })} className="text-sm border border-gray-200 rounded-lg px-3 py-2">
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
            <select value={newItem.priority} onChange={e => setNewItem({ ...newItem, priority: e.target.value as 'must_have' | 'optional' })} className="text-sm border border-gray-200 rounded-lg px-3 py-2">
              <option value="must_have">Must Have</option>
              <option value="optional">Optional</option>
            </select>
            <input type="text" placeholder="Notes (optional)" value={newItem.notes} onChange={e => setNewItem({ ...newItem, notes: e.target.value })} className="text-sm border border-gray-200 rounded-lg px-3 py-2" />
          </div>
          <div className="flex gap-2">
            <button onClick={addItem} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Add</button>
            <button onClick={() => setShowAddForm(false)} className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">Cancel</button>
          </div>
        </div>
      )}

      {/* Items Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3 font-medium text-gray-500">Item</th>
              <th className="px-4 py-3 font-medium text-gray-500">Category</th>
              <th className="px-4 py-3 font-medium text-gray-500">Priority</th>
              <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 font-medium text-gray-500">Budget</th>
              <th className="px-4 py-3 font-medium text-gray-500">Products</th>
              <th className="px-4 py-3 font-medium text-gray-500 w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                {editingId === item.id ? (
                  <>
                    <td className="px-4 py-2">
                      <input type="text" value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full text-sm border border-gray-200 rounded px-2 py-1" />
                    </td>
                    <td className="px-4 py-2">
                      <select value={editForm.categoryId || ''} onChange={e => setEditForm({ ...editForm, categoryId: e.target.value })} className="text-sm border border-gray-200 rounded px-2 py-1">
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <select value={editForm.priority || ''} onChange={e => setEditForm({ ...editForm, priority: e.target.value as 'must_have' | 'optional' })} className="text-sm border border-gray-200 rounded px-2 py-1">
                        {priorityOptions.map(p => <option key={p} value={p}>{p === 'must_have' ? 'Must Have' : 'Optional'}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <select value={editForm.status || ''} onChange={e => setEditForm({ ...editForm, status: e.target.value as Item['status'] })} className="text-sm border border-gray-200 rounded px-2 py-1">
                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input type="number" value={editForm.budgetEstimate ?? ''} onChange={e => setEditForm({ ...editForm, budgetEstimate: e.target.value ? Number(e.target.value) : null })} placeholder="SGD" className="w-20 text-sm border border-gray-200 rounded px-2 py-1" />
                    </td>
                    <td className="px-4 py-2 text-gray-400">-</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-1">
                        <button onClick={saveEdit} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check size={16} /></button>
                        <button onClick={() => setEditingId(null)} className="p-1 text-gray-400 hover:bg-gray-100 rounded"><X size={16} /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      {item.notes && <div className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{item.notes}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">{item.categoryIcon} {item.categoryName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${priorityColors[item.priority]}`}>
                        {item.priority === 'must_have' ? 'Must Have' : 'Optional'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={item.status}
                        onChange={e => quickStatusChange(item.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${statusColors[item.status]}`}
                      >
                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.budgetEstimate ? `$${item.budgetEstimate.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">{item.productCount} ({item.topPickCount} picks)</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => startEdit(item)} className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={15} /></button>
                        <button onClick={() => deleteItem(item.id)} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">No items found</div>
        )}
      </div>

      <div className="text-xs text-gray-400">{items.length} items shown</div>
    </div>
  );
}
