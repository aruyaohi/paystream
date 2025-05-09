'use client';


import { 
  ArrowRightLeft, 
  Settings, 
  Plus, 
  ArrowRight, 
  ArrowLeft
} from 'lucide-react'; 


// // Dynamically import chart to avoid SSR issues
// const LineChart = dynamic(
//   () => import('./components/LineChart'),
//   { ssr: false }
// );

export default function WalletPage() {
  const assets = [
    { name: 'USDC', symbol: 'USDC', value: 0.00, change: -1.8, icon: '◎', color: 'bg-purple-500' },
  ];

  const activities = [
    { 
      type: 'send', 
      title: 'Sent Bitcoin', 
      description: 'To: 3FZbgi29...a4kn', 
      amount: '-0.042 BTC', 
      amountColor: 'text-red-400',
      date: 'May 7, 2025',
      icon: <ArrowRight className="h-5 w-5" />
    },
    { 
      type: 'receive', 
      title: 'Received Ethereum', 
      description: 'From: 0x7cb3...d92f', 
      amount: '+1.205 ETH', 
      amountColor: 'text-emerald-400',
      date: 'May 5, 2025',
      icon: <ArrowLeft className="h-5 w-5" />
    },
    { 
      type: 'swap', 
      title: 'Swapped Assets', 
      description: 'SOL → BTC', 
      amount: '5.6 SOL for 0.008 BTC', 
      amountColor: 'text-white',
      date: 'May 3, 2025',
      icon: <ArrowRightLeft className="h-5 w-5" />
    },
  ];

  // Chart data
  // const chartData = [
  //   { date: 'May 2', value: 24580 },
  //   { date: 'May 3', value: 25100 },
  //   { date: 'May 4', value: 24800 },
  //   { date: 'May 5', value: 26200 },
  //   { date: 'May 6', value: 27400 },
  //   { date: 'May 7', value: 26900 },
  //   { date: 'May 8', value: 28465 },
  // ];

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
              <div className="not-[]:flex flex-col md:flex-row justify-between">
                <div>
                  <h2 className="text-lg text-emerald-100 mb-1">Wallet Balance</h2>
                  <div className="flex items-baseline">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 animate-pulse">0.00<span className='text-sm'> USDC</span></h1>
                    <span className="ml-2 text-emerald-300 text-sm">+5.26%</span>
                  </div>
                  <p className="text-emerald-200 text-sm">≈ 0.00 SOL</p>
                </div>
                
                <div className="flex flex-row mt-4 md:mt-0 space-x-3">
                  <button className="bg-emerald-600 hover:bg-emerald-500 px-5 py-2 rounded-lg flex items-center transition-all shadow-md">
                    <Plus className="h-5 w-5 mr-2" />
                    Receive
                  </button>
                  <button className="bg-gray-800 hover:bg-gray-700 px-5 py-2 rounded-lg flex items-center transition-all shadow-md">
                    <ArrowRight className="h-5 w-5 mr-2" />
                    Send
                  </button>
                </div>
              </div>
            </div>
            {/* Assets */}
            <div className="bg-gray-800/75 rounded-xl p-6 mb-6 shadow-md">
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
                      <p className="font-medium">${asset.value.toLocaleString()}</p>
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
                {activities.map((activity, index) => (
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
