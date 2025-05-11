'use client'
// import Image from "next/image";
// import { User } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
// import {UserButton} from '@civic/auth/react';

const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gray-900">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        {/* Dark background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-black"></div>
        
        {/* Dark grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        
        {/* Digital particles effect - cyber version */}
        <div className="absolute h-full w-full overflow-hidden">
          {Array.from({ length: 30 }).map((_, index) => (
            <div 
              key={index}
              className="absolute rounded-full bg-gradient-to-r from-blue-400 to-emerald-500"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 8 + 2}px`,
                height: `${Math.random() * 8 + 2}px`,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: `${Math.random() * 10}s`,
                opacity: 0.6
              }}
            />
          ))}
        </div>
        
        {/* Hexagon pattern overlay */}
        <div className="absolute inset-0 bg-hexagon-pattern opacity-5"></div>
        
        {/* Subtle glow effect */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className="inline-block bg-gradient-to-r from-blue-600 to-emerald-500 text-black text-xs font-semibold px-4 py-1.5 rounded-full mb-6 shadow-md">
                Next-Gen Crypto Payroll
              </span>
              
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block">Decentralized Payments</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Cryptopowered Payroll</span>
              </h1>
              
              <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl md:mt-5 md:text-xl">
                Join thousands of companies already using PayStream to manage global payroll with stablecoins. 
                Secure, borderless, and instant payments for your team.
              </p>
              
              <div className="mt-8">
                <div className="w-full max-w-md">        
                 <div className="mt-3">
                    <span className="text-sm text-gray-400">Create a paystream account to automate crypto payroll
                      <Link href="/login">
                        <button className="ml-1 text-emerald-400 hover:text-emerald-300 font-medium">Login</button>
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Section */}
            {/* <div className={`flex justify-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="relative w-full max-w-md aspect-square">
                <div className="relative flex items-center justify-center w-full h-full">
                  <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl">
                    <Image 
                      src="/dashboard.png" 
                      alt="Crypto Payroll Dashboard" 
                      className="object-cover"
                      width={600}
                      height={600}
                    />
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Add a style tag for animations */}
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
        
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;