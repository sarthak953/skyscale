interface OrderFilterProps {
  onFilter: (status: string) => void;
}

export default function OrderFilter({ onFilter }: OrderFilterProps) {
  const statuses = [
    { value: 'all', label: 'All Orders' },
    { value: 'OrderConfirmed', label: 'Pending' },
    { value: 'InProduction', label: 'Processing' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Completed', label: 'Completed' },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Filter Orders</h2>
      <div className="flex flex-wrap gap-3">
        {statuses.map((status) => (
          <button
            key={status.value}
            onClick={() => onFilter(status.value)}
            className="px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-full 
                       bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-200 
                       hover:text-blue-700 transition-all shadow-sm focus:ring-2 focus:ring-blue-200"
          >
            {status.label}
          </button>
        ))}
      </div>
    </div>
  );
}
