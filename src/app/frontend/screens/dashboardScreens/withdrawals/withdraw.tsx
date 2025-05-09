import React, { useState, useEffect } from 'react';
import { CircleX, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress?: string;
  availableBalance: number;
  onConnectWallet?: () => Promise<void>;
  onWithdraw?: (amount: number, destinationType: string, destinationAddress: string) => Promise<void>;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  walletAddress,
  availableBalance,
  onWithdraw,
}) => {
  const [amount, setAmount] = useState<string>("1000.00");
  const [destinationType, setDestinationType] = useState<string>("ERC20 (Ethereum)");
  const [destinationAddress, setDestinationAddress] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormComplete, setIsFormComplete] = useState<boolean>(false);
  
  // Network fee calculation (could be dynamic based on network conditions)
  const networkFee = 5.5;

  // Check if form is complete
  useEffect(() => {
    const amountValue = parseFloat(amount) || 0;
    setIsFormComplete(
      amountValue > 0 && 
      destinationAddress.trim() !== "" && 
      destinationType !== ""
    );
  }, [amount, destinationAddress, destinationType]);

  // Calculate total after fees
  const calculateTotal = (): number => {
    const parsedAmount = parseFloat(amount) || 0;
    return parsedAmount - networkFee;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimals
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
  };

  const handleWithdraw = async () => {
    try {
      setError(null);
      setIsProcessing(true);
      
      // Validation
      if (!destinationAddress) {
        throw new Error("Destination address is required");
      }
      
      if (!amount || parseFloat(amount) <= 0) {
        throw new Error("Please enter a valid amount");
      }
      
      if (parseFloat(amount) > availableBalance) {
        throw new Error("Insufficient funds. Your withdrawal amount exceeds your available balance.");
      }

      // Execute withdrawal if provided
      if (onWithdraw) {
        await onWithdraw(parseFloat(amount), destinationType, destinationAddress);
      }
      
      // Close modal on success
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.98
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 300,
        delay: 0.1
      }
    },
    exit: { 
      opacity: 0,
      y: 10,
      scale: 0.98,
      transition: { duration: 0.2 }
    }
  };

  // List of blockchain networks
  const blockchainNetworks = [
    "ERC20 (Ethereum)",
    "BEP20 (Binance Smart Chain)",
    "TRC20 (TRON)",
    "BTC (Bitcoin)",
    "SOL (Solana)",
    "AVAX C-Chain (Avalanche)",
    "MATIC (Polygon)",
    "FTM (Fantom)",
    "ALGO (Algorand)",
    "XRP (Ripple)",
    "ADA (Cardano)"
  ];

  // If modal is not open, don't render anything, but use AnimatePresence for smooth exit
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-gray-100 bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
        >
          <motion.div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
            variants={modalVariants}
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="text-xl font-medium text-gray-900">Transfer USDT</h3>
              <button 
                onClick={onClose} 
                className="hover:bg-gray-100 p-1 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <CircleX className="text-gray-500 hover:text-red-500" size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* Connected Wallet Info */}
              <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="mb-2 text-sm font-medium text-gray-500">Your Tesla-Wallet address</p>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-red-100 p-2">
                      <Image src='/teslalogo.png' height={40} width={40} alt='logo'/>
                    </div>
                    <span className="text-sm font-semibold text-gray-800 break-all">
                      {walletAddress
                        ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
                        : '0x8f1a3dEdE427D52915F4Aa6A9Cb8A2F09E3eDcB5'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Amount Input */}
              <div className="mb-6">
                <label htmlFor="withdraw-amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to withdraw
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center text-gray-600">
                    <span className="font-medium">USDT</span>
                  </div>
                  <input 
                    id="withdraw-amount"
                    type="text" 
                    value={amount}
                    onChange={handleAmountChange}
                    className="w-full border border-gray-200 bg-white rounded-md pl-16 py-3 text-right focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-gray-800" 
                  />
                </div>
                <p className="text-right text-xs text-gray-500 mt-2">
                  Withdrawable Balance: {availableBalance.toLocaleString()} <span className='font-bold'>USDT</span>
                </p>
              </div>
              
              {/* Withdraw Destination - Updated with blockchain networks */}
              <div className="mb-6">
                <label htmlFor="withdraw-destination" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Chain
                </label>
                <div className="relative">
                  <select 
                    id="withdraw-destination"
                    value={destinationType}
                    onChange={(e) => setDestinationType(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none appearance-none text-gray-800"
                  >
                    {blockchainNetworks.map((network) => (
                      <option key={network} value={network}>{network}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              
              {/* Destination Address */}
              <div className="mb-6">
                <label htmlFor="destination-address" className="block text-sm font-medium text-gray-700 mb-2">
                  Destination Address
                </label>
                <div className="relative">
                  <input 
                    id="destination-address"
                    type="text" 
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    placeholder="Enter USDT wallet address"
                    className="w-full border border-gray-200 bg-white rounded-md px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-gray-800" 
                  />
                </div>
              </div>
              
              {/* Transaction Summary */}
              <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-100">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Amount</span>
                  <span className="text-gray-900 font-medium">
                    {parseFloat(amount || "0").toLocaleString()} USDT
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Network Fee</span>
                  <span className="text-gray-900 font-medium">{networkFee.toLocaleString()} USDT</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-700">Total to receive</span>
                  <span className="text-gray-900">
                    {calculateTotal().toLocaleString()} USDT
                  </span>
                </div>
              </div>
              
              {/* Error message with animation */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm overflow-hidden"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Action Buttons */}
              <button 
                onClick={handleWithdraw}
                disabled={isProcessing || !isFormComplete}
                className={`w-full py-3 rounded-md font-medium transition-all duration-200 ${
                  isProcessing ||  !isFormComplete
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Confirm Transfer'}
              </button>
              
              <p className="text-xs text-center text-gray-500 mt-4">
                Tesla blockchain transactions typically complete within 5-30 minutes.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WithdrawModal;