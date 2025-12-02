'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

export default function AdminPreordersPage() {
  const [preorders, setPreorders] = useState<Preorder[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchPreorders();
  }, []);

  const fetchPreorders = async () => {
    try {
      const response = await fetch('/api/admin/preorders');
      const data = await response.json();
      setPreorders(data);
    } catch (error) {
      console.error('Failed to fetch preorders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'quoted': return 'bg-purple-100 text-purple-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading preorders...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Admin Panel
          </Link>
          <h1 className="text-3xl font-bold">Preorder Management</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {preorders.map((preorder) => (
                <tr key={preorder.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{preorder.name}</div>
                      <div className="text-sm text-gray-500">{preorder.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {preorder.phone}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div><strong>Qty:</strong> {preorder.quantity}</div>
                      <div><strong>Scale:</strong> {preorder.scale || 'N/A'}</div>
                      <div className="text-gray-500 truncate max-w-xs">
                        {preorder.description?.substring(0, 50)}...
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(preorder.status)}`}>
                      {preorder.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {mounted ? new Date(preorder.created_at).toLocaleDateString() : preorder.created_at.split('T')[0]}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/preorders/${preorder.id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {preorders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No preorders found
          </div>
        )}
      </div>
    </div>
  );
}