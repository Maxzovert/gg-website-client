import React, { useState } from 'react';
import { FaCreditCard, FaUniversity, FaMobileAlt } from 'react-icons/fa';

const PaymentOptions = ({ totalAmount, onPaymentSelect }) => {
  const [selectedMethod, setSelectedMethod] = useState('');

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: FaCreditCard,
      description: 'Pay using your credit or debit card'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: FaMobileAlt,
      description: 'Pay using UPI (PhonePe, Google Pay, etc.)'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: FaUniversity,
      description: 'Pay using your bank account'
    }
  ];

  const handleSelect = (methodId) => {
    setSelectedMethod(methodId);
    onPaymentSelect(methodId);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Select Payment Method</h3>
      
      <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Total Amount:</span>
          <span className="text-2xl font-bold text-primary">
            ₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <div
              key={method.id}
              onClick={() => handleSelect(method.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon className="text-xl" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{method.name}</h4>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedMethod && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Selected:</strong> {paymentMethods.find(m => m.id === selectedMethod)?.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentOptions;

