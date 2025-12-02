'use client';

import { Preorder } from '@/types/preorder';

interface PreorderCardProps {
  preorder: Preorder;
  onClick: () => void;
}

export default function PreorderCard({ preorder, onClick }: PreorderCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'quoted': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'converted': return 'bg-green-100 text-green-800 border-green-300';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-gradient-to-br from-white via-orange-50 to-amber-50 border border-gray-200 
                 rounded-2xl shadow-md hover:shadow-2xl hover:border-orange-500 transition-all duration-300 
                 cursor-pointer overflow-hidden hover:-translate-y-1"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="p-6 space-y-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 tracking-wide">
              Preorder Request
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Submitted on {new Date(preorder.created_at).toLocaleDateString('en-IN')}
            </p>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium border shadow-sm ${getStatusColor(preorder.status)}`}>
            {preorder.status.charAt(0).toUpperCase() + preorder.status.slice(1)}
          </span>
        </div>

        <div className="border-t border-gray-200"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500 block">Description</span>
            <p className="font-semibold text-gray-900 mt-1 truncate">
              {preorder.description || 'No description'}
            </p>
          </div>
          {preorder.scale && (
            <div>
              <span className="text-gray-500 block">Scale</span>
              <p className="font-semibold text-gray-900 mt-1">{preorder.scale}</p>
            </div>
          )}
          {preorder.quantity && (
            <div>
              <span className="text-gray-500 block">Quantity</span>
              <p className="font-semibold text-gray-900 mt-1">{preorder.quantity}</p>
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-orange-400 transition-all duration-300 pointer-events-none"></div>
    </div>
  );
}