import React, { useState } from 'react';
import { FaCheckCircle, FaSpinner, FaMapMarkerAlt, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const OrderConfirmation = ({ cartItems, selectedAddress, totalAmount, userId, paymentMethod, onOrderPlaced, orderData: initialOrderData }) => {
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(initialOrderData);
  const { clearCart } = useCart();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const discountAmount = totalAmount * 0.25;
  const shippingCharges = totalAmount > 1000 ? 0 : 50; // Free shipping above ₹1000
  const finalAmount = totalAmount - discountAmount + shippingCharges;

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    setLoading(true);

    try {
      // Prepare order items
      const orderItems = cartItems.map(item => ({
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity
      }));

      // Create order
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          address_id: selectedAddress.id,
          items: orderItems,
          total_amount: totalAmount,
          discount_amount: discountAmount,
          shipping_charges: shippingCharges,
          final_amount: finalAmount,
          payment_method: paymentMethod || 'cod',
          notes: ''
        })
      });

      // Handle non-JSON or empty response (e.g. server crash, proxy error)
      const text = await response.text();
      let result;
      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        console.error('Server returned non-JSON:', text?.slice(0, 200));
        setLoading(false);
        alert(`Server error (${response.status}). Check console. Response: ${text?.slice(0, 100) || 'empty'}`);
        return;
      }

      if (result.success) {
        setOrderData(result.data);
        onOrderPlaced(result.data);
        clearCart(); // Clear cart after successful order
      } else {
        let errorMsg = result.error || result.message || (typeof result.details === 'string' ? result.details : '') || 'Failed to place order. Please try again.';
        if (result.hint) errorMsg += '\n\n' + result.hint;
        console.error('Order error:', result);
        alert(errorMsg);
      }
    } catch (error) {
      console.error('Order request failed:', error);
      alert(error.message || 'Network error or server down. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderData) {
    const amount = orderData.final_amount ?? orderData.total_amount ?? 0;
    return (
      <div className="text-center py-8">
        <div className="mb-6">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h3>
          <p className="text-gray-600">Your order has been confirmed and will be delivered soon.</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-600">Order Number:</span>
              <p className="text-lg font-bold text-primary">{orderData.order_number ?? '—'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Total Amount:</span>
              <p className="text-lg font-bold text-gray-900">₹{Number(amount).toLocaleString('en-IN')}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Payment Method:</span>
              <p className="text-gray-900 capitalize">{orderData.payment_method ?? 'COD'}</p>
            </div>
            {selectedAddress && (
              <div>
                <span className="text-sm font-medium text-gray-600">Delivery Address:</span>
                <p className="text-gray-900">
                  {selectedAddress.receiver_name}, {selectedAddress.receiver_phone}
                  <br />
                  {selectedAddress.address_line1}
                  {selectedAddress.address_line2 ? `, ${selectedAddress.address_line2}` : ''}
                  <br />
                  {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postal_code}
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600">
          You will receive an order confirmation email shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Review Your Order</h3>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaShoppingBag className="text-primary" />
          Order Summary
        </h4>
        <div className="space-y-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
              </div>
              <p className="font-semibold text-gray-900">
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaMapMarkerAlt className="text-primary" />
          Delivery Address
        </h4>
        {selectedAddress && (
          <div className="text-sm text-gray-700">
            <p className="font-medium">{selectedAddress.receiver_name}</p>
            <p>{selectedAddress.receiver_phone}</p>
            <p className="mt-2">
              {selectedAddress.address_line1}
              {selectedAddress.address_line2 && `, ${selectedAddress.address_line2}`}
            </p>
            <p>
              {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postal_code}
            </p>
            <p>{selectedAddress.country}</p>
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Price Breakdown</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span>₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Discount (25%):</span>
            <span>-₹{discountAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Shipping:</span>
            <span>
              {shippingCharges === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                `₹${shippingCharges.toLocaleString('en-IN')}`
              )}
            </span>
          </div>
          <div className="border-t border-gray-300 pt-2 mt-2">
            <div className="flex justify-between text-lg font-bold text-primary">
              <span>Total:</span>
              <span>₹{finalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={loading || !selectedAddress}
        className="w-full px-6 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" />
            Placing Order...
          </>
        ) : (
          <>
            <FaCheckCircle />
            Place Order
          </>
        )}
      </button>
    </div>
  );
};

export default OrderConfirmation;

