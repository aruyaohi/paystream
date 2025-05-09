
'use client'
import React, { useState } from 'react';
import { DollarSign, CheckCircle, Clock, Info, ArrowRight } from 'lucide-react';
import plans from "@/app/lib/plans";

interface SelectedProps {
    planId: string;
    onProceed: (planId: string) => void;
}

const PlanDetails: React.FC<SelectedProps> = ({ planId, onProceed }) => {
    const [investmentAmount, setInvestmentAmount] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const selectedPlan = plans.find(plan => plan.id === planId);

    if (!selectedPlan) {
        return (
            <div className="bg-red-100 p-6 rounded-lg border border-red-300 text-center shadow">
                <p className="text-red-700 font-medium">Plan not found. Please select a different plan.</p>
            </div>
        );
    }

    const getROI = (amount: number) => {
        return (selectedPlan.monthlyPrice / 100 * amount) + amount;
    }

    const handleProceed = () => {
        setIsLoading(true);
        // Simulate network delay
        setTimeout(() => {
            onProceed(planId);
            setIsLoading(false);
        }, 800);
    }

    const calculateCustomReturn = () => {
        if (!investmentAmount) return 0;
        return getROI(investmentAmount);
    }

    const keyBenefits = [
        `${selectedPlan.monthlyPrice}% ROI investment with added bonuses`,
        "Detailed tracking & analysis of investments",
        "Risk management & portfolio diversification",
        "Full refund available within 30 days"
    ];

    return (
        <div className="max-w-3xl mx-auto p-4">
            {/* Plan Header - Enhanced with gradients */}
            <div className={`${selectedPlan.buttonBg} bg-gradient-to-br from-opacity-10 via-opacity-5 to-opacity-0 rounded-xl p-8 text-white shadow-lg`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">{selectedPlan.name} Plan</h2>
                        <p className="mb-4 text-white text-opacity-90">{selectedPlan.description}</p>
                    </div>
                    <div className="bg-white bg-opacity-15 p-4 rounded-lg inline-block backdrop-blur-sm shadow-inner mt-4 md:mt-0">
                        <span className="text-3xl font-bold text-gray-800">{selectedPlan.monthlyPrice}% ROI</span>
                        <p className="text-sm text-black mt-1">For 6 months</p>
                    </div>
                </div>
            </div>
            
            {/* Plan Content - Improved layout and interactions */}
            <div className="bg-white rounded-xl shadow-md mt-6 p-8 border border-gray-100">
                {/* Investment Details */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                        Investment Calculator
                    </h3>
                    
                    <div className="grid gap-6 mb-6">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center">
                                <DollarSign className="w-5 h-5 mr-2 text-gray-600" />
                                <span className="text-gray-900">Minimum Investment</span>
                            </div>
                            <span className="font-bold text-gray-900">${selectedPlan.minInvestment.toLocaleString()}</span>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <label htmlFor="customInvestment" className="block mb-2 font-medium text-gray-700">Calculate your return:</label>
                            <div className="flex items-center">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                                    <input 
                                        type="number" 
                                        id="customInvestment"
                                        className="w-full p-2 pl-8 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800"
                                        placeholder={`${selectedPlan.minInvestment.toLocaleString()} or more`}
                                        min={selectedPlan.minInvestment}
                                        onChange={(e) => setInvestmentAmount(parseFloat(e.target.value) || null)}
                                    />
                                </div>
                                <div className="ml-4 min-w-28 text-right">
                                    <p className="text-sm text-gray-600">Expected return:</p>
                                    <p className="font-bold text-green-700">${investmentAmount ? calculateCustomReturn().toLocaleString() : '0'}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-gray-600" />
                                <span className="text-gray-900">Investment Period</span>
                            </div>
                            <span className="font-bold text-gray-900">6 Months</span>
                        </div>
                    </div>
                </div>
                
                {/* Key Benefits - Enhanced with better visuals */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                        Key Benefits
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {keyBenefits.map((benefit, index) => (
                            <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-900">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start">
                    <Info className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700">
                        Investment returns are based on historical performance and not guaranteed. 
                        Please review our terms and conditions before investing.
                    </p>
                </div>
                
                {/* CTA Button - Enhanced with loading state and better design */}
                <button 
                    onClick={handleProceed}
                    disabled={isLoading}
                    className={`w-full ${selectedPlan.buttonBg} text-white py-4 px-6 rounded-lg font-medium flex items-center justify-center transition-all transform hover:scale-[1.02] shadow-md hover:shadow-lg`}
                >
                    {isLoading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        <span className="flex items-center">
                            Proceed to Payment
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}

export default PlanDetails;