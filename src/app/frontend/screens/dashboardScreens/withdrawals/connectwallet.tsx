// import React, { useState } from 'react';
// import { CircleX, Wallet, ChevronRight, Shield, Clock, HelpCircle } from 'lucide-react';

// interface WalletOption {
//   id: string;
//   name: string;
//   icon: string;
//   description: string;
// }

// const ConnectWalletPage: React.FC = () => {
//   const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

//   const walletOptions: WalletOption[] = [
//     { id: 'metamask', name: 'MetaMask', icon: '🦊', description: 'Connect to your MetaMask Wallet' },
//     { id: 'coinbase', name: 'Coinbase Wallet', icon: '📱', description: 'Use Coinbase Wallet app' },
//     { id: 'walletconnect', name: 'WalletConnect', icon: '🔗', description: 'Scan with WalletConnect' },
//     { id: 'phantom', name: 'Phantom', icon: '👻', description: 'Connect to your Phantom Wallet' }
//   ];

//   const handleWalletSelect = (walletId: string) => {
//     setSelectedWallet(walletId);
//   };

//   const handleCloseModal = () => {
//     // Add implementation for closing modal
//     console.log('Close modal clicked');
//   };

//   const handleConnectWallet = () => {
//     if (selectedWallet) {
//       console.log(`Connecting to wallet: ${selectedWallet}`);
//       // Implement wallet connection logic here
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
//         <div className="flex justify-between items-center p-4 border-b border-gray-100">
//           <h3 className="text-lg font-medium text-gray-900">Connect Your Wallet</h3>
//           <button 
//             className="text-gray-400 hover:text-gray-600"
//             onClick={handleCloseModal}
//             aria-label="Close modal"
//           >
//             <CircleX size={20} />
//           </button>
//         </div>
        
//         <div className="p-6">
//           <div className="mb-6">
//             <div className="flex items-center gap-2 mb-4">
//               <Wallet className="text-blue-500" size={20} />
//               <h4 className="text-md font-medium text-gray-800">Choose a wallet</h4>
//             </div>
            
//             <div className="space-y-3">
//               {walletOptions.map((wallet) => (
//                 <div 
//                   key={wallet.id}
//                   onClick={() => handleWalletSelect(wallet.id)}
//                   className={`border rounded-lg p-4 flex justify-between items-center cursor-pointer transition-all duration-200 ${
//                     selectedWallet === wallet.id 
//                       ? 'border-blue-500 bg-blue-50' 
//                       : 'border-gray-200 hover:border-blue-300'
//                   }`}
//                   role="button"
//                   tabIndex={0}
//                   aria-pressed={selectedWallet === wallet.id}
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="text-2xl">{wallet.icon}</div>
//                     <div>
//                       <p className="font-medium text-gray-900">{wallet.name}</p>
//                       <p className="text-sm text-gray-500">{wallet.description}</p>
//                     </div>
//                   </div>
//                   <ChevronRight className="text-gray-400" size={18} />
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           <div className="bg-blue-50 p-4 rounded-lg mb-6">
//             <div className="flex items-start gap-3">
//               <Shield className="text-blue-500 mt-0.5" size={18} />
//               <div>
//                 <p className="text-sm text-gray-700 font-medium">Security Note</p>
//                 <p className="text-xs text-gray-600 mt-1">
//                   We never store your private keys. Connections are secure and your funds always remain under your control.
//                 </p>
//               </div>
//             </div>
//           </div>
          
//           <div className="flex flex-col gap-2 mb-6">
//             <div className="flex justify-between items-center px-1">
//               <div className="flex items-center gap-2">
//                 <Clock className="text-gray-400" size={16} />
//                 <span className="text-sm text-gray-600">Connection time</span>
//               </div>
//               <span className="text-sm font-medium">~30 seconds</span>
//             </div>
            
//             <div className="flex justify-between items-center px-1">
//               <div className="flex items-center gap-2">
//                 <HelpCircle className="text-gray-400" size={16} />
//                 <span className="text-sm text-gray-600">Need help?</span>
//               </div>
//               <button 
//                 className="text-sm font-medium text-blue-500 hover:text-blue-600"
//                 type="button"
//               >
//                 View Guide
//               </button>
//             </div>
//           </div>
          
//           <button 
//             className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
//             disabled={!selectedWallet}
//             onClick={handleConnectWallet}
//             type="button"
//           >
//             Connect Wallet
//           </button>
          
//           <p className="text-xs text-center text-gray-500 mt-4">
//             By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConnectWalletPage;

import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, ChevronRight, Shield, Clock } from 'lucide-react';

interface ConnectWalletProps {
  onConnect: () => Promise<void>;
  isConnecting?: boolean;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ 
  onConnect, 
  isConnecting = false 
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    }
  };

  const walletIconVariants = {
    initial: { rotate: 0 },
    animate: { 
      rotate: [0, -10, 10, -5, 5, 0],
      transition: { 
        duration: 1.5,
        repeat: Infinity,
        repeatDelay: 3
      }
    }
  };

  return (
    <motion.div 
      className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header with animated wallet icon */}
      <div className="bg-red-50 p-8 flex justify-center">
        <motion.div
          className="bg-white rounded-full w-32 h-32 flex items-center justify-center shadow-md"
          initial="initial"
          animate="animate"
          variants={walletIconVariants}
        >
          <Wallet size={64} className="text-red-500" />
        </motion.div>
      </div>

      {/* Content area */}
      <div className="p-6">
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 text-center mb-6">
            Connect your cryptocurrency wallet to access the full features of our platform
          </p>
        </motion.div>

        {/* Benefits section */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-start mb-4">
            <div className="bg-green-50 p-2 rounded-md mr-3">
              <Shield size={18} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Secure Connection</h3>
              <p className="text-sm text-gray-600">Your wallet connects securely with our platform</p>
            </div>
          </div>
          
          <div className="flex items-start mb-4">
            <div className="bg-blue-50 p-2 rounded-md mr-3">
              <Clock size={18} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Quick & Easy</h3>
              <p className="text-sm text-gray-600">Connect in seconds with just a few clicks</p>
            </div>
          </div>
        </motion.div>

        {/* Connect button */}
        <motion.div variants={itemVariants}>
          <button
            onClick={onConnect}
            disabled={isConnecting}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium transition-all ${
              isConnecting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {isConnecting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </>
            ) : (
              <>
                Connect Wallet
                <ChevronRight size={18} className="ml-2" />
              </>
            )}
          </button>
          
          <p className="text-xs text-center text-gray-500 mt-4">
            We support MetaMask, Trust Wallet, WalletConnect and more
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ConnectWallet;