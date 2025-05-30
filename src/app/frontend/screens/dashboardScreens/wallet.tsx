'use client';
import {useState, useRef } from 'react';
import { TokenUSDC } from '@token-icons/react';
import { 
  Plus, 
  Activity,
  Clock,
  Copy,
  X,
  Check,
} from 'lucide-react'; 

import { useUser } from '@civic/auth-web3/react';

// Define proper TypeScript interfaces
interface Asset {
  name: string;
  symbol: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface Activity {
  type: string;
  title: string;
  description: string;
  amount: string;
  amountColor: string;
  date: string;
  icon: React.ReactNode;
}

// Type for user context
interface UserContext {
  user?: {
    solana?: {
      address?: string;
      wallet?: {
        publicKey?: string;
      };
    };
  };
}

export default function WalletPage() {
  const { user } = useUser() as UserContext;
  const [showModal, setShowModal] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const addressRef = useRef<HTMLDivElement | null>(null);
  
  console.log(user);
  console.log("Modal state:", showModal);
  
  // Mock wallet address - replace with actual user wallet address when available
  const walletAddress = user?.solana?.address || "8xrt45zHJh7mCL5D8ZGnGBbx6o1UoKBpfUeRNDFK7JdM";

  // // Function to truncate wallet address for display
  // const truncateAddress = (address: string): string => {
  //   if (!address) return "";
  //   if (address.length <= 12) return address;
  //   return `${address.substring(0, 6)}......${address.substring(address.length - 4)}`;
  // };

  // Modal management
  const openModal = (): void => {
    console.log("Opening modal");
    setShowModal(true);
  };

  const closeModal = (): void => {
    console.log("Closing modal");
    setShowModal(false);
  };

  // Modal backdrop click handler
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(walletAddress)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const assets: Asset[] = [
    { name: 'USDC', symbol: 'USDC', value: 0.00, change: -1.8, icon: <TokenUSDC variant='mono' size={30}/>, color: 'bg-blue-500' },
  ];

  const activities: Activity[] = [];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            {/* Balance Card */}
            <div className="bg-gray-800 rounded-xl p-6 mb-6 relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gray-900 rounded-full filter blur-3xl opacity-20 -mr-20 -mt-20"></div>
              <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-emerald-500 opacity-10 blur-xl"></div>
              <div className="absolute -left-8 -bottom-8 h-16 w-16 rounded-full bg-blue-500 opacity-10 blur-xl"></div>
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h2 className="text-lg text-emerald-100 mb-1">Wallet Balance</h2>
                  <div className="flex items-baseline">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 animate-pulse">0.00<span className='text-sm'> USDC</span></h1>
                    <span className="ml-2 text-emerald-300 text-sm">+5.26%</span>
                    <p></p>
                  </div>
                  <p className="text-emerald-200 text-sm">≈ 0.00 SOL</p>
                </div>
                
                <div className="flex flex-row mt-4 md:mt-0 space-x-3"  onClick={() => setShowModal(true)}>
                  <button className="bg-emerald-600 hover:bg-emerald-500 px-5 py-2 rounded-lg flex items-center transition-all shadow-md" onClick={() => setShowModal(true)}>
                    <Plus className="h-5 w-5 mr-2" />
                    Fund
                  </button>
                </div>
              </div>
            </div>
            {/* Assets */}
            <div className="bg-gray-800/75 rounded-xl p-6 md:p-3 mb-6 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Your Assets</h2>
                <button className="text-sm text-emerald-400 hover:text-emerald-300">View All</button>
              </div>
              
              <div className="space-y-4">
                {assets.map((asset) => (
                  <div key={asset.symbol} className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-all cursor-pointer">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 ${asset.color} rounded-full flex items-center justify-center font-bold`}>
                        <span>{asset.icon}</span>
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium">{asset.name}</h3>
                        <p className="text-xs text-gray-400">{asset.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{asset.value.toLocaleString()}.00</p>
                      <p className={`text-xs ${asset.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {asset.change >= 0 ? '+' : ''}{asset.change}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-gray-800/75 rounded-xl p-6 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Recent Activity</h2>
                <button className="text-sm text-emerald-400 hover:text-emerald-300">View All</button>
              </div>
              
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-3 ${
                        index < activities.length - 1 ? 'border-b border-gray-700' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="bg-emerald-600 p-2 rounded-lg">
                          {activity.icon}
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium">{activity.title}</h3>
                          <p className="text-xs text-gray-400">{activity.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${activity.amountColor}`}>{activity.amount}</p>
                        <p className="text-xs text-gray-400">{activity.date}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="bg-gray-700/50 p-4 rounded-full mb-4">
                      <Clock className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">No Activity Yet</h3>
                    <p className="text-gray-500 max-w-md mb-6">
                      Your transaction history will appear here once you start using your wallet.
                    </p>
                    <button 
                      className="bg-emerald-600 hover:bg-emerald-500 px-5 py-2 rounded-lg flex items-center transition-all shadow-md text-white"
                      onClick={openModal}
                      type="button"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Fund Your Wallet
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Modal for wallet address */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <div 
            className="bg-gray-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden relative"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Your Wallet Address</h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg p-1 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal content */}
            <div className="px-6 py-8">
              <div className="mb-6">
                <p className="text-gray-300 mb-3">Send funds to this address:</p>
                <div className="bg-gray-900 p-4 rounded-lg flex items-center justify-between">
                  <div className="text-gray-300 font-mono break-all" ref={addressRef}>
                    {walletAddress}
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="ml-3 bg-emerald-600 hover:bg-emerald-500 p-2 rounded-lg transition-colors flex-shrink-0"
                    title="Copy to clipboard"
                  >
                    {copySuccess ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <Copy className="h-5 w-5 text-white" />
                    )}
                  </button>
                </div>
                {copySuccess && (
                  <p className="text-emerald-400 text-sm mt-2">Address copied to clipboard!</p>
                )}
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 bg-gray-900/30 flex justify-center">
              <button 
                onClick={closeModal}
                className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-lg transition-all shadow-md text-white w-full md:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}