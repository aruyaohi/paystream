'use client'
import React, { useState, useEffect } from 'react';
import { 
  Bitcoin, 
  ArrowRight,
  DollarSign,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import plans from '@/app/lib/plans';

interface SelectedProps {
    onProceed: (amount: string, cryptocurrency: string) => void;
    planID: string;
}

// Define cryptocurrency type
interface Cryptocurrency {
  id: string;
  name: string;
  icon: React.ReactNode;
  available: boolean;
}

const CryptoPaymentPage: React.FC<SelectedProps> = ({onProceed, planID}) => {
  // States for form values
  const [selectedCrypto, setSelectedCrypto] = useState<string>('usdt');
  const chosenPlan = plans.find(plan => planID === plan.id );
  const [amount, setAmount] = useState<string>(
    chosenPlan && chosenPlan.minInvestment !== undefined ? chosenPlan.minInvestment.toString() : "0"
  );
  const [projectedReturn, setProjectedReturn] = useState<number>(0);
  
  // Calculate projected ROI whenever amount changes
  useEffect(() => {
    if (chosenPlan && chosenPlan.monthlyPrice !== undefined) {
      const investmentAmount = parseFloat(amount) || 0;
      // Use monthlyPrice as the ROI percentage
      const returnAmount = investmentAmount * (chosenPlan.monthlyPrice / 100);
      setProjectedReturn(returnAmount);
    }
  }, [amount, chosenPlan]);

  // Available cryptocurrencies
  const cryptocurrencies: Cryptocurrency[] = [
    { 
      id: 'bitcoin', 
      name: 'Bitcoin (BTC)', 
      icon: <Bitcoin className="w-5 h-5 text-orange-500" />,
      available: false 
    },
    { 
      id: 'ethereum', 
      name: 'Ethereum (ETH)', 
      icon: <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L3 12L12 16L21 12L12 2Z" fill="currentColor"/><path d="M12 16V22L21 12L12 16Z" fill="currentColor"/><path d="M12 16L3 12L12 22V16Z" fill="currentColor"/></svg>,
      available: false 
    },
    { 
      id: 'usdt', 
      name: 'Tether (USDT)', 
      icon: <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M8 11H16V13H8V11Z" fill="white"/></svg>,
      available: true 
    },
    { 
      id: 'usdc', 
      name: 'USD Coin (USDC)', 
      icon: <DollarSign className="w-5 h-5 text-blue-500" />,
      available: false 
    }
  ];


  // Handle amount changes with minimum validation
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    
    // Calculate and update projected return immediately
    if (chosenPlan && chosenPlan.monthlyPrice !== undefined) {
      const investmentAmount = parseFloat(value) || 0;
      const returnAmount = investmentAmount * (chosenPlan.monthlyPrice / 100);
      setProjectedReturn(investmentAmount + returnAmount);
    }
  };
  // Validate amount against minimum requirement
  const isAmountValid = (): boolean => {
    const numAmount = Number(amount);
    if(chosenPlan?.minInvestment != undefined){
      return !isNaN(numAmount) && numAmount >= chosenPlan?.minInvestment;
    }
    return false;
  };

  // Select crypto if available
  const handleSelectCrypto = (cryptoId: string) => {
    const crypto = cryptocurrencies.find(c => c.id === cryptoId);
    if (crypto && crypto.available) {
      setSelectedCrypto(cryptoId);
    }
  };

  // // Extract ROI information from plan description
  // const extractROIInfo = (description: string | undefined): string => {
  //   if (!description) return "6-months";
    
  //   // Look for patterns like "X% Y-months ROI"
  //   const match = description.match(/(\d+%\s+\d+-months)/i);
  //   if (match) return match[1];
    
  //   return "6-months";
  // };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-2xl mx-auto shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <div className="bg-white p-6">   
          {/* Announcement Banner */}
          <div className="mb-6 bg-yellow-50 p-3 rounded-lg border border-yellow-200 flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-700">
              Due to technical issues, only Tether (USDT) payments are currently available. We apologize for any inconvenience.
            </p>
          </div>
          
          {/* Cryptocurrency Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Cryptocurrency</label>
            <div className="border border-gray-300 rounded-md shadow-sm">
              {cryptocurrencies.map((crypto, index) => (
                <div 
                  key={crypto.id}
                  className={`
                    flex items-center p-3 
                    ${crypto.available ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}
                    ${selectedCrypto === crypto.id ? 'bg-blue-50' : crypto.available ? 'hover:bg-gray-50' : ''}
                    ${index !== cryptocurrencies.length - 1 ? 'border-b border-gray-200' : ''}
                  `}
                  onClick={() => handleSelectCrypto(crypto.id)}
                >
                  <div className="flex items-center">
                    <div className="mr-3">{crypto.icon}</div>
                    <span className="text-gray-800">{crypto.name}</span>
                    {!crypto.available && (
                      <span className="ml-2 inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                        Unavailable
                      </span>
                    )}
                  </div>
                  <div className="ml-auto">
                    <div className={`w-5 h-5 rounded-full border ${selectedCrypto === crypto.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                      {selectedCrypto === crypto.id && (
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Amount Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investment Amount (Minimum: ${chosenPlan?.minInvestment})
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="Enter amount"
                min={chosenPlan?.minInvestment}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">USD</span>
              </div>
            </div>
            {!isAmountValid() && (
              <p className="mt-2 text-sm text-red-600">
                Amount must be at least ${chosenPlan?.minInvestment}
              </p>
            )}
          </div>
             {/* ROI Preview Card */}
             <div className="mb-6 bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-medium text-green-800">Projected Returns</h3>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-green-700">
                <p>Plan: <span className="font-medium">{chosenPlan?.name || 'Standard'}</span></p>
                <p>ROI Rate: <span className="font-medium">{chosenPlan?.monthlyPrice || 0}%</span></p>
                <p>Investment Period: <span className="font-medium">6-months</span></p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-700">Projected Return:</p>
                <p className="text-2xl font-bold text-green-700">${projectedReturn.toFixed(2)}</p>
                <p className="text-sm text-green-700">Total Value: ${(parseFloat(amount) + projectedReturn).toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Information box */}
          {/* <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200 text-sm text-blue-800">
            <p className="font-medium mb-2">Cryptocurrency Benefits</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Fast global transactions</li>
              <li>Enhanced security and privacy</li>
              <li>Lower transaction fees</li>
              <li>24/7 market access</li>
            </ul>
          </div> */}
        </div>
        
        <div className="bg-gray-50 p-6">
          <button 
            className={`
              w-full py-3 rounded-lg transition-colors flex items-center justify-center
              ${isAmountValid() 
                ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
            `}
            onClick={() => isAmountValid() && onProceed(amount, selectedCrypto)}
            disabled={!isAmountValid()}
          >
            <span className="mr-2">Continue to Payment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-center text-gray-500 mt-3">
            Secure transaction processing • 24/7 support available
          </p>
        </div>
      </div>
    </div>
  );
};

export default CryptoPaymentPage;