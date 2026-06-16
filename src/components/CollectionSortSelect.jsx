import React from 'react';

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A–Z' },
  { value: 'newest', label: 'Newest' },
];

export function sortProducts(products, sortBy = 'featured') {
  const list = [...(products || [])];
  switch (sortBy) {
    case 'price-asc':
      return list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    case 'price-desc':
      return list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    case 'name-asc':
      return list.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
    case 'newest':
      return list.sort((a, b) => {
        const da = new Date(a.created_at || a.updated_at || 0).getTime();
        const db = new Date(b.created_at || b.updated_at || 0).getTime();
        return db - da;
      });
    default:
      return list;
  }
}

const CollectionSortSelect = ({ value, onChange, className = '' }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <label htmlFor="collection-sort" className="text-sm font-medium text-gray-700 shrink-0">
      Sort by
    </label>
    <select
      id="collection-sort"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-w-0 flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default CollectionSortSelect;
