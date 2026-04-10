'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Star, ExternalLink, X } from 'lucide-react';

interface Item {
  id: string;
  name: string;
  categoryIcon: string;
  categoryName: string;
}

interface Product {
  id: string;
  itemId: string;
  name: string;
  brand: string;
  price: number | null;
  currency: string;
  retailer: string;
  productUrl: string;
  imageUrl: string;
  dimensions: string;
  safetyRating: string;
  rating: number | null;
  pros: string;
  cons: string;
  isTopPick: number;
  rank: number;
  itemName: string;
}

export function ProductComparison() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', brand: '', price: '', retailer: '', productUrl: '',
    imageUrl: '', dimensions: '', safetyRating: '', pros: '', cons: '',
    isTopPick: false, rank: 0,
  });

  useEffect(() => {
    fetch('/api/items').then(r => r.json()).then(setItems);
  }, []);

  useEffect(() => {
    if (selectedItemId) {
      fetch(`/api/products?itemId=${selectedItemId}`).then(r => r.json()).then(setProducts);
    } else {
      fetch('/api/products').then(r => r.json()).then(setProducts);
    }
  }, [selectedItemId]);

  const addProduct = async () => {
    if (!newProduct.name || !selectedItemId) return;
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newProduct,
        itemId: selectedItemId,
        price: newProduct.price ? Number(newProduct.price) : null,
      }),
    });
    setNewProduct({ name: '', brand: '', price: '', retailer: '', productUrl: '', imageUrl: '', dimensions: '', safetyRating: '', pros: '', cons: '', isTopPick: false, rank: 0 });
    setShowAddForm(false);
    fetch(`/api/products?itemId=${selectedItemId}`).then(r => r.json()).then(setProducts);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    const params = selectedItemId ? `?itemId=${selectedItemId}` : '';
    fetch(`/api/products${params}`).then(r => r.json()).then(setProducts);
  };

  const toggleTopPick = async (product: Product) => {
    await fetch(`/api/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isTopPick: !product.isTopPick }),
    });
    const params = selectedItemId ? `?itemId=${selectedItemId}` : '';
    fetch(`/api/products${params}`).then(r => r.json()).then(setProducts);
  };

  const topPicks = products.filter(p => p.isTopPick);
  const others = products.filter(p => !p.isTopPick);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Product Comparison</h2>
        {selectedItemId && (
          <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <Plus size={16} /> Add Product
          </button>
        )}
      </div>

      {/* Item Selector */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <label className="text-sm font-medium text-gray-700 block mb-2">Select item to compare products:</label>
        <select
          value={selectedItemId}
          onChange={e => setSelectedItemId(e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
        >
          <option value="">All Products</option>
          {items.map(item => (
            <option key={item.id} value={item.id}>{item.categoryIcon} {item.name}</option>
          ))}
        </select>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl border border-blue-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-gray-800">Add New Product</h3>
            <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input type="text" placeholder="Product name *" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="text-sm border border-gray-200 rounded-lg px-3 py-2" />
            <input type="text" placeholder="Brand" value={newProduct.brand} onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })} className="text-sm border border-gray-200 rounded-lg px-3 py-2" />
            <input type="number" placeholder="Price (SGD)" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className="text-sm border border-gray-200 rounded-lg px-3 py-2" />
            <input type="text" placeholder="Retailer" value={newProduct.retailer} onChange={e => setNewProduct({ ...newProduct, retailer: e.target.value })} className="text-sm border border-gray-200 rounded-lg px-3 py-2" />
            <input type="text" placeholder="Product URL" value={newProduct.productUrl} onChange={e => setNewProduct({ ...newProduct, productUrl: e.target.value })} className="text-sm border border-gray-200 rounded-lg px-3 py-2" />
            <input type="text" placeholder="Image URL" value={newProduct.imageUrl} onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })} className="text-sm border border-gray-200 rounded-lg px-3 py-2" />
            <input type="text" placeholder="Dimensions" value={newProduct.dimensions} onChange={e => setNewProduct({ ...newProduct, dimensions: e.target.value })} className="text-sm border border-gray-200 rounded-lg px-3 py-2" />
            <input type="text" placeholder="Safety Rating" value={newProduct.safetyRating} onChange={e => setNewProduct({ ...newProduct, safetyRating: e.target.value })} className="text-sm border border-gray-200 rounded-lg px-3 py-2" />
            <label className="flex items-center gap-2 text-sm text-gray-700 px-3 py-2">
              <input type="checkbox" checked={newProduct.isTopPick} onChange={e => setNewProduct({ ...newProduct, isTopPick: e.target.checked })} />
              Top Pick
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <textarea placeholder="Pros" value={newProduct.pros} onChange={e => setNewProduct({ ...newProduct, pros: e.target.value })} className="text-sm border border-gray-200 rounded-lg px-3 py-2 h-20" />
            <textarea placeholder="Cons" value={newProduct.cons} onChange={e => setNewProduct({ ...newProduct, cons: e.target.value })} className="text-sm border border-gray-200 rounded-lg px-3 py-2 h-20" />
          </div>
          <button onClick={addProduct} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Add Product</button>
        </div>
      )}

      {/* Top Picks Comparison */}
      {topPicks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Star size={18} className="text-yellow-500" /> Top Picks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topPicks.map(product => (
              <ProductCard key={product.id} product={product} onDelete={deleteProduct} onTogglePick={toggleTopPick} />
            ))}
          </div>
        </div>
      )}

      {/* Other Products */}
      {others.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">All Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {others.map(product => (
              <ProductCard key={product.id} product={product} onDelete={deleteProduct} onTogglePick={toggleTopPick} />
            ))}
          </div>
        </div>
      )}

      {products.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">
            {selectedItemId ? 'No products added for this item yet. Click "Add Product" to start.' : 'Select an item above, or browse all products.'}
          </p>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onDelete, onTogglePick }: { product: Product; onDelete: (id: string) => void; onTogglePick: (p: Product) => void }) {
  return (
    <div className={`bg-white rounded-xl border p-4 space-y-3 ${product.isTopPick ? 'border-yellow-300 ring-1 ring-yellow-200' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-gray-900">{product.name}</div>
          {product.brand && <div className="text-xs text-gray-500">{product.brand}</div>}
          <div className="text-xs text-gray-400 mt-0.5">{product.itemName}</div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onTogglePick(product)} className={`p-1 rounded ${product.isTopPick ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'}`}>
            <Star size={16} fill={product.isTopPick ? 'currentColor' : 'none'} />
          </button>
          <button onClick={() => onDelete(product.id)} className="p-1 text-gray-300 hover:text-red-500 rounded">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {product.price && (
        <div className="text-xl font-bold text-green-700">${product.price.toLocaleString()} <span className="text-xs font-normal text-gray-400">{product.currency}</span></div>
      )}

      <div className="space-y-1.5 text-xs">
        {product.retailer && <div className="text-gray-600"><span className="text-gray-400">Retailer:</span> {product.retailer}</div>}
        {product.dimensions && <div className="text-gray-600"><span className="text-gray-400">Size:</span> {product.dimensions}</div>}
        {product.safetyRating && <div className="text-gray-600"><span className="text-gray-400">Safety:</span> {product.safetyRating}</div>}
        {product.rating && <div className="text-gray-600"><span className="text-gray-400">Rating:</span> {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</div>}
      </div>

      {(product.pros || product.cons) && (
        <div className="space-y-1 text-xs">
          {product.pros && <div className="text-green-700"><span className="font-medium">+</span> {product.pros}</div>}
          {product.cons && <div className="text-red-600"><span className="font-medium">-</span> {product.cons}</div>}
        </div>
      )}

      {product.productUrl && (
        <a href={product.productUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
          <ExternalLink size={12} /> View Product
        </a>
      )}
    </div>
  );
}
