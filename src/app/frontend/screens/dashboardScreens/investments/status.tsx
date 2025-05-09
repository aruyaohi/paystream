

// export default TransactionConfirmation;
import React, { useEffect, useState } from 'react';
import { CreditCard, Clock, CheckCircle2, ArrowLeft } from 'lucide-react';
import plans from '@/app/lib/plans';

interface SelectedProps {
  amount: string;
  planID: string;
}

const TransactionConfirmation: React.FC<SelectedProps> = ({ amount, planID }) => {
  const [selectedPlan, setSelectedPlan] = useState(() => plans.find(plan => plan.id === planID) || null);

  useEffect(() => {
    setSelectedPlan(plans.find(plan => plan.id === planID) || null);
  }, [planID]);


  console.log(selectedPlan);
  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-md mx-auto shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <div className="bg-green-500 p-6 text-center">
          <div className="bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle2 className="text-green-500 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Request Sent</h2>
          <p className="text-blue-100 text-sm">
            Your payment has been successfully processed and is awaiting approval from management.
          </p>
        </div>

        <div className="bg-white p-6">
          <div className="bg-green-50 rounded-lg p-4 flex items-center justify-between mb-6">
            <span className="text-sm text-green-700">Total Amount</span>
            <span className="text-2xl font-bold text-gray-900">${amount} <span className="text-sm font-medium">USDT</span></span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <CreditCard className="text-green-600 w-4 h-4" />
                </div>
                <span className="text-sm text-gray-700">Transaction ID</span>
              </div>
              <span className="font-mono text-xs text-gray-600">TX-USDT-20240328-9F3A2</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Clock className="text-green-600 w-4 h-4" />
                </div>
                <span className="text-sm text-gray-700">Date & Time</span>
              </div>
              <span className="text-sm text-gray-800">March 28, 2024, 14:37:22 UTC</span>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium block mb-1">What&apos;s next?</span>
              Your investment has been confirmed and is now being allocated according to your portfolio strategy. You can track its performance in your dashboard.
            </p>
          </div>

          <div className="mt-4 text-center">
            <button className="text-blue-600 text-sm font-medium hover:text-blue-800">Download Receipt</button>
          </div>
        </div>

        <div className="bg-gray-50 p-6">
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Back to Dashboard</span>
          </button>
          <p className="text-xs text-center text-gray-500 mt-3">Need help? Contact our support team 24/7</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionConfirmation;
