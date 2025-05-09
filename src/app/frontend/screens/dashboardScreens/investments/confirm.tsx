'use client'
import React, { useState, useEffect } from 'react';
import { 
  Bitcoin, 
  Copy, 
  Check, 
  CircleAlert,
  ArrowRight,
  Wallet,
  Clock,
  TrendingUp
} from 'lucide-react';
import plans from '@/app/lib/plans';

interface PaymentConfirmationProps {
    amount: string;
    onProceed: (amount: string) => void;
    planID: string;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({ amount, onProceed, planID }) => {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [transactionConfirmed, setTransactionConfirmed] = useState(false);
  const [roi, setRoi] = useState({ percentage: 0, profit: '0' });

  const userData = localStorage.getItem('userData');
  const token = localStorage.getItem('token');

  // Find the selected plan
  const selectedPlan = plans.find(plan => plan.id === planID);

  // Calculate ROI based on plan and amount
  useEffect(() => {
    if (selectedPlan && amount) {
      const investmentAmount = parseFloat(amount);
      const roiPercentage = selectedPlan.monthlyPrice; // This is the ROI percentage from the plan
      const profitAmount = (investmentAmount * roiPercentage / 100).toFixed(2);
      
      setRoi({
        percentage: roiPercentage,
        profit: profitAmount
      });
    }
  }, [selectedPlan, amount]);

  // Hardcoded for example - in real app, this would be dynamically generated
  const cryptoAddress = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
  
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(cryptoAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleProceed = async () => {
    try {
      const response = await fetch("/api/invest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Assuming token is needed for authentication
        },
        body: JSON.stringify({ 
          plan: planID, 
          amount, 
          userData,
          roi: {
            percentage: roi.percentage,
            profit: roi.profit
          }
        })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Success:", result);


      console.log('these are the investments', result.investments);
      localStorage.setItem('userData', JSON.stringify(result.updatedUser));
      localStorage.setItem('investments', JSON.stringify(result.investments));
      localStorage.setItem('notifications',JSON.stringify(result.notifications));
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error sending data:", error.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Complete Your Payment
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Follow these steps to finalize your investment
        </p>
      </div>

      <div className="max-w-3xl mx-auto shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <div className="bg-white p-6">
          {/* Investment and ROI summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Investment amount card */}
            <div className="bg-blue-50 rounded-lg p-4 flex items-center space-x-4">
              <div className="bg-red-500 rounded-full p-3">
                <Bitcoin className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-red-700 font-medium">Investment Amount</p>
                <h3 className="text-2xl font-bold text-gray-900">${amount} USDT</h3>
              </div>
            </div>
            
            {/* ROI card */}
            <div className="bg-green-50 rounded-lg p-4 flex items-center space-x-4">
              <div className="bg-green-500 rounded-full p-3">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-700 font-medium">Expected ROI ({roi.percentage}%)</p>
                <h3 className="text-2xl font-bold text-gray-900">${roi.profit}</h3>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Wallet address section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-gray-700 font-medium">
                  Send to this wallet address
                </label>
                <span className="text-xs text-gray-500 flex items-center">
                  <Wallet className="w-3 h-3 mr-1" /> USDT (TRC-20)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-grow relative">
                  <input 
                    type="text" 
                    value={cryptoAddress}
                    readOnly
                    className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-mono text-sm"
                  />
                  <button 
                    onClick={handleCopyAddress}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 bg-white rounded-md p-1"
                    aria-label="Copy address"
                  >
                    {copiedAddress ? 
                      <div className="flex items-center text-green-500 text-xs font-medium">
                        <Check className="w-4 h-4 mr-1" /> Copied
                      </div> : 
                      <div className="flex items-center text-gray-400 text-xs font-medium">
                        <Copy className="w-4 h-4 mr-1" /> Copy
                      </div>
                    }
                  </button>
                </div>
              </div>
            </div>

            {/* Payment steps */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <CircleAlert className="w-5 h-5 text-yellow-600 mr-2" />
                <h4 className="font-medium text-yellow-800">Payment Instructions</h4>
              </div>
              <ol className="text-yellow-700 text-sm space-y-2 pl-5 list-decimal">
                <li>Copy the wallet address above</li>
                <li>Send exactly <span className="font-medium">${amount} USDT</span> to this address</li>
                <li>Wait for network confirmation (typically 5-20 minutes)</li>
                <li>Check the box below and click &apos;Confirm Transaction&apos;</li>
              </ol>
            </div>

            {/* Transaction verification info */}
            <div className="flex items-start space-x-3 border-t border-gray-100 pt-4">
              <Clock className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">
                  Our system will verify your transaction automatically. This typically takes 1-2 hours. You&apos;ll receive a confirmation email once processed.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6">
          <div className="flex items-center mb-4">
            <input 
              type="checkbox" 
              id="confirmTransaction"
              checked={transactionConfirmed}
              onChange={() => setTransactionConfirmed(!transactionConfirmed)}
              className="w-5 h-5 mr-3 rounded text-red-600 focus:ring-red-500"
            />
            <label htmlFor="confirmTransaction" className="text-gray-700">
              I confirm that I have completed the USDT transfer
            </label>
          </div>
          <button 
            onClick={() => {
              onProceed(amount);
              handleProceed();
            }}
            disabled={!transactionConfirmed}
            className={`
              w-full py-3 rounded-lg transition-all duration-200 flex items-center justify-center
              ${transactionConfirmed 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
            `}
          >
            <span className="mr-2">Confirm Transaction</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-center text-gray-500 mt-3">
            Need help? Contact our support team 24/7
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;