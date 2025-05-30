

'use client'

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, X, DollarSign, Calendar,CheckCircle, Users, Plus, ArrowRight } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  salary: number;
  joinDate: string;
  status: "Active" | "On Leave" | "Terminated";
  walletAddress: string;
  email: string;
}

interface EmployeePayment {
  employeeId: string;
  amount: number;
}


interface Payroll {
  id: string;
  name: string;
  dateCreated: string;
  payday: string;
  totalAmount: number;
  budget: number;
  type: 'one-time' | 'concurrent';
  frequency?: 'weekly' | 'monthly' | 'yearly';
  employees: Employee[];
  employeePayments: EmployeePayment[];
  status: "Pending" | "Processed" | "Cancelled";
  payPeriodStart: string;
  payPeriodEnd: string;
}

interface PayrollFormProps {
  payroll: Payroll | null;
  employees: Employee[];
  onSubmit: (payrollData: Omit<Payroll, 'id'> | Payroll) => void;
  onCancel: () => void;
}

const PayrollForm: React.FC<PayrollFormProps> = ({ payroll, employees, onSubmit, onCancel }) => {
  // Initialize with existing data or defaults
  const [formData, setFormData] = useState<Omit<Payroll, 'id'> | Payroll>(
    payroll || {
      name: "",
      dateCreated: new Date().toISOString().split('T')[0],
      payday: "",
      totalAmount: 0,
      budget: 0,
      employees: [],
      employeePayments: [],
      type: 'one-time',
      status: "Pending",
      payPeriodStart: "",
      payPeriodEnd: ""
    }
  );
  
  // State for employee selector modal
  const [isEmployeeSelectorOpen, setIsEmployeeSelectorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>(
    payroll ? payroll.employees : []
  );
  const [employeePayments, setEmployeePayments] = useState<EmployeePayment[]>(
    payroll ? payroll.employeePayments : []
  );
  
  // Ref for click outside detection
  const selectorRef = useRef<HTMLDivElement>(null);
  
  // Close selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsEmployeeSelectorOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Update form when payroll prop changes
  useEffect(() => {
    if (payroll) {
      setFormData(payroll);
      setSelectedEmployees(payroll.employees);
      setEmployeePayments(payroll.employeePayments || []);
    }
  }, [payroll]);
  
  // Update total amount when employee payments change
  useEffect(() => {
    const total = employeePayments.reduce((sum, payment) => sum + payment.amount, 0);
    setFormData(prev => ({
      ...prev,
      totalAmount: total,
      employees: selectedEmployees,
      employeePayments: employeePayments
    }));
  }, [employeePayments, selectedEmployees]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'budget' ? parseFloat(value) || 0 : value
    }));
  };
  
  // Handle employee payment amount changes
  const handlePaymentChange = (employeeId: string, amount: number) => {
    setEmployeePayments(prev => {
      const existing = prev.find(p => p.employeeId === employeeId);
      if (existing) {
        return prev.map(p => p.employeeId === employeeId ? { ...p, amount } : p);
      } else {
        return [...prev, { employeeId, amount }];
      }
    });
  };
  
  // Toggle employee selection
  const toggleEmployeeSelection = (employee: Employee) => {
    setSelectedEmployees(prev => {
      const isSelected = prev.some(e => e.id === employee.id);
      if (isSelected) {
        // Also remove from payments
        setEmployeePayments(payments => payments.filter(p => p.employeeId !== employee.id));
        return prev.filter(e => e.id !== employee.id);
      } else {
        // Add default payment based on salary
        setEmployeePayments(payments => [
          ...payments,
          { employeeId: employee.id, amount: employee.salary }
        ]);
        return [...prev, employee];
      }
    });
  };
  
  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Submit form handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  // Get employee payment amount
  const getEmployeePayment = (employeeId: string) => {
    const payment = employeePayments.find(p => p.employeeId === employeeId);
    return payment ? payment.amount : 0;
  };
  
  // Remove employee from selection
  const removeEmployee = (employeeId: string) => {
    setSelectedEmployees(prev => prev.filter(e => e.id !== employeeId));
    setEmployeePayments(prev => prev.filter(p => p.employeeId !== employeeId));
  };
  
  // Get departments for grouping
  const departments = Array.from(new Set(employees.map(e => e.department)));
  
  // Set equal distribution of budget
  const distributeEvenly = () => {
    if (selectedEmployees.length === 0 || formData.budget <= 0) return;
    
    const amountPerEmployee = formData.budget / selectedEmployees.length;
    const newPayments = selectedEmployees.map(employee => ({
      employeeId: employee.id,
      amount: parseFloat(amountPerEmployee.toFixed(2))
    }));
    
    setEmployeePayments(newPayments);
  };
  
  // Set according to salary ratio
  const distributeByRatio = () => {
    if (selectedEmployees.length === 0 || formData.budget <= 0) return;
    
    const totalSalary = selectedEmployees.reduce((sum, emp) => sum + emp.salary, 0);
    const newPayments = selectedEmployees.map(employee => {
      const ratio = employee.salary / totalSalary;
      return {
        employeeId: employee.id,
        amount: parseFloat((formData.budget * ratio).toFixed(2))
      };
    });
    
    setEmployeePayments(newPayments);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mr-4">
            <DollarSign className="w-6 h-6 text-emerald-500" />
          </div>
          <h2 className="text-xl font-semibold text-white">
            {payroll ? 'Update Payroll' : 'Create New Payroll'}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payroll Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Payroll Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-800/50 text-white transition-colors"
              placeholder="May 2025 Payroll"
            />
          </div>

          {/* Payday */}
          <div className="space-y-2">
            <label htmlFor="payday" className="block text-sm font-medium text-gray-300">
              Payday
            </label>
            <div className="relative">
              <input
                type="date"
                id="payday"
                name="payday"
                value={formData.payday}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-800/50 text-white pl-10 transition-colors"
              />
              <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Payroll Type */}
          <div className="space-y-2">
            <label htmlFor="type" className="block text-sm font-medium text-gray-300">
              Payroll Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-800/50 text-white transition-colors appearance-none"
            >
              <option value="one-time">One-time Payment</option>
              <option value="concurrent">Recurring Payment</option>
            </select>
          </div>

          {/* Frequency (only shown for concurrent payrolls) */}
          {formData.type === 'concurrent' && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-300">
                Payment Frequency
              </label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency || 'monthly'}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-800/50 text-white transition-colors"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </motion.div>
          )}

          {/* Pay Period Start */}
          <div className="space-y-2">
            <label htmlFor="payPeriodStart" className="block text-sm font-medium text-gray-300">
              Pay Period Start
            </label>
            <div className="relative">
              <input
                type="date"
                id="payPeriodStart"
                name="payPeriodStart"
                value={formData.payPeriodStart}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-800/50 text-white pl-10 transition-colors"
              />
              <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Pay Period End */}
          <div className="space-y-2">
            <label htmlFor="payPeriodEnd" className="block text-sm font-medium text-gray-300">
              Pay Period End
            </label>
            <div className="relative">
              <input
                type="date"
                id="payPeriodEnd"
                name="payPeriodEnd"
                value={formData.payPeriodEnd}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-800/50 text-white pl-10 transition-colors"
              />
              <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium text-gray-300">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-800/50 text-white transition-colors"
            >
              <option value="Pending">Pending</option>
              <option value="Processed">Processed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <label htmlFor="budget" className="block text-sm font-medium text-gray-300">
              Budget (USDC)
            </label>
            <div className="relative">
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-800/50 text-white pl-10 transition-colors"
                placeholder="10000"
              />
              <DollarSign className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Budget Distribution Controls */}
        {formData.budget > 0 && selectedEmployees.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-300">Payment Distribution</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={distributeEvenly}
                  className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                >
                  Equal Split
                </button>
                <button
                  type="button"
                  onClick={distributeByRatio}
                  className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                >
                  Salary Ratio
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <div className="text-gray-400">
                Total Budget: <span className="text-emerald-500 font-medium">${formData.budget.toLocaleString()}</span>
              </div>
              <div className="text-gray-400">
                Allocated: <span className={`font-medium ${formData.totalAmount > formData.budget ? 'text-red-500' : 'text-blue-400'}`}>
                  ${formData.totalAmount.toLocaleString()}</span>
                <span className="text-gray-500 ml-1">
                  ({((formData.totalAmount / formData.budget) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
            
            {formData.totalAmount > formData.budget && (
              <div className="text-xs text-red-500 flex items-center gap-1">
                <X className="h-3 w-3" />
                Allocated amount exceeds budget by ${(formData.totalAmount - formData.budget).toLocaleString()}
              </div>
            )}
          </motion.div>
        )}

        {/* Employee Selection */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-300">
              Select Employees
            </label>
            <span className="text-xs text-gray-400">
              {selectedEmployees.length} employee{selectedEmployees.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          {/* Employee Selection Button */}
          <div className="relative" ref={selectorRef}>
            <button
              type="button"
              onClick={() => setIsEmployeeSelectorOpen(!isEmployeeSelectorOpen)}
              className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-800/50 text-white text-left flex justify-between items-center transition-colors hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-gray-400" />
                {selectedEmployees.length 
                  ? `${selectedEmployees.length} employee${selectedEmployees.length !== 1 ? 's' : ''} selected` 
                  : 'Click to select employees'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            
            {/* Employee Selector Modal */}
            <AnimatePresence>
              {isEmployeeSelectorOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 w-full mt-2 z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-xl"
                  style={{ maxHeight: '400px' }}
                >
                  <div className="p-4">
                    {/* Search Bar */}
                    <div className="relative mb-3">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search employees..."
                        className="w-full pl-9 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={() => setSearchTerm("")}
                          className="absolute right-3 top-2.5"
                        >
                          <X className="h-4 w-4 text-gray-400 hover:text-white" />
                        </button>
                      )}
                    </div>
                    
                    {/* Employee List */}
                    <div className="overflow-y-auto max-h-64 pr-1">
                      {departments.map(department => {
                        const deptEmployees = filteredEmployees.filter(e => e.department === department);
                        if (deptEmployees.length === 0) return null;
                        
                        return (
                          <div key={department} className="mb-3">
                            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1 px-2">{department}</div>
                            <div className="space-y-1">
                              {deptEmployees.map(employee => {
                                const isSelected = selectedEmployees.some(e => e.id === employee.id);
                                return (
                                  <button
                                    key={employee.id}
                                    type="button"
                                    onClick={() => toggleEmployeeSelection(employee)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded ${
                                      isSelected 
                                        ? 'bg-emerald-900/30 border border-emerald-800' 
                                        : 'hover:bg-gray-700'
                                    }`}
                                  >
                                    <div className="flex items-center">
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                                        isSelected ? 'bg-emerald-500/20 text-emerald-500' : 'bg-gray-700 text-gray-400'
                                      }`}>
                                        {isSelected ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-3 h-3" />}
                                      </div>
                                      <div className="text-left">
                                        <div className="text-sm font-medium text-white">{employee.name}</div>
                                        <div className="text-xs text-gray-400">{employee.position}</div>
                                      </div>
                                    </div>
                                    <div className="text-xs font-medium text-gray-300">
                                      ${employee.salary.toLocaleString()}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                      
                      {filteredEmployees.length === 0 && (
                        <div className="py-6 text-center text-gray-400">
                          No employees found matching &#34;{searchTerm}&#34;
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border-t border-gray-700 bg-gray-800 rounded-b-lg">
                    <div className="text-xs text-gray-400">
                      {selectedEmployees.length} of {employees.length} selected
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEmployeeSelectorOpen(false)}
                      className="px-3 py-1 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Selected Employees Display */}
          {selectedEmployees.length > 0 && (
            <div className="mt-4 space-y-3 bg-gray-800/50 rounded-lg border border-gray-700 p-4">
              <div className="flex justify-between items-center text-sm pb-2 border-b border-gray-700">
                <div className="font-medium text-gray-300">Employee</div>
                <div className="font-medium text-gray-300">Payment Amount (USDC)</div>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {selectedEmployees.map(employee => (
                  <div key={employee.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => removeEmployee(employee.id)}
                        className="w-6 h-6 rounded-full flex items-center justify-center bg-red-500/10 text-red-400 hover:bg-red-500/20 mr-2"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div>
                        <div className="text-sm font-medium text-white">{employee.name}</div>
                        <div className="text-xs text-gray-400">{employee.position}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={getEmployeePayment(employee.id)}
                        onChange={(e) => handlePaymentChange(employee.id, parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1 text-right bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Total Amount */}
              <div className="pt-3 border-t border-gray-700 flex justify-between items-center">
                <div className="text-sm font-medium text-gray-300">Total Payment Amount:</div>
                <div className="text-lg font-semibold text-emerald-500">${formData.totalAmount.toLocaleString()}</div>
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6">
          <motion.button
            type="button"
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2.5 border border-gray-600 text-gray-300 font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center"
          >
            Cancel
          </motion.button>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors flex items-center"
            disabled={formData.totalAmount === 0 || selectedEmployees.length === 0}
          >
            <span>{payroll ? 'Update Payroll' : 'Create Payroll'}</span>
            <ArrowRight className="ml-2 w-4 h-4" />
          </motion.button>
        </div>
      </form>
      
      {/* Background decorative elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};

export default PayrollForm;