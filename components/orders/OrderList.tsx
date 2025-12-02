'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Order } from '@/types/order';
import { Preorder } from '@/types/preorder';
import OrderFilter from './OrderFilter';
import PreorderFilter from './PreorderFilter';
import OrderCard from './OrderCard';
import OrderDetails from './OrderDetails';
import PreorderCard from './PreorderCard';
import PreorderDetails from './PreorderDetails';

export default function OrderList() {
  const { isSignedIn, isLoaded } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [preorders, setPreorders] = useState<Preorder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filteredPreorders, setFilteredPreorders] = useState<Preorder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedPreorder, setSelectedPreorder] = useState<Preorder | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'preorders'>('orders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    fetchPreorders();
  }, []);

  const fetchOrders = async (status?: string) => {
    try {
      const url = status ? `/api/orders?status=${status}` : '/api/orders';
      const response = await fetch(url);
      if (!response.ok) {
        setOrders([]);
        setFilteredOrders([]);
        return;
      }
      const data = await response.json();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreorders = async (status?: string) => {
    try {
      const url = status ? `/api/preorder/my-preorders?status=${status}` : '/api/preorder/my-preorders';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setPreorders(data);
        setFilteredPreorders(data);
      } else {
        setPreorders([]);
        setFilteredPreorders([]);
      }
    } catch (error) {
      console.error('Failed to fetch preorders:', error);
      setPreorders([]);
      setFilteredPreorders([]);
    }
  };

  const handleFilter = (status: string) => {
    fetchOrders(status === 'all' ? undefined : status);
  };

  const handlePreorderFilter = (status: string) => {
    fetchPreorders(status === 'all' ? undefined : status);
  };

  if (selectedOrder) {
    return (
      <OrderDetails 
        order={selectedOrder} 
        onBack={() => setSelectedOrder(null)} 
      />
    );
  }

  if (selectedPreorder) {
    return (
      <PreorderDetails 
        preorder={selectedPreorder} 
        onBack={() => setSelectedPreorder(null)} 
      />
    );
  }

  if (!isLoaded) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">My Orders</h1>
        <p className="text-gray-600 mb-6">Please sign in to view your orders</p>
        <a href="/sign-in" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'orders'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('preorders')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'preorders'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Preorders ({preorders.length})
        </button>
      </div>
      
      {activeTab === 'orders' && <OrderFilter onFilter={handleFilter} />}
      {activeTab === 'preorders' && <PreorderFilter onFilter={handlePreorderFilter} />}
      
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="space-y-4">
          {activeTab === 'orders' ? (
            <>
              {filteredOrders.map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onClick={() => setSelectedOrder(order)} 
                />
              ))}
              {filteredOrders.length === 0 && (
                <div className="text-center py-8 text-gray-500">No orders found</div>
              )}
            </>
          ) : (
            <>
              {filteredPreorders.map((preorder) => (
                <PreorderCard 
                  key={preorder.id} 
                  preorder={preorder} 
                  onClick={() => setSelectedPreorder(preorder)} 
                />
              ))}
              {filteredPreorders.length === 0 && (
                <div className="text-center py-8 text-gray-500">No preorders found</div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}