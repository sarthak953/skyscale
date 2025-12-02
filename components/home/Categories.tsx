'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  return (
    <section className="py-12 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-full px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent mb-1">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Explore our diverse collection</p>
          </div>
            <Link href="/store" 
            className="group flex items-center gap-2 text-sky-600 hover:text-indigo-600 font-semibold transition-all text-sm"
          >
            All Categories
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.slice(0, 6).map((category, idx) => (
              <Link key={category.id || idx} href={`/store?category=${category.slug}`}>
                <div 
                  className="relative aspect-[4/3] overflow-hidden rounded-xl group shadow-md hover:shadow-xl transition-all duration-500 bg-white border border-gray-100 hover:border-sky-200 cursor-pointer"
                  style={{animation: `slideUp 0.6s ease-out ${idx * 0.1}s both`}}
                >
                  {category.image_url ? (
                    <div className="w-full h-full flex items-center justify-center p-4">
                      <div className="relative w-full h-full">
                        <Image
                          src={category.image_url}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center">
                      <span className="text-6xl text-sky-400">📦</span>
                    </div>
                  )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-all duration-500 group-hover:from-indigo-900/70 group-hover:via-sky-900/30">
                </div>
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="text-center transform transition-all duration-500 group-hover:scale-105">
                    <h3 className="text-white text-lg font-bold drop-shadow-lg mb-1">
                      {category.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1 text-white/90 font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 text-sm transform translate-y-2 group-hover:translate-y-0">
                      <span>Explore</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                  <div className="absolute inset-0 ring-2 ring-transparent group-hover:ring-sky-400 transition-all duration-500 rounded-xl"></div>
                </div>
              </Link>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Categories;