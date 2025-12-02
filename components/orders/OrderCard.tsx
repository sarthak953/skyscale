import { Order } from '@/types/order';
import { useRouter } from 'next/navigation';

interface OrderCardProps {
  order: Order;
  onClick?: () => void;
}

export default function OrderCard({ order, onClick }: OrderCardProps) {
  const router = useRouter();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/orders/${order.id}`);
    }
  };

  const latestTracking = order.order_tracking?.[0];
  const trackingStatus = latestTracking?.status || 'OrderConfirmed';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OrderConfirmed': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'DesignInProgress': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'InReview': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'DesignApproved': return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'InProduction': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'QualityCheck': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Packaging': return 'bg-violet-100 text-violet-800 border-violet-300';
      case 'Shipped': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-300';
      case 'Completed': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <div
      onClick={handleClick}
      className="group relative bg-gradient-to-br from-white via-blue-50 to-indigo-50 border border-gray-200 
                 rounded-2xl shadow-md hover:shadow-2xl hover:border-blue-500 transition-all duration-300 
                 cursor-pointer overflow-hidden hover:-translate-y-1"
    >
      {/* Gradient Accent on Hover */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 tracking-wide">
              Order #{order.order_number}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {new Date(order.placed_at).toLocaleDateString('en-IN')}
            </p>
          </div>
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-medium border shadow-sm ${getStatusColor(trackingStatus)}`}
          >
            {formatStatus(trackingStatus)}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <span className="text-gray-500 block">Total</span>
            <p className="font-semibold text-gray-900 mt-1">
              ₹{(order.total_cents / 100).toFixed(2)}
            </p>
          </div>

          <div>
            <span className="text-gray-500 block">Payment</span>
            <p className="font-semibold text-gray-900 capitalize mt-1">
              {order.payment_method}
            </p>
          </div>

          <div>
            <span className="text-gray-500 block">Items</span>
            <p className="font-semibold text-gray-900 mt-1">
              {order.order_items?.length || 0}
            </p>
          </div>

          <div>
            <span className="text-gray-500 block">Customer</span>
            <p className="font-semibold text-gray-900 mt-1 truncate">
              {order.users?.email || order.guest_email}
            </p>
          </div>
        </div>
      </div>

      {/* Hover Outline Highlight */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400 transition-all duration-300 pointer-events-none"></div>
    </div>
  );
}
