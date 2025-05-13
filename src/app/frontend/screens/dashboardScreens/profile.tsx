'use client'
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@civic/auth-web3/react";
import {
  ArrowLeft,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Edit,
  ChevronRight,
  Globe,
  BookOpen,
  Users,
  Github,
  Linkedin,
  Twitter,
  Shield,
  Award,
  Hexagon,
  Clock,
  User,
  Settings,
  LogOut,
  LogIn,
  Trash
} from "lucide-react";

import Image from "next/image";

// Define types for profile data
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  position: string;
  department: string;
  joinDate: string;
  avatar: string;
  coverPhoto: string;
  socialMedia: {
    website?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  skills: string[];
  achievements: Achievement[];
  activity: ActivityItem[];
}

interface Achievement {
  id: string;
  title: string;
  date: string;
  description: string;
  icon: string;
}

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
}
// Mock profile data
const initialProfile: UserProfile = {
  id: "user001",
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  bio: "Senior developer with 8+ years of experience building modern web applications. Passionate about clean code, user experience, and building products that make a difference.",
  position: "",
  department: "Engineering",
  joinDate: "2022-03-15",
  avatar: "/api/placeholder/150/150",
  coverPhoto: "/download.jpeg",
  socialMedia: {
    website: "https://alexmorgan.dev",
    github: "github.com/alexmorgan",
    linkedin: "linkedin.com/in/alexmorgan",
    twitter: "twitter.com/alexmorgan"
  },
  skills: [
    "React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js", 
    "GraphQL", "UI/UX Design", "Jest", "CI/CD", "AWS"
  ],
  achievements: [
    {
      id: "ach001",
      title: "Employee of the Month",
      date: "2024-04-01",
      description: "Recognized for exceptional contribution to the redesign project.",
      icon: "award"
    },
    {
      id: "ach002",
      title: "Project Excellence Award",
      date: "2023-11-15",
      description: "Lead developer for the company's most successful product launch.",
      icon: "shield"
    },
    {
      id: "ach003",
      title: "5+ Client Commendations",
      date: "2023-08-20",
      description: "Received outstanding feedback from multiple enterprise clients.",
      icon: "hexagon"
    }
  ],
  activity: [
    {
      id: "act001",
      type: "project",
      title: "Completed Dashboard Redesign",
      description: "Finished the UI overhaul for the analytics dashboard.",
      date: "2025-05-09T14:30:00"
    },
    {
      id: "act002",
      type: "achievement",
      title: "Received Performance Bonus",
      description: "Awarded quarterly performance bonus for Q1 2025.",
      date: "2025-04-15T09:00:00"
    },
    {
      id: "act003",
      type: "collaboration",
      title: "Joined Marketing Project",
      description: "Started collaboration with the marketing team on the new campaign site.",
      date: "2025-04-08T11:15:00"
    },
    {
      id: "act004",
      type: "training",
      title: "Completed Advanced React Course",
      description: "Finished certification in Advanced React Patterns and Performance.",
      date: "2025-03-22T16:45:00"
    }
  ]
};

// Define page types
type PageType = 'view' | 'edit';

// Animation variants
const pageVariants = {
  initial: { opacity: 0, x: '50px' },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: '-50px' }
};

const pageTransition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.4
};

// Loading Screen Component
const LoadingScreen = () => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="w-12 h-12 border-4 border-t-emerald-500 border-emerald-900 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
};

// Activity Card Component
const ActivityCard = ({ activity }: { activity: ActivityItem }) => {
  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'project': return <Briefcase className="h-4 w-4 text-blue-400" />;
      case 'achievement': return <Award className="h-4 w-4 text-yellow-400" />;
      case 'collaboration': return <Users className="h-4 w-4 text-purple-400" />;
      case 'training': return <BookOpen className="h-4 w-4 text-green-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-750 transition-colors">
      <div className="mt-1 h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-white">{activity.title}</h4>
        <p className="text-xs text-gray-400 mt-1">{activity.description}</p>
        <p className="text-xs text-gray-500 mt-1">{timeAgo(activity.date)}</p>
      </div>
    </div>
  );
};

// Achievement Card Component
const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
  const getAchievementIcon = (iconName: string) => {
    switch(iconName) {
      case 'award': return <Award className="h-5 w-5 text-yellow-400" />;
      case 'shield': return <Shield className="h-5 w-5 text-emerald-400" />;
      case 'hexagon': return <Hexagon className="h-5 w-5 text-blue-400" />;
      default: return <Award className="h-5 w-5 text-yellow-400" />;
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-emerald-500 transition-colors">
      <div className="flex items-start mb-3">
        <div className="p-2 rounded-lg bg-gray-700">
          {getAchievementIcon(achievement.icon)}
        </div>
        <div className="ml-3">
          <h3 className="text-white font-medium">{achievement.title}</h3>
          <p className="text-xs text-gray-400">{new Date(achievement.date).toLocaleDateString()}</p>
        </div>
      </div>
      <p className="text-sm text-gray-300">{achievement.description}</p>
    </div>
  );
};

// Social Media Links Component
const SocialMediaLinks = ({ links }: { links: UserProfile['socialMedia'] }) => {
  return (
    <div className="flex space-x-4">
      {links.website && (
        <motion.a
          href={links.website}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-gray-700 rounded-full text-gray-300 hover:text-emerald-400 hover:bg-gray-600 transition-colors"
        >
          <Globe size={18} />
        </motion.a>
      )}
      {links.github && (
        <motion.a
          href={`https://${links.github}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-gray-700 rounded-full text-gray-300 hover:text-emerald-400 hover:bg-gray-600 transition-colors"
        >
          <Github size={18} />
        </motion.a>
      )}
      {links.linkedin && (
        <motion.a
          href={`https://${links.linkedin}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-gray-700 rounded-full text-gray-300 hover:text-emerald-400 hover:bg-gray-600 transition-colors"
        >
          <Linkedin size={18} />
        </motion.a>
      )}
      {links.twitter && (
        <motion.a
          href={`https://${links.twitter}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-gray-700 rounded-full text-gray-300 hover:text-emerald-400 hover:bg-gray-600 transition-colors"
        >
          <Twitter size={18} />
        </motion.a>
      )}
    </div>
  );
};

// Profile Form Component
interface ProfileFormProps {
  profile: UserProfile;
  onSubmit: (profileData: UserProfile) => void;
  onCancel: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      socialMedia: {
        ...prevData.socialMedia,
        [name]: value
      }
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prevData => ({
        ...prevData,
        skills: [...prevData.skills, skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prevData => ({
      ...prevData,
      skills: prevData.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white"
            />
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white"
          />
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">Professional Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-300 mb-1">
              Position
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white"
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-300 mb-1">
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white"
            />
          </div>

          <div>
            <label htmlFor="joinDate" className="block text-sm font-medium text-gray-300 mb-1">
              Join Date
            </label>
            <input
              type="date"
              id="joinDate"
              name="joinDate"
              value={formData.joinDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">Social Media</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-1">
              Website
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-600 text-gray-400 text-sm">
                https://
              </span>
              <input
                type="text"
                id="website"
                name="website"
                value={formData.socialMedia.website?.replace('https://', '') || ''}
                onChange={handleSocialMediaChange}
                className="flex-1 px-4 py-2.5 border border-gray-600 rounded-r-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="github" className="block text-sm font-medium text-gray-300 mb-1">
              GitHub
            </label>
            <input
              type="text"
              id="github"
              name="github"
              value={formData.socialMedia.github || ''}
              onChange={handleSocialMediaChange}
              className="w-full px-4 py-2.5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white"
            />
          </div>

          <div>
            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-300 mb-1">
              LinkedIn
            </label>
            <input
              type="text"
              id="linkedin"
              name="linkedin"
              value={formData.socialMedia.linkedin || ''}
              onChange={handleSocialMediaChange}
              className="w-full px-4 py-2.5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white"
            />
          </div>

          <div>
            <label htmlFor="twitter" className="block text-sm font-medium text-gray-300 mb-1">
              Twitter
            </label>
            <input
              type="text"
              id="twitter"
              name="twitter"
              value={formData.socialMedia.twitter || ''}
              onChange={handleSocialMediaChange}
              className="w-full px-4 py-2.5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex items-center bg-gray-700 text-white px-3 py-1 rounded-full">
              <span className="text-sm">{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="ml-2 text-gray-400 hover:text-red-400"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="Add a skill"
            className="flex-1 px-4 py-2.5 border border-gray-600 rounded-lg rounded-r-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg rounded-l-none hover:bg-emerald-700 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <motion.button
          type="button"
          onClick={onCancel}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2.5 border border-gray-600 text-gray-300 font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          Cancel
        </motion.button>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Save Changes
        </motion.button>
      </div>
    </form>
  );
};

// Main Profile Page Component
const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [currentPage, setCurrentPage] = useState<PageType>('view');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('activity');

  // Navigation handler with loading effect
  const handleNavigate = (page: PageType) => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsLoading(false);
    }, 500);
  };

  // Handle profile update
  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    handleNavigate('view');
  };

  const { user, } = useUser();

  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        coverPhoto: user.picture || prev.coverPhoto,
        phone: typeof user.username === 'string'? user.username : prev.phone,
        name: user.name || prev.name,
        email: user.email || prev.email,
        avatar: typeof user.avatar === 'string' ? user.avatar : prev.avatar,
      }));
      
    }
  }, [user]);

  // Get time since join date
  const getTimeSinceJoin = () => {
    const joinDate = new Date(profile.joinDate);
    const now = new Date();
    const yearDiff = now.getFullYear() - joinDate.getFullYear();
    const monthDiff = now.getMonth() - joinDate.getMonth();
    
    if (yearDiff > 0) {
      return `${yearDiff} year${yearDiff > 1 ? 's' : ''}`;
    } else if (monthDiff > 0) {
      return `${monthDiff} month${monthDiff > 1 ? 's' : ''}`;
    } else {
      return 'Less than a month';
    }
  };

  return (
    <section className="py-12 bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {isLoading && <LoadingScreen />}

          {!isLoading && currentPage === 'view' && (
            <motion.div
              key="profile-view"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              {/* Profile Header with Cover Photo */}
              <div className="relative mb-8">
                <div className="h-64 w-full rounded-xl overflow-hidden">
                  <img
                    src={profile.coverPhoto} 
                    alt="Cover" 
                    className="w-full h-full object-cover"
                    // height={100}
                    // width={100}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-90"></div>
                </div>
                
                {/* Profile Actions */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavigate('edit')}
                    className="px-4 py-2 bg-emerald-500 bg-opacity-80 hover:bg-opacity-100 text-white rounded-lg flex items-center shadow-lg transition-all"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </motion.button>
                </div>

                {/* Profile Avatar and Main Info */}
                <div className="absolute -bottom-16 left-8 flex items-end">
                  <div className="relative">
                    <div className="h-32 w-32 rounded-full border-4 border-gray-900 overflow-hidden">
                      <img
                        src={profile.coverPhoto} 
                        alt={"Profile image"} 
                        className="w-full h-full object-cover"
                        // height={100}
                        // width={100}
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 h-6 w-6 bg-green-500 rounded-full border-2 border-gray-900"></div>
                  </div>
                  <div className="ml-4 mb-4">
                    <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
                    <p className="text-emerald-400">{profile.position}</p>
                  </div>
                </div>
              </div>

              {/* Main Content - Two Column Layout */}
              <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Profile Details */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Contact & Quick Info Card */}
                  <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-4">Contact Information</h2>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <Mail className="h-5 w-5 text-emerald-500 mt-0.5" />
                        <span className="ml-3 text-gray-300">{profile.email}</span>
                      </li>
                    </ul>
                  </div>
                  {/* Quick Actions Card */}
                  <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                    <div className="space-y-2">   
                      <motion.button 
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                      >
                        <div className="flex items-center">
                          <Settings className="h-5 w-5 text-emerald-500 mr-3" />
                          <span>Settings</span>
                        </div>
                        <ChevronRight size={16} />
                      </motion.button>
                      
                      <motion.button 
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                      >
                        <div className="flex items-center">
                          <Trash className="h-5 w-5 text-red-500 mr-3" />
                          <span>Delete Account</span>
                        </div>
                        <ChevronRight size={16} />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Right Column - Bio, Tabs and Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Bio Card */}
                  {/* <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-4">Bio</h2>
                    <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
                  </div> */}

                  {/* Tabs and Content */}
                  <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-700">
                      <button
                        className={`flex-1 py-4 text-center font-medium transition-colors ${
                          selectedTab === 'activity' 
                            ? 'text-emerald-500 border-b-2 border-emerald-500' 
                            : 'text-gray-400 hover:text-gray-200'
                        }`}
                        onClick={() => setSelectedTab('activity')}
                      >
                        Recent Activity
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                      {selectedTab === 'activity' && (
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium text-white mb-4">Your Recent Activity</h3>
                          {profile.activity.map((item) => (
                            <ActivityCard key={item.id} activity={item} />
                          ))}
                        </div>
                      )}

                      {selectedTab === 'achievements' && (
                        <div>
                          <h3 className="text-lg font-medium text-white mb-4">Your Achievements</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {profile.achievements.map((achievement) => (
                              <AchievementCard key={achievement.id} achievement={achievement} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {!isLoading && currentPage === 'edit' && (
            <motion.div
              key="profile-edit"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <div className="flex items-center mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigate('view')}
                  className="mr-4 p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft size={20} />
                </motion.button>
                <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
              </div>

              <ProfileForm 
                profile={profile} 
                onSubmit={handleUpdateProfile}
                onCancel={() => handleNavigate('view')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProfilePage;