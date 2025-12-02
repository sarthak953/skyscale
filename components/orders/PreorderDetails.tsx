'use client';

import { Preorder } from '@/types/preorder';

interface PreorderDetailsProps {
  preorder: Preorder;
  onBack: () => void;
}

export default function PreorderDetails({ preorder, onBack }: PreorderDetailsProps) {
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 hover:text-orange-700 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Orders
      </button>

      <div className="bg-white rounded-2xl shadow-sm border-2 border-orange-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Preorder Request</h1>
            <p className="text-gray-500 text-sm">
              Submitted on {new Date(preorder.created_at).toLocaleDateString('en-IN')}
            </p>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-sm ${getStatusColor(preorder.status)}`}>
            {preorder.status.charAt(0).toUpperCase() + preorder.status.slice(1)}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-3 text-gray-800">Request Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-600">Description:</span>
                <p className="text-gray-900 mt-1">{preorder.description || 'No description provided'}</p>
              </div>
              {preorder.scale && (
                <div>
                  <span className="font-medium text-gray-600">Scale:</span>
                  <p className="text-gray-900">{preorder.scale}</p>
                </div>
              )}
              {preorder.quantity && (
                <div>
                  <span className="font-medium text-gray-600">Quantity:</span>
                  <p className="text-gray-900">{preorder.quantity}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-gray-800">Contact Information</h3>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
              <p className="font-medium text-gray-900">{preorder.name}</p>
              <p className="text-sm text-gray-700">{preorder.email}</p>
              {preorder.phone && (
                <p className="text-sm text-gray-700">Phone: {preorder.phone}</p>
              )}
            </div>
          </div>
        </div>

        {preorder.preorder_files && preorder.preorder_files.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-semibold mb-3 text-gray-800">Attached Files</h3>
            <div className="space-y-2">
              {preorder.preorder_files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{file.file_name || 'Unnamed file'}</p>
                    <p className="text-sm text-gray-500">
                      {file.file_type} • Uploaded on {new Date(file.uploaded_at).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <a
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                  >
                    View
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