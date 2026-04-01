import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaMapMarkerAlt, FaSignOutAlt, FaTrash, FaCheck, FaWallet } from 'react-icons/fa';
import { useToast } from '../../components/Toaster';
import { apiFetch } from '../../config/api.js';

const Profile = () => {
  const { user, signOut, userId, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for auth to finish loading before checking
    if (authLoading) return;
    
    if (!user) {
      navigate('/auth', { state: { from: { pathname: '/profile' } } });
      return;
    }
    fetchUserData();
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (location.state?.openOrdersTab) setActiveTab('orders');
  }, [location.state?.openOrdersTab]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchOrders(),
        fetchAddresses(),
        fetchWalletBalance()
      ]);
    } catch (_error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await apiFetch(`/api/orders/user/${userId}`);
      const result = await response.json();
      if (result.success) {
        setOrders(result.data || []);
      }
    } catch (_error) {
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await apiFetch(`/api/addresses/user/${userId}`);
      const result = await response.json();
      if (result.success) {
        setAddresses(result.data || []);
      }
    } catch (_error) {
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const response = await apiFetch('/api/wallet/balance');
      const result = await response.json();
      if (result.success) {
        setWalletBalance(Number(result?.data?.balance || 0));
      }
    } catch (_error) {}
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const response = await apiFetch(`/api/addresses/${addressId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Address deleted successfully');
        fetchAddresses();
      } else {
        toast.error(result.message || 'Failed to delete address');
      }
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      const response = await apiFetch(`/api/addresses/${addressId}/default`, {
        method: 'PATCH',
        body: JSON.stringify({})
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Default address updated');
        fetchAddresses();
      } else {
        toast.error(result.message || 'Failed to update default address');
      }
    } catch (error) {
      toast.error('Failed to update default address');
    }
  };

  // Show loading while auth is loading or profile data is loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, show loading while redirecting
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show loading while fetching profile data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentOrders = orders.filter(order => 
    ['pending', 'processing', 'shipped'].includes(order.order_status?.toLowerCase())
  );
  const previousOrders = orders.filter(order => 
    ['delivered', 'cancelled', 'completed'].includes(order.order_status?.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50/30 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile logo */}
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary shrink-0">
              <FaUser className="text-5xl text-primary" />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user?.full_name || user?.email || 'User'}
              </h1>
              <p className="text-gray-600 mb-4">{user?.email || ''}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{orders.length}</div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{addresses.length}</div>
                  <div className="text-sm text-gray-600">Saved Addresses</div>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'overview'
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'orders'
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                <FaShoppingBag className="inline mr-2" />
                Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'addresses'
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                <FaMapMarkerAlt className="inline mr-2" />
                Addresses ({addresses.length})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Information</h2>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">User ID</label>
                      <p className="text-gray-900 font-mono text-sm">{userId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <FaWallet className="text-primary" />
                        Wallet Balance
                      </label>
                      <p className="text-gray-900 font-semibold">
                        ₹{walletBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>

                {currentOrders.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Orders</h2>
                    <div className="space-y-3">
                      {currentOrders.slice(0, 3).map(order => (
                        <div key={order.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">Order #{order.order_number}</p>
                              <p className="text-sm text-gray-600">₹{order.final_amount?.toLocaleString('en-IN')}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              order.order_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.order_status === 'processing' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {order.order_status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                {currentOrders.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Orders</h2>
                    <div className="space-y-4">
                      {currentOrders.map(order => (
                        <div key={order.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-bold text-lg">Order #{order.order_number}</p>
                              <p className="text-sm text-gray-600">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                              order.order_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.order_status === 'processing' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {order.order_status}
                            </span>
                          </div>
                          {order.order_items && order.order_items.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm font-medium text-gray-600 mb-2">Items:</p>
                              <ul className="space-y-1">
                                {order.order_items.map((item, idx) => (
                                  <li key={idx} className="text-sm text-gray-700">
                                    {item.product_name} × {item.quantity} - ₹{item.subtotal?.toLocaleString('en-IN')}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                            <p className="font-bold text-lg">Total: ₹{order.final_amount?.toLocaleString('en-IN')}</p>
                            <button
                              onClick={() => navigate(`/orders/${order.id}`)}
                              className="text-primary hover:text-primary/80 font-semibold"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {previousOrders.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Previous Orders</h2>
                    <div className="space-y-4">
                      {previousOrders.map(order => (
                        <div key={order.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-bold text-lg">Order #{order.order_number}</p>
                              <p className="text-sm text-gray-600">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                              order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.order_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.order_status}
                            </span>
                          </div>
                          {order.order_items && order.order_items.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm font-medium text-gray-600 mb-2">Items:</p>
                              <ul className="space-y-1">
                                {order.order_items.map((item, idx) => (
                                  <li key={idx} className="text-sm text-gray-700">
                                    {item.product_name} × {item.quantity} - ₹{item.subtotal?.toLocaleString('en-IN')}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                            <p className="font-bold text-lg">Total: ₹{order.final_amount?.toLocaleString('en-IN')}</p>
                            <button
                              onClick={() => navigate(`/orders/${order.id}`)}
                              className="text-primary hover:text-primary/80 font-semibold"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {orders.length === 0 && (
                  <div className="text-center py-12">
                    <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No orders yet</p>
                    <button
                      onClick={() => navigate('/')}
                      className="mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-4">
                {addresses.length > 0 ? (
                  addresses.map(address => (
                    <div key={address.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          {address.is_default && (
                            <span className="inline-block mb-2 px-3 py-1 bg-primary text-white text-sm font-semibold rounded-full">
                              Default
                            </span>
                          )}
                          <p className="font-bold text-lg mb-2">{address.receiver_name}</p>
                          <p className="text-gray-700 mb-1">{address.address_line1}</p>
                          {address.address_line2 && (
                            <p className="text-gray-700 mb-1">{address.address_line2}</p>
                          )}
                          <p className="text-gray-700 mb-1">
                            {address.city}, {address.state} - {address.postal_code}
                          </p>
                          <p className="text-gray-700 mb-1">{address.country}</p>
                          <p className="text-gray-600 text-sm">Phone: {address.receiver_phone}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          {!address.is_default && (
                            <button
                              onClick={() => handleSetDefaultAddress(address.id)}
                              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold flex items-center gap-2"
                            >
                              <FaCheck />
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold flex items-center gap-2"
                          >
                            <FaTrash />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <FaMapMarkerAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg mb-4">No saved addresses</p>
                    <button
                      onClick={() => navigate('/cart')}
                      className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Add Address
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

