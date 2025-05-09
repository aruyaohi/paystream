'use client'
import React from "react";
import { 
  Shield, 
  Mail, 
  Github, 
  Twitter, 
  Linkedin, 
  ArrowRight,
  Zap
} from "lucide-react";

const PayStreamFooter = () => {
  return (
    <footer className="bg-gray-900">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-hexagon-pattern opacity-5"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Top section with newsletter */}
        <div className="pb-8 mb-8 border-b border-green-800">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-2">Stay updated on PayStream</h3>
              <p className="text-gray-300 mb-4">
                Get the latest news, product updates and industry insights delivered to your inbox.
              </p>
            </div>
            <div className="lg:col-span-1">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-grow px-4 py-3 bg-gray-800 text-gray-200 rounded-l-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="px-4 py-3 bg-gradient-to-r from-blue-600 to-emerald-500 hover:shadow-lg hover:shadow-blue-500/20 text-white font-medium rounded-r-md flex items-center transition-all">
                  Subscribe
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Column 1: Logo and info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full p-2 mr-2">
                <Zap className="h-6 w-6 text-black" />
              </div>
              <span className="text-2xl font-bold text-white">PayStream</span>
            </div>
            <p className="text-gray-300 mb-4">
              The future of global payroll for remote teams. Fast, secure, and borderless.
            </p>
            <div className="flex space-x-4 mb-4">
              <a href="/twitter" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="/linkedin" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="/github" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Column 3: Resources & Contact */}
          <div className="flex justify-between">
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-3 mb-6">
                <li>
                  <a href="/dashboard" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="/global-payroll" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center">
                    Global Payroll
                  </a>
                </li>
                <li>
                  <a href="/documentation" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="/api" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="/help" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <div className="text-gray-300 mb-2 flex items-center">
                <Mail className="h-4 w-4 mr-2 text-blue-400" />
                <a href="mailto:hello@paystream.io" className="hover:text-emerald-400 transition-colors">
                  hello@paystream.io
                </a>
              </div>
              <div className="text-gray-300 mb-2 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-blue-400" />
                <a href="mailto:security@paystream.io" className="hover:text-emerald-400 transition-colors">
                  security@paystream.io
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom bar with legal */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} PayStream Technologies, Inc. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</a>
              <a href="/cookies" className="hover:text-blue-400 transition-colors">Cookie Policy</a>
              <a href="/dpa" className="hover:text-blue-400 transition-colors">DPA</a>
              <a href="/acceptable-use" className="hover:text-blue-400 transition-colors">Acceptable Use</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add styles for patterns */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(75, 85, 99, 0.3) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(75, 85, 99, 0.3) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        .bg-hexagon-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 20 L55 50 L30 65 L5 50 L5 20 Z' fill='none' stroke='rgba(59, 130, 246, 0.3)' stroke-width='0.5'/%3E%3C/svg%3E");
          background-size: 60px 60px;
        }
      `}</style>
    </footer>
  );
};

export default PayStreamFooter;