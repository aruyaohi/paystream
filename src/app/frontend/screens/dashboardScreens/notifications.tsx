'use client'
import {ChevronDown, ChevronRight,Info } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet } from 'lucide-react';

// Define TypeScript interfaces
interface Notification {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  details?: string;
  status: string;
  time: string;
}

interface GroupedNotifications {
  [key: string]: Notification[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

const getDateGroup = (dateString: string): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  const notificationDate = new Date(dateString);
  notificationDate.setHours(0, 0, 0, 0);
  
  if (notificationDate.getTime() === today.getTime()) {
    return 'Today';
  } else if (notificationDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else if (notificationDate > lastWeek) {
    return 'This Week';
  } else {
    // Format as Month Year
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(notificationDate);
  }
};

const NotificationScreen: React.FC = () => {
  // Sample notification data with proper typing
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [groupedNotifications, setGroupedNotifications] = useState<GroupedNotifications>({});

  // Track which notification is expanded
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('notifications');
    console.log("This is the notification data", data);
    if(data) {
      const parsedData = JSON.parse(data);
      setNotifications(parsedData);
      
      // Group notifications by date
      const grouped: GroupedNotifications = {};
      parsedData.forEach((notification: Notification) => {
        const group = getDateGroup(notification.time);
        if (!grouped[group]) {
          grouped[group] = [];
        }
        grouped[group].push(notification);
      });
      
      // Sort groups by recency (Today first, then Yesterday, etc.)
      const sortedGroups: GroupedNotifications = {};
      const groupOrder = ['Today', 'Yesterday', 'This Week'];
      
      // Add ordered groups first
      groupOrder.forEach(group => {
        if (grouped[group]) {
          sortedGroups[group] = grouped[group];
          delete grouped[group];
        }
      });
      
      // Add remaining groups (months) sorted by date
      Object.keys(grouped)
        .sort((a, b) => {
          const dateA = new Date(grouped[a][0].time);
          const dateB = new Date(grouped[b][0].time);
          return dateB.getTime() - dateA.getTime();
        })
        .forEach(group => {
          sortedGroups[group] = grouped[group];
        });
      
      setGroupedNotifications(sortedGroups);
    }
  }, []);

  const toggleExpand = async (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
  
      // Update local state optimistically
      const updatedNotifications = notifications.map(notification =>
        notification.id === id
          ? { ...notification, status: 'read' }
          : notification
      );
  
      setNotifications(updatedNotifications);
      
      // Update grouped notifications
      const newGrouped: GroupedNotifications = {};
      Object.keys(groupedNotifications).forEach(group => {
        newGrouped[group] = groupedNotifications[group].map(notification =>
          notification.id === id
            ? { ...notification, status: 'read' }
            : notification
        );
      });
      setGroupedNotifications(newGrouped);
  
      const notification = updatedNotifications.find(notif => notif.id === id);
      const userData = localStorage.getItem('userData');
      const token = localStorage.getItem('token');
  
      if (userData && notification && token) {
        const { email } = JSON.parse(userData);
        try {
          const res = await fetch('/api/updateNotification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: notification.id,
              email,
              token,
            }),
          });
  
          if (!res.ok) {
            console.error('Failed to update notification status');
          }
          
          const data = res.json();
          console.log("Response from updateNotification", data);
          } catch (error) {
          console.error('Error updating notification:', error);
        }
      }
    }
  };

  const getStatusIndicator = (status: string, type: Notification['type']) => {
    if (status === 'unread') {
      switch(type) {
        case 'success':
          return "bg-green-500";
        case 'error':
          return "bg-red-500";
        case 'warning':
          return "bg-amber-500";
        default:
          return "bg-blue-500";
      }
    }
    return "";
  };


  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Main content */}
      <div className="flex-grow overflow-y-auto bg-gray-900">
        {notifications.length > 0 ? (
          <div className="h-full">
            {Object.keys(groupedNotifications).map((dateGroup) => (
              <div key={dateGroup}>
                {/* Date separator */}
                <div className="sticky top-0 z-10 bg-gray-800 px-4 py-2 flex items-center">
                  <div className="h-px flex-grow bg-gray-700"></div>
                  <span className="px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">{dateGroup}</span>
                  <div className="h-px flex-grow bg-gray-700"></div>
                </div>
                
                {/* Notifications in this group */}
                <div className="divide-y divide-gray-800">
                  {groupedNotifications[dateGroup].map((notification) => (
                    <motion.div 
                      key={notification.id} 
                      className={`cursor-pointer ${notification.status === 'read' ? 'bg-gray-900' : 'bg-gray-850 border-l-4 border-red-500'}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div 
                        className="p-4 hover:bg-gray-800 transition-colors duration-200"
                        onClick={() => toggleExpand(notification.id)}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-start">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            notification.type === 'success' ? 'bg-gray-800' : 
                            notification.type === 'error' ? 'bg-red-900' : 
                            notification.type === 'warning' ? 'bg-amber-900' : 'bg-blue-900'
                          }`}>
                            {/* <Image src="/teslalogo.png" height={100} width={100} alt='logo'/> */}
                            <Wallet className="w-5 h-5 text-emerald-500"/>
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-200">{notification.title}</p>
                              <span className="text-xs text-emerald-400">{formatDate(notification.time)}</span>
                            </div>
                            <p className="mt-1 text-sm text-gray-400 line-clamp-1">{notification.message}</p>
                            
                            {notification.status !== 'read' && (
                              <span className={`inline-block w-2 h-2 ${getStatusIndicator(notification.status, notification.type)} rounded-full ml-1`}></span>
                            )}
                          </div>
                          {expandedId === notification.id ? 
                            <ChevronDown className="w-4 h-4 text-emerald-400 ml-2 mt-1" /> : 
                            <ChevronRight className="w-4 h-4 text-emerald-400 ml-2 mt-1" />
                          }
                        </div>
                      </motion.div>
                      
                      <AnimatePresence>
                        {expandedId === notification.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 py-3 bg-gray-800 border-t border-gray-700">
                              <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                              >
                                <h3 className="text-sm font-medium text-emerald-400 mb-2">Details</h3>
                                <p className="text-sm text-gray-300 mb-3 leading-relaxed">{notification.details || notification.message}</p>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-gray-500">{formatDate(notification.time)}</span>
                                  <button 
                                    className="px-3 py-1 text-xs bg-emerald-500 hover:bg-emerald-700 text-white rounded transition-colors"
                                    onClick={(e: React.MouseEvent) => {
                                      e.stopPropagation();
                                      setExpandedId(null);
                                    }}
                                  >
                                    Close
                                  </button>
                                </div>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center justify-center space-y-4 p-12 text-center">
              <div className="p-6 bg-gray-800 rounded-full">
                <Info className="w-12 h-12 text-emerald-500" />
              </div>
              <h2 className="text-xl font-medium text-gray-200">No Notifications</h2>
              <p className="text-gray-400">Your Tesla dashboard is clear</p>
              <p className="text-xs text-emerald-500 mt-2">Check back later for updates</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationScreen;