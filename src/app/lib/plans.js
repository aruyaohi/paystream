import { Bookmark, TrendingUp, Sparkles, ShieldCheck } from "lucide-react";

const plans = [
  {
    id: "basic",
    name: "Basic Investor",
    description: "Ideal for beginners with a minimum investment of $1000.",
    benefits: [
      "20% 6-months ROI potential",
      "Weekly performance reports",
      "Essential Tesla market updates",
      "No hidden fees or commissions",
      "24/7 customer support"
    ],
    monthlyPrice: 20,
    minInvestment: 100,
    icon: <Bookmark className="h-6 w-6" />,
    bgColor: "bg-gray-50",
    iconBg: "bg-gray-600",
    buttonBg: "bg-gray-600 hover:bg-gray-700",
    borderColor: "border-gray-900",
    link: "",
    textColor: 'text-gray-900',
  },
  {
    id: "plus",
    name: "Plus Investor",
    description: "For intermediate investors starting with $5,000.",
    benefits: [
      "40% 6-months ROI potential",
      "Advanced portfolio optimization",
      "Bi-weekly Tesla investment strategy calls",
      "Priority customer service",
      "Detailed market trend analysis"
    ],
    monthlyPrice: 40,
    minInvestment: 1000,
    icon: <TrendingUp className="h-6 w-6" />,
    bgColor: "bg-gray-50",
    iconBg: "bg-gray-900",
    buttonBg: "bg-gray-900 hover:bg-gray-800",
    borderColor: "border-gray-900",
    textColor: 'text-gray-900',
    link: "",
  },
  {
    id: "premium",
    name: "Premium Investor",
    description: "Designed for serious investors committing $10,000.",
    benefits: [
      "55% 6months ROI potential",
      "Exclusive Tesla stock opportunities",
      "Real-time market insights",
      "Personalized investment strategy",
      "Quarterly consultation with expert analysts"
    ],
    monthlyPrice: 55,
    minInvestment: 5000,
    popular: true,
    icon: <Sparkles className="h-6 w-6" />,
    bgColor: "bg-red-50",
    iconBg: "bg-red-600",
    buttonBg: "bg-red-600 hover:bg-red-700",
    borderColor: "border-red-600",
    textColor: 'text-red-600',
    link: "",
  },
  {
    id: "gold",
    name: "Gold Investor",
    description: "Exclusive tier for investors with $25,000+.",
    benefits: [
      "76% 6-months ROI potential",
      "VIP Tesla Bitcoin Mining insights",
      "Institutional-grade research reports",
      "Dedicated account manager",
      "Early access to new investment opportunities"
    ],
    monthlyPrice: 75.6,
    minInvestment: 10000,
    icon: <ShieldCheck className="h-6 w-6" />,
    bgColor: "bg-amber-50",
    iconBg: "bg-amber-400",
    buttonBg: "bg-amber-400 hover:bg-amber-500",
    borderColor: "border-yellow-500",
    textColor: 'text-amber-400',
    link: "",
  }
];

export default plans;