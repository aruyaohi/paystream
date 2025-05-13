'use client'

import React,{useState,useEffect} from "react";
import { motion } from "framer-motion";

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
  
  // Define a type for a Payroll
  interface Payroll {
    id: string;
    name: string;
    dateCreated: string;
    totalAmount: number;
    type: 'one-time'|'concurrent';
    employees: Employee[];
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
  const [formData, setFormData] = useState<Omit<Payroll, 'id'> | Payroll>(payroll || {
    name: "",
    dateCreated: new Date().toISOString().split('T')[0],
    totalAmount: 0,
    employees: [],
    type: 'one-time',
    status: "Pending",
    payPeriodStart: "",
    payPeriodEnd: ""
  });
  
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>(
    payroll ? payroll.employees.map(emp => emp.id) : []
  );

  useEffect(() => {
    if (payroll) {
      setFormData(payroll);
      setSelectedEmployeeIds(payroll.employees.map(emp => emp.id));
    }
  }, [payroll]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'totalAmount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleEmployeeSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedEmployeeIds(selectedOptions);
    
    // Update employees array and calculate total amount
    const selectedEmployeeObjects = employees.filter(emp => selectedOptions.includes(emp.id));
    const totalSalary = selectedEmployeeObjects.reduce((sum, emp) => sum + emp.salary, 0);
    
    setFormData(prevData => ({
      ...prevData,
      employees: selectedEmployeeObjects,
      totalAmount: totalSalary
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-100 mb-1">
            Payroll Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-800 text-white"
          />
        </div>

        <div>
          <label htmlFor="dateCreated" className="block text-sm font-medium text-gray-100 mb-1">
            Date Created
          </label>
          <input
            type="date"
            id="dateCreated"
            name="dateCreated"
            value={formData.dateCreated}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-800 text-white"
          />
        </div>

        <div>
          <label htmlFor="payPeriodStart" className="block text-sm font-medium text-gray-100 mb-1">
            Pay Period Start
          </label>
          <input
            type="date"
            id="payPeriodStart"
            name="payPeriodStart"
            value={formData.payPeriodStart}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-800 text-white"
          />
        </div>

        <div>
          <label htmlFor="payPeriodEnd" className="block text-sm font-medium text-gray-100 mb-1">
            Pay Period End
          </label>
          <input
            type="date"
            id="payPeriodEnd"
            name="payPeriodEnd"
            value={formData.payPeriodEnd}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-800 text-white"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-100 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-800 text-white"
          >
            <option value="Pending">Pending</option>
            <option value="Processed">Processed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-100 mb-1">
            Total Amount (USDC)
          </label>
          <input
            type="number"
            id="totalAmount"
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleChange}
            readOnly
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-700 text-white"
          />
          <p className="text-xs text-gray-400 mt-1">This is calculated automatically based on selected employees</p>
        </div>
      </div>

      <div>
        <label htmlFor="employees" className="block text-sm font-medium text-gray-100 mb-1">
          Select Employees
        </label>
        <select
          id="employees"
          multiple
          size={5}
          value={selectedEmployeeIds}
          onChange={handleEmployeeSelection}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-800 text-white"
        >
          {employees.map(employee => (
            <option key={employee.id} value={employee.id}>
              {employee.name} - {employee.position} (${employee.salary.toLocaleString()})
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-400 mt-1">Hold Ctrl/Cmd to select multiple employees</p>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <motion.button
          type="button"
          onClick={onCancel}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2.5 border border-gray-300 text-gray-300 font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          Cancel
        </motion.button>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          {payroll ? 'Update Payroll' : 'Create Payroll'}
        </motion.button>
      </div>
    </form>
  );
};


export default PayrollForm;