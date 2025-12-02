'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface Preorder {
  id: string;
  name: string;
  email: string;
  phone: string;
  quantity: number;
  scale: string;
  description: string;
  status: string;
  created_at: string;
  preorder_files: any[];
}

export default function PreorderPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    quantity: 1,
    scale: '',
    description: ''
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState('');


  const scales = ['1:48', '1:32', '1:72', '1:144', '1:200', '1:350', '1:700', 'Custom'];

  // Auto-fill user info
  useEffect(() => {
    if (isLoaded && user) {
      setFormData(prev => ({
        ...prev,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || prev.name,
        email: user.primaryEmailAddress?.emailAddress || prev.email
      }));
    }
  }, [isLoaded, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const uploadFiles = async (files: File[]) => {
    const uploadedFiles = [];
    for (const file of files) {
      const data = new FormData();
      data.append('image', file);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: data });
        if (res.ok) {
          const json = await res.json();
          uploadedFiles.push({ url: json.url, name: file.name, type: file.type, size: file.size });
        }
      } catch (err) {
        console.error('File upload error:', err);
      }
    }
    return uploadedFiles;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const uploadedFiles = files.length > 0 ? await uploadFiles(files) : [];
      const response = await fetch('/api/preorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, files: uploadedFiles })
      });
      if (response.ok) {
        setFormData({ name: '', email: '', phone: '', quantity: 1, scale: '', description: '' });
        setFiles([]);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to submit preorder');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-20 px-4">

      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl animate-fade-in z-50">
          ✓ Preorder request submitted successfully!
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-10 transition-all">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3 text-center">
          Custom Preorder Request
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Share your custom model requirements — we’ll get back to you with a personalized quote.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-5 py-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Name *" name="name" value={formData.name} onChange={handleInputChange} required />
            <InputField label="Email *" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
          </div>

          {/* Phone, Quantity, Scale */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField label="Phone *" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
            <InputField label="Quantity *" name="quantity" type="number" min="1" value={formData.quantity} onChange={handleInputChange} required />
            <SelectField label="Scale" name="scale" value={formData.scale} onChange={handleInputChange} options={scales} />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              placeholder="Describe your model, color, materials, etc."
              className="w-full border border-gray-300 bg-white/60 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-3 rounded-xl shadow-sm transition"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Reference Files</label>
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf,.zip,.rar,.stl,.obj,.3ds"
              onChange={handleFileChange}
              className="w-full border border-gray-300 bg-white/60 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-3 rounded-xl shadow-sm cursor-pointer transition"
            />
            <p className="text-sm text-gray-500 mt-1">Upload images or design files (STL, OBJ, etc.)</p>
            {files.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm text-gray-700">
                {files.map((f, i) => (
                  <li key={i}>• {f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)</li>
                ))}
              </ul>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}

function InputField({ label, name, type = 'text', value, onChange, required = false, min }: any) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        required={required}
        className="w-full border border-gray-300 bg-white/60 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-3 rounded-xl shadow-sm transition"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }: any) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 bg-white/60 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-3 rounded-xl shadow-sm transition"
      >
        <option value="">Select</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
