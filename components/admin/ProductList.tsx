"use client";

import { useState } from "react";

interface Product {
  id: string;
  name: string;
  price_cents: number;
  stock_quantity: number;
  categories?: { name: string };
  status: string;
  is_bestseller?: boolean;
}

interface ProductListProps {
  products: Product[];
  onProductUpdated: () => void;
}

export default function ProductList({ products, onProductUpdated }: ProductListProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatingBestseller, setUpdatingBestseller] = useState<string | null>(null);

  const toggleBestseller = async (productId: string, currentValue: boolean) => {
    setUpdatingBestseller(productId);
    try {
      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId, is_bestseller: !currentValue }),
      });
      if (response.ok) {
        onProductUpdated();
      }
    } catch (error) {
      console.error('Failed to update bestseller status:', error);
    } finally {
      setUpdatingBestseller(null);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        onProductUpdated();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (product: Product) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      
      if (response.ok) {
        setEditingProduct(null);
        onProductUpdated();
      }
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Products</h3>
            <p className="text-sm text-gray-600 mt-1">{products.length} total products</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold">
              {products.filter(p => p.status === 'published').length} Published
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-slate-50">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Price</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Stock</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-8 py-4 text-center text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50">⭐ Bestseller</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product, index) => (
              <tr 
                key={product.id} 
                className={`hover:bg-blue-50 transition-colors ${
                  editingProduct?.id === product.id ? 'bg-blue-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-8 py-5 whitespace-nowrap">
                  {editingProduct?.id === product.id ? (
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                      className="border-2 border-blue-300 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                  )}
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    {product.categories?.name || 'Uncategorized'}
                  </span>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  {editingProduct?.id === product.id ? (
                    <input
                      type="number"
                      value={editingProduct.price_cents}
                      onChange={(e) => setEditingProduct({...editingProduct, price_cents: Number(e.target.value)})}
                      className="border-2 border-blue-300 px-3 py-2 rounded-lg w-28 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="text-sm font-bold text-gray-900">
                      ₹{(product.price_cents / 100).toFixed(2)}
                    </div>
                  )}
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  {editingProduct?.id === product.id ? (
                    <input
                      type="number"
                      value={editingProduct.stock_quantity}
                      onChange={(e) => setEditingProduct({...editingProduct, stock_quantity: Number(e.target.value)})}
                      className="border-2 border-blue-300 px-3 py-2 rounded-lg w-20 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                        product.stock_quantity > 10 
                          ? 'bg-green-100 text-green-700' 
                          : product.stock_quantity > 0 
                          ? 'bg-yellow-100 text-yellow-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.stock_quantity}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full ${
                    product.status === 'published' 
                      ? 'bg-green-100 text-green-700 ring-2 ring-green-200' 
                      : 'bg-gray-100 text-gray-700 ring-2 ring-gray-200'
                  }`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      product.status === 'published' ? 'bg-green-500' : 'bg-gray-500'
                    }`}></span>
                    {product.status}
                  </span>
                </td>
                <td className="px-8 py-5 whitespace-nowrap bg-blue-50">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => toggleBestseller(product.id, product.is_bestseller || false)}
                      disabled={updatingBestseller === product.id}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all shadow-sm ${
                        product.is_bestseller ? 'bg-blue-600' : 'bg-gray-300'
                      } ${updatingBestseller === product.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                      title={product.is_bestseller ? 'Remove from bestsellers' : 'Mark as bestseller'}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow ${
                          product.is_bestseller ? 'translate-x-8' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-sm font-medium">
                  {editingProduct?.id === product.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateProduct(editingProduct)}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Save
                      </button>
                      <button
                        onClick={() => setEditingProduct(null)}
                        className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {products.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500 text-lg font-medium">No products found</p>
            <p className="text-gray-400 text-sm mt-1">Add your first product to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}