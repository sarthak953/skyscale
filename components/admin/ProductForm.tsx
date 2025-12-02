"use client";

import { useState } from "react";

interface ProductFormProps {
  categoryId: string;
  onProductAdded: () => void;
}

export default function ProductForm({ categoryId, onProductAdded }: ProductFormProps) {
  const [product, setProduct] = useState({
    name: "",
    short_description: "",
    full_description: "",
    category_id: categoryId,
    scale: "",
    material: "Plastic",
    filter_type: "",
    is_rc: false,
    is_preorder: false,
    stock_quantity: 0,
    price_cents: 0,
    compare_at_price_cents: 0,
    weight_grams: 0,
    is_featured: false,
    is_trending: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [variants, setVariants] = useState([{ name: "", price_adjustment: 0, stock: 0 }]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
    
    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, imageUrl, variants }),
      });

      if (response.ok) {
        setProduct({
          name: "",
          short_description: "",
          full_description: "",
          category_id: categoryId,
          scale: "",
          material: "Plastic",
          filter_type: "",
          is_rc: false,
          is_preorder: false,
          stock_quantity: 0,
          price_cents: 0,
          compare_at_price_cents: 0,
          weight_grams: 0,
          is_featured: false,
          is_trending: false,
        });
        setImageFile(null);
        setImagePreview("");
        setVariants([{ name: "", price_adjustment: 0, stock: 0 }]);
        onProductAdded();
      } else {
        const errorData = await response.json();
        setError(errorData.error || `Error: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      setError("Network error. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <h3 className="text-2xl font-bold text-white">Add New Product</h3>
          <p className="text-blue-100 mt-1">Fill in the details to create a new product</p>
        </div>

        <div className="p-8 space-y-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 px-6 py-4 rounded-r-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-3 text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Image Upload Section */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-800">Product Image</label>
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 group-hover:text-blue-600">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              {imagePreview && (
                <div className="relative group">
                  <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 shadow-md" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-xl flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">Preview</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">1</span>
              Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Scale</label>
                <select
                  value={product.scale}
                  onChange={(e) => setProduct({ ...product, scale: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Scale</option>
                  <option value="1:12">1:12</option>
                  <option value="1:18">1:18</option>
                  <option value="1:24">1:24</option>
                  <option value="1:32">1:32</option>
                  <option value="1:35">1:35</option>
                  <option value="1:48">1:48</option>
                  <option value="1:72">1:72</option>
                  <option value="1:144">1:144</option>
                  <option value="1:200">1:200</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Material</label>
                <select
                  value={product.material}
                  onChange={(e) => setProduct({ ...product, material: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="Plastic">Plastic</option>
                  <option value="Resin">Resin</option>
                  <option value="Metal">Metal</option>
                  <option value="Wood">Wood</option>
                  <option value="Diecast">Diecast</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sub-Category (Filter Type)</label>
                <input
                  type="text"
                  placeholder="e.g., LED, Fiber Optic, Scale 1:72"
                  value={product.filter_type}
                  onChange={(e) => setProduct({ ...product, filter_type: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (grams)</label>
                <input
                  type="number"
                  placeholder="Product weight"
                  value={product.weight_grams}
                  onChange={(e) => setProduct({ ...product, weight_grams: Number(e.target.value) })}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">2</span>
              Pricing & Inventory
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-500 font-medium">₹</span>
                  <input
                    type="number"
                    placeholder="e.g., 299 for ₹299"
                    value={product.price_cents}
                    onChange={(e) => setProduct({ ...product, price_cents: Number(e.target.value) })}
                    className="w-full border border-gray-300 pl-8 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
                <input
                  type="number"
                  placeholder="Available quantity"
                  value={product.stock_quantity}
                  onChange={(e) => setProduct({ ...product, stock_quantity: Number(e.target.value) })}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">3</span>
              Product Descriptions
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Short Description</label>
                <textarea
                  placeholder="Brief product description for listings"
                  value={product.short_description}
                  onChange={(e) => setProduct({ ...product, short_description: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Description</label>
                <textarea
                  placeholder="Detailed product description with specifications"
                  value={product.full_description}
                  onChange={(e) => setProduct({ ...product, full_description: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">4</span>
              Product Variants
            </h4>
            <p className="text-sm text-gray-600">Add different variants of this product (e.g., colors, sizes, configurations)</p>
            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
              <div className="grid grid-cols-12 gap-3 px-3 mb-2">
                <div className="col-span-5 text-xs font-semibold text-gray-600 uppercase">Variant Name</div>
                <div className="col-span-3 text-xs font-semibold text-gray-600 uppercase">Price Adjustment (₹)</div>
                <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase">Stock Qty</div>
                <div className="col-span-2"></div>
              </div>
              {variants.map((variant, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-center bg-white p-3 rounded-lg border border-gray-200">
                  <input
                    type="text"
                    placeholder="e.g., Red, Large, With Decal"
                    value={variant.name}
                    onChange={(e) => {
                      const newVariants = [...variants];
                      newVariants[index].name = e.target.value;
                      setVariants(newVariants);
                    }}
                    className="col-span-5 border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="0"
                    value={variant.price_adjustment}
                    onChange={(e) => {
                      const newVariants = [...variants];
                      newVariants[index].price_adjustment = Number(e.target.value);
                      setVariants(newVariants);
                    }}
                    className="col-span-3 border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="0"
                    value={variant.stock}
                    onChange={(e) => {
                      const newVariants = [...variants];
                      newVariants[index].stock = Number(e.target.value);
                      setVariants(newVariants);
                    }}
                    className="col-span-2 border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setVariants(variants.filter((_, i) => i !== index))}
                    className="col-span-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setVariants([...variants, { name: "", price_adjustment: 0, stock: 0 }])}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
              >
                + Add Variant
              </button>
            </div>
          </div>


        </div>

        {/* Submit Section */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding Product...
              </span>
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}