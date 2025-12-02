"use client";

import { useState, useEffect } from "react";

interface Category {
  id: string;
  name: string;
  _count: { products: number };
}

interface CategoriesGridProps {
  onCategorySelect: (categoryId: string, categoryName: string) => void;
}

export default function CategoriesGrid({ onCategorySelect }: CategoriesGridProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    fetch("/api/admin/categories")
      .then(res => res.json())
      .then(setCategories);
  };

  const deleteCategory = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchCategories();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Categories</h2>
          <p className="text-gray-600">Select a category to view products</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => onCategorySelect(category.id, category.name)}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl cursor-pointer border border-gray-100 hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-1 relative group"
            >
              <button
                onClick={(e) => deleteCategory(category.id, e)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <h3 className="font-semibold text-lg mb-3 text-gray-900 break-words">{category.name}</h3>
              <p className="text-gray-500 text-sm">{category._count.products} products</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}