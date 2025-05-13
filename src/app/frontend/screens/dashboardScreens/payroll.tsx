'use client'
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "../../components/loading";
import PayrollForm from "./payroll_screens/payroll_form";
import PayrollDetails from "./payroll_screens/payroll_details";

import {
  ArrowLeft,
  Trash2,
  Search,
  ChevronDown,
  Filter,
  Download,
  Users,
  CalendarClock,
  TrendingUp,
  Edit,
  CheckCircle,
  FilePen
} from "lucide-react";


interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  salary: number;
  joinDate: string;
  status: "Active" | "On Leave" | "Terminated";
  walletAddress : string,
  email: string;
}

interface Payroll {
  id: string;
  name: string;
  dateCreated: string;
  totalAmount: number;
  type: 'one-time' | 'concurrent',
  employees: Employee[];
  status: "Pending" | "Processed" | "Cancelled";
  payPeriodStart: string;
  payPeriodEnd: string;
}

const initialEmployees: Employee[] = [
];

const initialPayrolls: Payroll[] = [
];

type PageType = 'list' | 'create' | 'edit' | 'view';

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



// Main Payroll Management Component
const PayrollManagement: React.FC = () => {
  const [payrolls, setPayrolls] = useState<Payroll[]>(initialPayrolls);
  const [employees,setEmployees] = useState<Employee[]>(initialEmployees)
  const [currentPage, setCurrentPage] = useState<PageType>('list');
  const [isLoading, setIsLoading] = useState(false);
  const [targetPage, setTargetPage] = useState<PageType | null>(null);
  const [currentPayroll, setCurrentPayroll] = useState<Payroll | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Effect to handle page transitions with loading
  useEffect(() => {
    if (targetPage && isLoading) {
      const timer = setTimeout(() => {
        setCurrentPage(targetPage);
        setIsLoading(false);
        setTargetPage(null);
      }, Math.random() * 800 + 400);

      return () => clearTimeout(timer);
    }
  }, [targetPage, isLoading]);

  // Handle page change with loading effect
  const changePageWithLoading = (newPage: PageType, additionalAction: (() => void) | null = null) => {
    setIsLoading(true);
    setTargetPage(newPage);
    if (additionalAction) additionalAction();
  };

  // Function to create a new payroll
  const handleCreatePayroll = () => {
    changePageWithLoading('create');
  };

  // Function to edit a payroll
  const handleEditPayroll = (payroll: Payroll) => {
    changePageWithLoading('edit', () => setCurrentPayroll(payroll));
  };

  // Function to view payroll details
  const handleViewPayroll = (payroll: Payroll) => {
    changePageWithLoading('view', () => setCurrentPayroll(payroll));
  };

  // Function to go back to list
  const handleBackToList = () => {
    changePageWithLoading('list', () => setCurrentPayroll(null));
  };

  // Function to submit payroll form (create or edit)
  const handleSubmitPayrollForm = (payrollData: Omit<Payroll, 'id'> | Payroll) => {
    if (currentPage === 'create') {
      // Create new payroll with unique ID
      const newPayroll: Payroll = {
        ...payrollData as Omit<Payroll, 'id'>,
        id: `pay${String(payrolls.length + 1).padStart(3, '0')}`
      };
      setPayrolls([...payrolls, newPayroll]);
    } else if (currentPage === 'edit') {
      // Update existing payroll
      setPayrolls(payrolls.map(payroll =>
        payroll.id === (payrollData as Payroll).id ? payrollData as Payroll : payroll
      ));
    }
    changePageWithLoading('list');
  };

  // Function to delete a payroll
  const handleDeletePayroll = (payrollId: string) => {
    if (confirm('Are you sure you want to delete this payroll?')) {
      setPayrolls(payrolls.filter(payroll => payroll.id !== payrollId));
    }
  };

  // Get unique statuses for filter
  const statuses = ['All', ...new Set(payrolls.map(payroll => payroll.status))];

  // Filter payrolls based on search and filters
  const filteredPayrolls = payrolls.filter(payroll => {
    const matchesSearch = payroll.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || payroll.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalPayrolls = payrolls.length;
  const pendingPayrolls = payrolls.filter(payroll => payroll.status === 'Pending').length;
  const totalPayrollAmount = payrolls.reduce((sum, payroll) => sum + payroll.totalAmount, 0);

  return (
    <section className="py-12 bg-gray-900 min-h-screen">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {isLoading && <LoadingScreen />}

          {!isLoading && currentPage === 'list' && (
            <motion.div
              key="payroll-list"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white">Payroll Management</h2>
                  <p className="mt-1 text-gray-300">Manage your active payrolls</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCreatePayroll}
                  className="mt-4 md:mt-0 px-6 py-3 bg-emerald-500 text-white rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-md"
                >
                  <FilePen className="mr-2 h-5 w-5" />
                  Create New Payroll
                </motion.button>
              </div>

              <div className="rounded-2xl overflow-hidden border border-gray-700 shadow-lg">
          {/* Total Balance Section */}
          <div className="p-6 border-b border-gray-700 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-emerald-500 opacity-10 blur-xl"></div>
            <div className="absolute -left-8 -bottom-8 h-16 w-16 rounded-full bg-blue-500 opacity-10 blur-xl"></div>
            
            <p className="text-gray-400 text-sm mb-1">Total Payroll Balance</p>
            <div className="flex items-baseline">
              <h1 className="text-4xl font-bold text-white">{totalPayrollAmount.toLocaleString()} <span className="text-sm">USDC </span></h1>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 divide-x divide-gray-700">
            {/* Left Stat */}
            <div className="p-5 border-b border-gray-700">
              <div className="flex items-center mb-2">
                <div className="h-6 w-6 rounded bg-gray-700 flex items-center justify-center">
                  <Users className="h-3 w-3 text-emerald-400" />
                </div>
                <p className="ml-2 text-gray-400 text-xs">Total Payrolls</p>
              </div>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-white">{totalPayrolls}</p>
              </div>
            </div>

            {/* Right Stat */}
            <div className="p-5 border-b border-gray-700">
              <div className="flex items-center mb-2">
                <div className="h-6 w-6 rounded bg-gray-700 flex items-center justify-center">
                  <CalendarClock className="h-3 w-3 text-emerald-400" />
                </div>
                <p className="ml-2 text-gray-400 text-xs">Pending Payrolls</p>
              </div>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-white">{pendingPayrolls}</p>
              </div>
            </div>

              {/* Right Stat */}
              <div className="p-5 border-b border-gray-700">
              <div className="flex items-center mb-2">
                <div className="h-6 w-6 rounded bg-gray-700 flex items-center justify-center">
                  <CalendarClock className="h-3 w-3 text-emerald-400" />
                </div>
                <p className="ml-2 text-gray-400 text-xs">Pending Payrolls</p>
              </div>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-white">{pendingPayrolls}</p>
              </div>
            </div>
          </div>
          </div>

              {/* Search and Filter Controls */}
              <div className="bg-gray-800 p-4 rounded-xl shadow-md mb-6 border border-gray-700 mt-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="w-full md:w-1/3 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search payrolls..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white"
                    />
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="pl-4 pr-10 py-2.5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white appearance-none"
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>{status} Status</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                    <button className="flex items-center px-4 py-2.5 border border-emerald-500 rounded-lg hover:bg-emerald-500 bg-transparent text-emerald-400 hover:text-white transition-colors">
                      <Download size={18} className="mr-2" /> 
                      Export
                    </button>
                  </div>
                </div>
              </div>

              {/* Payroll Table */}
              <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900">
                      <tr>
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Payroll Name
                        </th>
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Date Created
                        </th>
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Pay Period
                        </th>
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3.5 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Total Amount
                        </th>
                        <th scope="col" className="px-6 py-3.5 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filteredPayrolls.length > 0 ? (
                        filteredPayrolls.map((payroll) => (
                          <tr key={payroll.id} className="hover:bg-gray-750">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white cursor-pointer" 
                                onClick={() => handleViewPayroll(payroll)}>
                              {payroll.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {new Date(payroll.dateCreated).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {new Date(payroll.payPeriodStart).toLocaleDateString()} - {new Date(payroll.payPeriodEnd).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                payroll.status === 'Processed' ? 'bg-green-100 text-green-800' :
                                payroll.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {payroll.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-emerald-400 font-medium">
                              ${payroll.totalAmount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-3">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleViewPayroll(payroll)}
                                  className="text-gray-400 hover:text-emerald-500 transition-colors"
                                >
                                  <CheckCircle size={18} />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleEditPayroll(payroll)}
                                  className="text-gray-400 hover:text-blue-500 transition-colors"
                                >
                                  <Edit size={18} />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDeletePayroll(payroll.id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 size={18} />
                                </motion.button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                            <div className="flex flex-col items-center">
                              <Filter className="w-12 h-12 mb-4 text-gray-500" />
                              <p className="text-lg font-medium">No payrolls found</p>
                              <p className="text-sm text-gray-500 mt-1">
                                Try adjusting your search or filter criteria
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {!isLoading && currentPage === 'create' && (
            <motion.div
              key="create-payroll"
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
                  onClick={handleBackToList}
                  className="flex items-center text-gray-300 hover:text-emerald-400 transition-colors"
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Back to Payroll List
                </motion.button>
              </div>

              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6">Create New Payroll</h2>
                <PayrollForm
                  payroll={null}
                  employees={employees}
                  onSubmit={handleSubmitPayrollForm}
                  onCancel={handleBackToList}
                />
              </div>
            </motion.div>
          )}

          {!isLoading && currentPage === 'edit' && currentPayroll && (
            <motion.div
              key="edit-payroll"
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
                  onClick={handleBackToList}
                  className="flex items-center text-gray-300 hover:text-emerald-400 transition-colors"
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Back to Payroll List
                </motion.button>
              </div>

              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6">Edit Payroll</h2>
                <PayrollForm
                  payroll={currentPayroll}
                  employees={employees}
                  onSubmit={handleSubmitPayrollForm}
                  onCancel={handleBackToList}
                />
              </div>
            </motion.div>
          )}

          {!isLoading && currentPage === 'view' && currentPayroll && (
            <motion.div
              key="view-payroll"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <PayrollDetails
                payroll={currentPayroll}
                onBack={handleBackToList}
                onEdit={() => handleEditPayroll(currentPayroll)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PayrollManagement;