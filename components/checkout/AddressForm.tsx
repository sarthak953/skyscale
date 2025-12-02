'use client';

import { useState, useEffect } from 'react';

interface AddressFormProps {
  onNext: (address: any) => void;
}

export default function AddressForm({ onNext }: AddressFormProps) {
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [address, setAddress] = useState({
    name: '',
    email: '',
    phone: '',
    pincode: '',
    street_line1: '',
    street_line2: '',
    city: '',
    state: '',
    country: 'India',
    saveAddress: true
  });

  useEffect(() => {
    fetchSavedAddresses();
  }, []);

  const fetchSavedAddresses = async () => {
    try {
      const response = await fetch('/api/user-addresses');
      const data = await response.json();
      setSavedAddresses(data.addresses || []);
      if (data.addresses?.length === 0) {
        setShowNewForm(true);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      setShowNewForm(true);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    let finalAddress = address;
    
    if (selectedAddressId) {
      const selected = savedAddresses.find(addr => addr.id === selectedAddressId);
      if (selected) {
        finalAddress = {
          name: selected.recipient_name,
          email: address.email,
          phone: address.phone,
          pincode: selected.postal_code,
          street_line1: selected.street_line1,
          street_line2: selected.street_line2 || '',
          city: selected.city,
          state: selected.state,
          country: selected.country,
          saveAddress: false
        };
      }
    }
    
    onNext(finalAddress);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">Shipping Address</h2>
      
      {savedAddresses.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium mb-3">Saved Addresses</h3>
          <div className="space-y-2">
            {savedAddresses.map((addr) => (
              <div key={addr.id} className="flex items-start p-3 border rounded hover:bg-gray-50">
                <input
                  type="radio"
                  name="savedAddress"
                  value={addr.id}
                  checked={selectedAddressId === addr.id}
                  onChange={(e) => {
                    setSelectedAddressId(e.target.value);
                    setShowNewForm(false);
                  }}
                  className="mt-1 mr-3"
                />
                <div className="flex-1 text-sm">
                  <div className="font-medium">{addr.recipient_name}</div>
                  <div>{addr.street_line1}</div>
                  {addr.street_line2 && <div>{addr.street_line2}</div>}
                  <div>{addr.city}, {addr.state} {addr.postal_code}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAddressId(addr.id);
                      setAddress({
                        name: addr.recipient_name,
                        email: address.email,
                        phone: address.phone,
                        pincode: addr.postal_code,
                        street_line1: addr.street_line1,
                        street_line2: addr.street_line2 || '',
                        city: addr.city,
                        state: addr.state,
                        country: addr.country,
                        saveAddress: true
                      });
                      setShowNewForm(true);
                      setSelectedAddressId('');
                    }}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm('Delete this address?')) {
                        await fetch(`/api/user-addresses?id=${addr.id}`, { method: 'DELETE' });
                        fetchSavedAddresses();
                      }
                    }}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="savedAddress"
                value="new"
                checked={showNewForm}
                onChange={() => {
                  setShowNewForm(true);
                  setSelectedAddressId('');
                  setEditingAddressId(null);
                  setAddress({
                    name: '',
                    email: '',
                    phone: '',
                    pincode: '',
                    street_line1: '',
                    street_line2: '',
                    city: '',
                    state: '',
                    country: 'India',
                    saveAddress: true
                  });
                }}
                className="mr-3"
              />
              <span className="font-medium">Add New Address</span>
            </label>
          </div>
        </div>
      )}
      
      {showNewForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={address.name}
              onChange={(e) => setAddress({...address, name: e.target.value})}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={address.email}
              onChange={(e) => setAddress({...address, email: e.target.value})}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number *</label>
          <input
            type="tel"
            required
            value={address.phone}
            onChange={(e) => setAddress({...address, phone: e.target.value})}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address Line 1 *</label>
          <input
            type="text"
            required
            value={address.street_line1}
            onChange={(e) => setAddress({...address, street_line1: e.target.value})}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
            placeholder="House/Flat No., Building Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address Line 2</label>
          <input
            type="text"
            value={address.street_line2}
            onChange={(e) => setAddress({...address, street_line2: e.target.value})}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
            placeholder="Area, Landmark"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City *</label>
            <input
              type="text"
              required
              value={address.city}
              onChange={(e) => setAddress({...address, city: e.target.value})}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State *</label>
            <input
              type="text"
              required
              value={address.state}
              onChange={(e) => setAddress({...address, state: e.target.value})}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pincode *</label>
            <input
              type="text"
              required
              value={address.pincode}
              onChange={(e) => setAddress({...address, pincode: e.target.value})}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="saveAddress"
            checked={address.saveAddress}
            onChange={(e) => setAddress({...address, saveAddress: e.target.checked})}
            className="mr-2"
          />
          <label htmlFor="saveAddress" className="text-sm text-gray-700">
            Save this address for future orders
          </label>
        </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Continue to Payment
          </button>
        </form>
      )}
      
      {!showNewForm && selectedAddressId && (
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Continue to Payment
        </button>
      )}
    </div>
  );
}