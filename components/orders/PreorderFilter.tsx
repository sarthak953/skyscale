interface PreorderFilterProps {
  onFilter: (status: string) => void;
}

export default function PreorderFilter({ onFilter }: PreorderFilterProps) {
  const statuses = [
    { value: 'all', label: 'All Preorders' },
    { value: 'new', label: 'New' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'quoted', label: 'Quoted' },
    { value: 'converted', label: 'Converted' },
    { value: 'closed', label: 'Closed' },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Filter Preorders</h2>
      <div className="flex flex-wrap gap-3">
        {statuses.map((status) => (
          <button
            key={status.value}
            onClick={() => onFilter(status.value)}
            className="px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-full 
                       bg-white text-gray-700 hover:bg-orange-50 hover:border-orange-200 
                       hover:text-orange-700 transition-all shadow-sm focus:ring-2 focus:ring-orange-200"
          >
            {status.label}
          </button>
        ))}
      </div>
    </div>
  );
}
