'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BestSeller } from '@/types';

const BestSellers = () => {
  const [products, setProducts] = useState<BestSeller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await fetch('/api/best-sellers');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching best sellers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-500 border-t-transparent absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-full px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent mb-1">Best Sellers</h2>
            <p className="text-gray-600 text-lg">Our most popular products</p>
          </div>
          <Link 
            href="/products" 
            className="group flex items-center gap-2 text-sky-600 hover:text-indigo-600 font-semibold transition-all text-sm"
          >
            View More
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product, idx) => (
            <Link key={product.id} href={`/products/${product.slug}`}>
              <div 
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-sky-200 cursor-pointer"
                style={{animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`}}
              >
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                  <div className="relative w-full h-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute top-3 right-3 bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Best Seller
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-sky-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-gray-900">₹{product.price.toFixed(2)}</p>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = '/cart';
                      }}
                      className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-base font-medium transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
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

export default BestSellers;