'use client'
import React, { useEffect, useState, useRef, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
// import { supabase } from '@/app/lib/supabase';

// User Data interface for userData object
interface UserData {
  firstname: string;
  lastname: string;
  email: string;
  mobile_number: string;
  date_of_birth: string;
  profile_image: File | string | null;
}

interface Notification {
  type: 'success' | 'error';
  message: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: UserData;
}

const ProfilePage = () => {
  // Initial user data state with additional fields
  const [userData, setUserData] = useState<UserData>({
    firstname: '',
    lastname: '',
    email: '',
    mobile_number: '',
    date_of_birth: '',
    profile_image: '/pfp.jpg', // Default image path
  });

  const previewImg = {
    url: '/pfp.jpg'
  };
  
  // Reference for file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for loading during API calls
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Get current userData from localstorage on browser for display purposes.
  useEffect(() => {
    const storedUser = localStorage.getItem('userData') || '{}';
    if(storedUser) {
      try {
        setUserData({...JSON.parse(storedUser)});
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        showNotification('error', 'Failed to load profile data');
      }
    }
  }, []);  

  // State for tracking edit mode
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // State for form data (when editing)
  const [formData, setFormData] = useState<UserData>({...userData});
  // State for image preview
  const [imagePreview, setImagePreview] = useState<string>(previewImg.url);
  // State for notification
  const [notification, setNotification] = useState<Notification | null>(null);
  
  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle image file selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('error', 'Image file is too large (max 5MB)');
        return;
      }
      // Create a preview URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);

      setFormData({
        ...formData,
        profile_image: file,
      });
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Function to update profile via API
  const updateProfileAPI = async (data: FormData): Promise<ApiResponse> => {
    try {
      // Get token from local storage or wherever you store it
      const token = localStorage.getItem('token');
      
      if (!token) {
        return {
          success: false,
          message: 'Authentication token not found. Please log in again.'
        };
      }
      
      const response = await fetch('/api/editprofile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update profile');
      }
      
      return {
        success: true,
        message: result.message || 'Profile updated successfully',
        data: result.data
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  };  

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
     
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        showNotification('error', 'Please enter a valid email address');
        return;
      }
   
      setIsLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('firstname', formData.firstname);
      formDataToSend.append('lastname', formData.lastname);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('mobile_number', formData.mobile_number);
      formDataToSend.append('date_of_birth', formData.date_of_birth);
    
      if (formData.profile_image instanceof File) {
        // const { data: uploadData, error: uploadError } = await supabase.storage
        //   .from('profileimages')
        //   .upload(`users/${formData.email}/profile.jpg`, formData.profile_image, {
        //     cacheControl: '3600',
        //     upsert: true,
        //   });

        formDataToSend.append('profile_image', formData.profile_image);
      }
     
      // Call API to update profile
      const result = await updateProfileAPI(formDataToSend);
     
      if (result.success) {
        // Update local state with the returned data or the form data
        const updatedData = result.data || formData;
        setUserData({...updatedData}); 
        // Save to localStorage for persistence
        localStorage.setItem('userData', JSON.stringify(updatedData));
        setIsEditing(false);
        
        showNotification('success', result.message);
      } else {
        showNotification('error', result.message);
      }
    } catch (error) {
      console.error("Error saving user data:", error);
      showNotification('error', 'Failed to save profile changes');
    } finally {
      setIsLoading(false);
    }
  };
    
  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // If canceling edit, reset form data and image preview
      setFormData({...userData});
      setImagePreview(userData.profile_image as string || previewImg.url);
    }
    setIsEditing(!isEditing);
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Item animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  // Notification animation variants
  const notificationVariants = {
    hidden: { opacity: 0, y: -50, x: '-50%' },
    visible: { opacity: 1, y: 0, x: '-50%' },
    exit: { opacity: 0, y: -20, x: '-50%' }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Notification Component */}
      <AnimatePresence>
        {notification && (
          <motion.div
            key="notification"
            variants={notificationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            className={`fixed top-6 left-1/2 z-50 px-6 py-3 rounded-lg shadow-lg ${
              notification.type === 'success' 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              {notification.type === 'success' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              <span className="font-medium">{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleEditMode}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                isEditing 
                  ? 'bg-gray-700 text-gray-200' 
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </motion.button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700"
        >
          <div className="p-6 sm:p-8">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Profile Image Section - Takes 4 columns on large screens */}
              <motion.div 
                variants={itemVariants}
                className="lg:col-span-4 flex flex-col items-center"
              >
                <div className="relative w-32 h-32 mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 p-1">
                    {/* Hidden file input */}
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    {/* Profile Image */}
                    <div className="w-full h-full rounded-full border-2 border-gray-700 overflow-hidden bg-gray-700">
                      <Image
                        src={imagePreview} 
                        alt="Profile" 
                        height={128}
                        width={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Camera icon for image upload during edit mode */}
                  {isEditing && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.1 }}
                      onClick={triggerFileInput}
                      className="absolute bottom-0 right-0 bg-emerald-500 text-white rounded-full p-2 cursor-pointer shadow-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </div>
                
                <motion.div variants={itemVariants} className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {userData.firstname} {userData.lastname}
                  </h2>
                  <p className="text-emerald-400 font-medium">{userData.email}</p>
                </motion.div>

                {/* Quick Contact Info Cards */}
                <motion.div variants={itemVariants} className="w-full space-y-3">
                  <div className="flex items-center p-3 bg-gray-700 rounded-lg border border-gray-600">
                    <div className="p-2 bg-emerald-500 bg-opacity-20 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="text-sm font-medium text-gray-100">{userData.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-700 rounded-lg border border-gray-600">
                    <div className="p-2 bg-emerald-500 bg-opacity-20 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">Phone</p>
                      <p className="text-sm font-medium text-gray-100">{userData.mobile_number || "Not provided"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-700 rounded-lg border border-gray-600">
                    <div className="p-2 bg-emerald-500 bg-opacity-20 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">Date of Birth</p>
                      <p className="text-sm font-medium text-gray-100">{formatDate(userData.date_of_birth) || "Not provided"}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Form Section - Takes 8 columns on large screens */}
              <motion.div variants={itemVariants} className="lg:col-span-8">
                <div className="bg-gray-700 p-6 rounded-xl mb-6 border border-gray-600">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Personal Information
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-600 bg-gray-800 rounded-lg text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-30 transition-all duration-200"
                            required
                          />
                        ) : (
                          <p className="text-gray-100 py-2 px-4 bg-gray-800 rounded-lg border border-gray-600">{userData.firstname}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-600 bg-gray-800 rounded-lg text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-30 transition-all duration-200"
                            required
                          />
                        ) : (
                          <p className="text-gray-100 py-2 px-4 bg-gray-800 rounded-lg border border-gray-600">{userData.lastname}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-600 bg-gray-800 rounded-lg text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-30 transition-all duration-200"
                            required
                          />
                        ) : (
                          <p className="text-gray-100 py-2 px-4 bg-gray-800 rounded-lg border border-gray-600">{userData.email}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="mobile_number"
                            value={formData.mobile_number}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-600 bg-gray-800 rounded-lg text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-30 transition-all duration-200"
                          />
                        ) : (
                          <p className="text-gray-100 py-2 px-4 bg-gray-800 rounded-lg border border-gray-600">{userData.mobile_number || "Not provided"}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Date of Birth</label>
                        {isEditing ? (
                          <input
                            type="date"
                            name="date_of_birth"
                            value={formData.date_of_birth}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-600 bg-gray-800 rounded-lg text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-30 transition-all duration-200"
                          />
                        ) : (
                          <p className="text-gray-100 py-2 px-4 bg-gray-800 rounded-lg border border-gray-600">
                            {formatDate(userData.date_of_birth) || "Not provided"}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Save Button */}
                    {isEditing && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-end"
                      >
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          type="submit"
                          disabled={isLoading}
                          className={`px-6 py-2 bg-emerald-500 text-white font-medium rounded-lg shadow-md hover:bg-emerald-600 transition-all duration-300 ${
                            isLoading ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
                        >
                          {isLoading ? (
                            <div className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Saving...
                            </div>
                          ) : 'Save Changes'}
                        </motion.button>
                      </motion.div>
                    )}
                  </form>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProfilePage;