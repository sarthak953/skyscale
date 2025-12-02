'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface PreorderFile {
  id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size_bytes: number;
}

interface PreorderDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  quantity: number;
  scale: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  preorder_files: PreorderFile[];
  users?: { email: string; first_name?: string; last_name?: string };
}

export default function PreorderDetailPage() {
  const params = useParams();
  const [preorder, setPreorder] = useState<PreorderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [mounted, setMounted] = useState(false);

  const statuses = ['new', 'reviewed', 'quoted', 'converted', 'closed'];

  useEffect(() => {
    setMounted(true);
    if (params.id) {
      fetchPreorder();
    }
  }, [params.id]);

  const fetchPreorder = async () => {
    try {
      const response = await fetch(`/api/admin/preorders/${params.id}`);
      const data = await response.json();
      setPreorder(data);
    } catch (error) {
      console.error('Failed to fetch preorder:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/preorders/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const updatedPreorder = await response.json();
        setPreorder(updatedPreorder);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  if (loading) {
    return <div className="p-8 text-center">Loading preorder details...</div>;
  }

  if (!preorder) {
    return <div className="p-8 text-center text-red-600">Preorder not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin/preorders" className="text-blue-600 hover:text-blue-800">
          ← Back to Preorders
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold">Preorder Details</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Status:</span>
            <select
              value={preorder.status}
              onChange={(e) => updateStatus(e.target.value)}
              disabled={updating}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold mb-3">Customer Information</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Name:</strong> {preorder.name}</div>
              <div><strong>Email:</strong> {preorder.email}</div>
              <div><strong>Phone:</strong> {preorder.phone}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Order Details</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Quantity:</strong> {preorder.quantity}</div>
              <div><strong>Scale:</strong> {preorder.scale || 'Not specified'}</div>
              <div><strong>Created:</strong> {mounted ? new Date(preorder.created_at).toLocaleString() : preorder.created_at}</div>
              <div><strong>Updated:</strong> {mounted ? new Date(preorder.updated_at).toLocaleString() : preorder.updated_at}</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-3">Description</h3>
          <div className="bg-gray-50 p-4 rounded text-sm">
            {preorder.description}
          </div>
        </div>

        {preorder.preorder_files.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Uploaded Files</h3>
            <div className="space-y-2">
              {preorder.preorder_files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{file.file_name}</div>
                    <div className="text-sm text-gray-500">
                      {file.file_type} • {formatFileSize(file.file_size_bytes)}
                    </div>
                  </div>
                  <a
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    View/Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}