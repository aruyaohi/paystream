'use client'
import React, { useState, useEffect } from 'react';
import { LogOut, Wallet,AlignLeft, User, HelpCircle, Loader, X, PowerIcon, Bell,Zap,File, UsersRound } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import WalletPage from '../frontend/screens/dashboardScreens/wallet';
import InvestorProfile from '../frontend/screens/dashboardScreens/profile';
import NotificationScreen from '../frontend/screens/dashboardScreens/notifications';
import PayrollManagement from '../frontend/screens/dashboardScreens/payroll';
import EmployeePage from '../frontend/screens/dashboardScreens/employee';
import { UserButton } from '@civic/auth/react';
import { useUser } from '@civic/auth-web3/react';
import { userHasWallet } from '@civic/auth-web3';
// import { Connection } from '@solana/web3.js';


const TeslaDashboard = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // State for notification count (you can replace this with your actual data source)
  const [notificationCount,setNotificationCount] = useState(0);
  const [activeTab, setActiveTab] = useState('Payroll');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const loadingError = '';

  // type Notification = {
  //     id: number;
  //     user_id: number;
  //     message: string;
  //     status: string;
  //     created_at: string;
  //   };

  // type Investments = {
  //   id: number;
  //   plan: string;
  //   amount: string;
  //   duration: {
  //     month: number;
  //   }
  //   user_id: number;
  // }
    
    // type DashboardResponse = {
    //   notifications: {
    //     notifications: Notification[];
    //   };
    //   investments :{
    //     investments: Investments[];
    //   }
    // };
  
    const userContext = useUser()
    const user = useUser()

  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       if (!token) return;
  //       const response = await fetch("/api/dashboard", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({token }),
  //       });
  //       // if (response.status === 401) {
  //       //   window.location.href = '/login';
  //       // }
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch notifications");
  //       }
  //       const data: DashboardResponse = await response.json();
  //       localStorage.setItem('investments', JSON.stringify(data.investments));
  //       const notificationsList = data?.notifications;

  //       if (Array.isArray(notificationsList)) {
  //       const unreadCount = notificationsList.filter(
  //       (notification) => notification.status === 'unread').length;
  //       setNotificationCount(unreadCount);   
  //       }
  //       } catch (error) {
  //       console.error("Error fetching notifications:", error);
  //     }
  //   }; 
  //   fetchNotifications();
  // }, []);
  
    useEffect(() => {
      const createWallet = async () =>{
        if(userContext.user && !userHasWallet(userContext)){
          await userContext.createWallet();
          console.log("user does not have a wallet")
        }
        console.log("User has a wallet");
      }

      // const checkWalletBalance = async () =>{
      //   const connection = new Connection('https://mainnet.helius-rpc.com/?api-key=26cb6d06-f201-43e1-ae14-1c336ccd324a');
      //   const { publicKey } = user.solana.wallet;
      //   const balance = await connection.getBalance(publicKey);
      // }

      createWallet();
    }, [user]);

  // const messageRead = () =>{}
  const clearNotifications = () =>{
    setNotificationCount(0);
  }
  // Logout confirmation modal
  const LogoutConfirmationModal = () => (
    <AnimatePresence>
      {showLogoutModal && (
        <>
          {/* Modal Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={() => setShowLogoutModal(false)}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="bg-gray-900 rounded-lg shadow-xl w-11/12 max-w-md p-6 mx-4"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            >
              <div className="text-center">
                <LogOut size={48} className="mx-auto text-emerald-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Logout</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to log out of your Tesla account?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmLogout}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-full hover:bg-green-700 transition-colors sm:order-2"
                  >
                    Yes, Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  const MobileHeader = () => {
    return (
      <>
        <header className="md:hidden bg-gray-900 p-4 flex items-center justify-between relative z-50">
          {/* Mobile Menu Toggle Button - Now first in the layout */}
            {/* User profile */}
                  <div className="flex items-center">
                 {isMobileOpen?<X size={25} className="text-gray-100" onClick={toggleMobileMenu} />:<AlignLeft size={25} className="text-gray-100" onClick={toggleMobileMenu} />} 
                  </div>
          <div className="relative">
            <button 
              className="p-2 rounded-full hover:bg-gray-100 text-gray-800"
              onClick={() => [setActiveTab('notification'),clearNotifications()]}
            >
              <Bell size={24} className='text-white'/>
              
              {/* Notification Badge */}
              {notificationCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                  {notificationCount > 9 ? (
                    <span className="text-xs font-bold px-2 py-0.5">9+</span>
                  ) : (
                    <span className="text-xs font-bold w-5 h-5 flex items-center justify-center">{notificationCount}</span>
                  )}
                </div>
              )}
            </button>
          </div>
        </header>
        
        {/* Mobile Menu with Framer Motion */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 z-30"
                onClick={toggleMobileMenu}
              />
              
              {/* Sliding Menu */}
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed top-0 left-0 bottom-0 w-64 bg-gray-900 shadow-lg z-40"
              >
                {/* Close Button */}
                <div className="p-4 flex justify-end">
                  <button 
                    onClick={toggleMobileMenu}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-800"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Menu Items */}
                <nav className="py-4">
                  {mobileNavItems.map(item => (
                    <button
                      key={item.name}
                      className={`
                        flex items-center space-x-3 px-4 py-4 
                        text-gray-50 hover:bg-gray-100 w-full text-left 
                        ${activeTab === item.name ? 'bg-green-50 text-emerald-500' : ''}
                      `}
                      onClick={() => {
                        if (item.name === 'Logout') {
                          handleLogout();
                        } else {
                          setActiveTab(item.name);
                          setMobileMenuOpen(false);
                        }
                      }}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                      
                      {/* Show notification indicator in menu if this is the notifications tab */}
                      {item.name === 'notification' && notificationCount > 0 && (
                        <div className="ml-auto bg-emerald-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                          {notificationCount > 9 ? '9+' : notificationCount}
                        </div>
                      )}
                    </button>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  };

  
  useEffect(() => {
    const setLoaderFalse = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }

    setLoaderFalse();
  }, []);

  const navItems = [
    { name: 'Payroll', icon: <File size={24} /> },
    { name: 'Team', icon: <UsersRound size={24} /> },
    { name: 'Wallet', icon: <Wallet size={24} /> },
    { name: 'Profile', icon: <User size={24} /> },
  ];

  const mobileNavItems = [
    { name: 'Logout', icon: <PowerIcon size={24} className='text-red-500'/> },
  ]
  
  // Handle logout (show confirmation)
  const handleLogout = () => {
    setShowLogoutModal(true);
  };
  
  // Handle confirmed logout
  const handleConfirmLogout = () => {
    // // Clear user data and token from localStorage
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");
    // Redirect to login page
    window.location.href = "/";
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setIsMobileOpen(!isMobileOpen);
  };
  
  const LoadingScreen = () => (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <div className="mb-6">
      <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-400 to-emerald-400 rounded-lg p-2 mr-2">
                <Zap className="h-5 w-5 text-black" />
              </div>
              <span className="text-lg font-bold text-white">PayStream</span>
          </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="animate-spin mb-4">
          <Loader size={48} className="text-red-600" />
        </div>
        {loadingError && (
          <div className="mt-4 text-red-500 text-center max-w-md">
            <p>{loadingError}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderPlaceholder = (name:string) => {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-500">
        <div className="text-6xl mb-4">{name === 'Help' ? <HelpCircle size={64} /> : (name === 'Logout' ? <LogOut size={64} /> : '🚧')}</div>
        <h2 className="text-2xl font-medium mb-2">{name} Page</h2>
        <p>This {String(name).toLowerCase()} page is under construction.</p>
        {name === 'Logout' && (
          <button 
            onClick={handleLogout}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            Confirm Logout
          </button>
        )}
      </div>
    );
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'Profile':
        return <InvestorProfile />;
      case 'Team':
        return <EmployeePage/>;
      case 'Payroll':
        return <PayrollManagement/>;
      case 'Wallet':
        return <WalletPage/>;
      case 'notification':
        return <NotificationScreen/>;
      case 'Logout':
        handleLogout(); // Show logout confirmation 
        return renderPlaceholder(activeTab);
      default:
        return renderPlaceholder(activeTab);
    }
  };
  
  // If still loading, show loading screen
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
<div className="h-screen bg-gray-800 flex flex-col md:flex-row">
      {/* Logout Confirmation Modal */}
<LogoutConfirmationModal />

<div className="hidden md:flex flex-col w-96 bg-gray-900 h-full">
  {/* Navigation section taking up most of the space but allowing room for footer */}
  <div className="flex items-center p-4">
              {/* <div className="bg-gradient-to-r from-blue-400 to-emerald-400 rounded-lg p-2 mr-2">
                <Zap className="h-5 w-5 text-black" />
              </div>
              <span className="text-lg font-bold text-white">PayStream</span> */}
              <UserButton className='border-emerald-500 text-emerald-500 rounded-l-2xl'/>
          </div>
  <nav className="flex flex-col flex-1 overflow-y-auto py-4">
    {navItems.filter(item => item.name !== 'Logout').map(item => (
      <button
        key={item.name}
        className={`flex items-center space-x-3 px-4 py-3 text-gray-100 hover:bg-gray-800 ${
          activeTab === item.name ? 'bg-gray-800 text-emerald-500 border-r-4 border-emerald-500' : ''
        }`}
        onClick={() => setActiveTab(item.name)}
      >
        {item.icon}
        <span>{item.name}</span>
      </button>
    ))}
  </nav>
  
  {/* Footer div at the bottom with logo and logout button */}
  <div className="mt-auto border-gray-800 py-4 px-4">
    <div className="flex-col items-center justify-between space-y-5">      
      {/* Logout button */}
      <button
        className="flex items-center space-x-2 text-white bg-gray-900 border border-emerald-500 hover:border-red-500 hover:text-red-500 w-full px-3 py-2 justify-center rounded-lg"
        onClick={handleLogout}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
        </svg>
        <span>Logout</span>
      </button>
    </div>
  </div>
</div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <MobileHeader/>
        
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {renderContent()}
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900">
          <nav className="flex justify-around">
            {navItems.slice(0, 4).map(item => (
              <button
                key={item.name}
                className={`flex flex-col items-center py-2 px-4 ${
                  activeTab === item.name ? 'text-emerald-500' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab(item.name)}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TeslaDashboard;