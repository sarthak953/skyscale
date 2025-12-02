"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import CategoriesGrid from "@/components/admin/CategoriesGrid";
import ProductForm from "@/components/admin/ProductForm";
import CategoryForm from "@/components/admin/CategoryForm";
import ProductList from "@/components/admin/ProductList";

export default function AdminPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<{id: string, name: string} | null>(null);
  const [refreshProducts, setRefreshProducts] = useState(0);
  const [refreshCategories, setRefreshCategories] = useState(0);
  const [products, setProducts] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts();
    }
  }, [selectedCategory, refreshProducts]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/admin/products?categoryId=${selectedCategory?.id}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    setSelectedCategory({ id: categoryId, name: categoryName });
  };

  const handleProductAdded = () => {
    setRefreshProducts(prev => prev + 1);
  };

  const handleCategoryAdded = () => {
    setRefreshCategories(prev => prev + 1);
    setShowCategoryForm(false);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">Please sign in to access the admin panel.</p>
        <a href="/sign-in" className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700">
          Sign In
        </a>
      </div>
    );
  }

  const isAdmin = user?.publicMetadata?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">You do not have permission to access the admin panel.</p>
        <a href="/" className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700">
          Go to Home
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          {selectedCategory ? `${selectedCategory.name} Products` : 'Admin Panel - Categories'}
        </h1>
        <div className="flex gap-2">
          {!selectedCategory && (
            <>
              <a
                href="/admin/analytics"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                📊 Analytics
              </a>
              <a
                href="/admin/preorders"
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                📋 Preorders
              </a>
              <a
                href="/admin/orders"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                📦 Orders
              </a>
              <button
                onClick={() => setShowCategoryForm(!showCategoryForm)}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                {showCategoryForm ? 'Hide Form' : 'Add Category'}
              </button>
            </>
          )}
          {selectedCategory && (
            <button
              onClick={handleBackToCategories}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              ← Back to Categories
            </button>
          )}
        </div>
      </div>

      {!selectedCategory ? (
        <div className="space-y-6">
          {showCategoryForm && (
            <CategoryForm onCategoryAdded={handleCategoryAdded} />
          )}
          <CategoriesGrid 
            onCategorySelect={handleCategorySelect} 
            refresh={refreshCategories}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <ProductForm 
            categoryId={selectedCategory.id} 
            onProductAdded={handleProductAdded} 
          />
          <ProductList 
            products={products}
            onProductUpdated={handleProductAdded}
          />
        </div>
      )}
    </div>
  );
}