'use client'
import {motion} from 'framer-motion';
import { ArrowLeft,Edit } from 'lucide-react';

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
    employees: Employee[];
    status: "Pending" | "Processed" | "Cancelled";
    payPeriodStart: string;
    payPeriodEnd: string;
  }
// Payroll Details View Component
interface PayrollDetailsProps {
  payroll: Payroll;
  onBack: () => void;
  onEdit: () => void;
}

const PayrollDetails: React.FC<PayrollDetailsProps> = ({ payroll, onBack, onEdit }) => {
  return (
    <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-emerald-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-100">{payroll.name}</h2>
        <motion.button
          onClick={onEdit}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Edit size={18} className="mr-2" />
          Edit Payroll
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 mb-8">
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Date Created</p>
          <p className="text-lg font-medium text-white">
            {new Date(payroll.dateCreated).toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-400">Status</p>
          <p className="text-lg font-medium">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
              payroll.status === 'Processed' ? 'bg-green-100 text-green-800' :
              payroll.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {payroll.status}
            </span>
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-400">Pay Period</p>
          <p className="text-lg font-medium text-white">
            {new Date(payroll.payPeriodStart).toLocaleDateString()} - {new Date(payroll.payPeriodEnd).toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-400">Total Amount (USDC)</p>
          <p className="text-lg font-medium text-emerald-400">
            ${payroll.totalAmount.toLocaleString()}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-400">Number of Employees</p>
          <p className="text-lg font-medium text-white">{payroll.employees.length}</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Included Employees</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Position
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Salary
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {payroll.employees.map(employee => (
                <tr key={employee.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {employee.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {employee.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {employee.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-emerald-400">
                    ${employee.salary.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-700">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center text-gray-300 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Payroll List
        </motion.button>
      </div>
    </div>
  );
};


export default PayrollDetails