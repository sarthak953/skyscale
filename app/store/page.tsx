'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/store/ProductCard';

export default function StorePage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [scales, setScales] = useState<string[]>([]);
  const [availableFilters, setAvailableFilters] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [filters, setFilters] = useState({ category: '', scale: '', min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    fetchCategories();
    fetchScales();
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categories.length > 0) {
      const category = categories.find(c => c.slug === categoryParam || c.id === categoryParam);
      if (category) {
        setFilters(prev => ({ ...prev, category: category.id }));
      }
    }
  }, [searchParams, categories]);

  useEffect(() => {
    if (categories.length > 0) {
      fetchProducts();
    }
  }, [filters, selectedFilters, categories]);

  useEffect(() => {
    if (filters.category) {
      fetchCategoryFilters(filters.category);
    } else {
      setAvailableFilters([]);
      setSelectedFilters([]);
    }
  }, [filters.category]);

  async function fetchCategories() {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  }

  async function fetchScales() {
    const res = await fetch('/api/scales');
    const data = await res.json();
    setScales(data);
  }

  async function fetchCategoryFilters(categoryId: string) {
    try {
      const res = await fetch(`/api/categories/${categoryId}/filters`);
      const data = await res.json();
      setAvailableFilters(Array.isArray(data) ? data : []);
      setSelectedFilters([]);
    } catch (error) {
      console.error('Fetch filters error:', error);
      setAvailableFilters([]);
    }
  }

  const sortProducts = (prods: any[], sort: string) => {
    const sorted = [...prods];
    if (sort === 'price-low') {
      return sorted.sort((a, b) => a.price_cents - b.price_cents);
    } else if (sort === 'price-high') {
      return sorted.sort((a, b) => b.price_cents - a.price_cents);
    }
    return sorted;
  };

  async function fetchProducts() {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.set('categoryId', filters.category);
      if (filters.scale) params.set('scale', filters.scale);
      if (selectedFilters.length > 0) params.set('filterTypes', selectedFilters.join(','));
      params.set('minPrice', String(filters.min * 100));
      params.set('maxPrice', String(filters.max * 100));

      console.log('Fetching products with filters:', filters);
      console.log('API URL:', '/api/products?' + params.toString());

      const res = await fetch('/api/products?' + params.toString());
      const data = await res.json();
      
      if (res.ok && Array.isArray(data)) {
        console.log('Received products:', data.length);
        const sorted = sortProducts(data, sortBy);
        setProducts(sorted);
      } else {
        console.error('Products API error:', data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Fetch products error:', error);
      setProducts([]);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-sky-800">Discover Our Collection</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <aside className="bg-white p-6 rounded-2xl shadow-lg sticky top-28 self-start animate-fadeIn">
          <h4 className="font-semibold mb-4 text-sky-700 flex items-center gap-2"><span className="inline-block w-5 h-5 bg-sky-100 rounded-full flex items-center justify-center"><svg width="16" height="16" fill="none"><path d="M2 2h12v12H2z" stroke="#0ea5e9" strokeWidth="2"/></svg></span> Filters</h4>
          <label className="block text-sm text-gray-600 mb-2">Category</label>
          <select className="w-full border px-3 py-2 rounded-lg mb-4 focus:ring-2 focus:ring-sky-400" value={filters.category} onChange={(e) => setFilters(f => ({...f, category: e.target.value}))}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          {availableFilters.length > 0 && (
            <>
              <label className="block text-sm text-gray-600 mb-2">Sub-Filters</label>
              <div className="mb-4 space-y-2">
                {availableFilters.map(filter => (
                  <label key={filter} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(filter)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFilters([...selectedFilters, filter]);
                        } else {
                          setSelectedFilters(selectedFilters.filter(f => f !== filter));
                        }
                      }}
                      className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
                    />
                    <span className="text-sm text-gray-700">{filter}</span>
                  </label>
                ))}
              </div>
            </>
          )}

          <label className="block text-sm text-gray-600 mb-2">Scale</label>
          <select className="w-full border px-3 py-2 rounded-lg mb-4 focus:ring-2 focus:ring-sky-400" value={filters.scale} onChange={(e) => setFilters(f => ({...f, scale: e.target.value}))}>
            <option value="">All Scales</option>
            {scales.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <label className="block text-sm text-gray-600 mb-2">Price Range</label>
          <div className="flex items-center gap-2 mb-4">
            <input type="number" className="w-1/2 border px-2 py-1 rounded-lg focus:ring-2 focus:ring-sky-400" value={filters.min} onChange={(e) => setFilters(f => ({...f, min: Number(e.target.value)}))} />
            <input type="number" className="w-1/2 border px-2 py-1 rounded-lg focus:ring-2 focus:ring-sky-400" value={filters.max} onChange={(e) => setFilters(f => ({...f, max: Number(e.target.value)}))} />
          </div>

          <button className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white py-2 rounded-lg font-semibold hover:scale-105 transition-transform" onClick={() => { setFilters({ category: '', scale: '', min: 0, max: 1000 }); setSelectedFilters([]); }}>Clear All Filters</button>
        </aside>

        <div className="md:col-span-3">
          <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white px-4 py-2 rounded shadow text-sky-700 font-medium">1-12 of {products.length} Products</div>
            </div>
            <div>
              <select 
                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-sky-400"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setProducts(sortProducts(products, e.target.value));
                }}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((p, idx) => (
              <div key={p.id} className="fade-in" style={{animationDelay: `${idx * 60}ms`}}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
