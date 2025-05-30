'use client'
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Search,
  ChevronDown,
  Download,
  FilePen
} from "lucide-react";

// Define a type for a User on payroll
interface User {
  id: string;
  name: string;
  position: string;
  department: string;
  salary: number;
  joinDate: string;
  status: "Active" | "On Leave" | "Terminated";
  paymentMethod: "Direct Deposit" | "Check";
  email: string;
}

// Mock data for users on payroll
const initialUsers: User[] = [
];

// Define page types
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

// User Form Component
interface UserFormProps {
  user: User | null;
  onSubmit: (userData: Omit<User, 'id'> | User) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<User, 'id'> | User>(user || {
    name: "",
    position: "",
    department: "",
    salary: 0,
    joinDate: "",
    status: "Active",
    paymentMethod: "Direct Deposit",
    email: ""
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'salary' ? parseFloat(value) || 0 : value
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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
            Position
          </label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
            Annual Salary ($)
          </label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div>
          <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700 mb-1">
            Join Date
          </label>
          <input
            type="date"
            id="joinDate"
            name="joinDate"
            value={formData.joinDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Terminated">Terminated</option>
          </select>
        </div>

        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="Direct Deposit">Direct Deposit</option>
            <option value="Check">Check</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <motion.button
          type="button"
          onClick={onCancel}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </motion.button>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
        >
          {user ? 'Update Employee' : 'Add Employee'}
        </motion.button>
      </div>
    </form>
  );
};

// User Details View Component
interface UserDetailsProps {
  user: User;
  onBack: () => void;
  onEdit: () => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user, onBack, onEdit }) => {
  return (
    <div className="bg-gray-900 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Employee Details</h2>
        <motion.button
          onClick={onEdit}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Edit size={18} className="mr-2" />
          Edit Details
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Full Name</p>
          <p className="text-lg font-medium">{user.name}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-lg font-medium">{user.email}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-500">Position</p>
          <p className="text-lg font-medium">{user.position}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-500">Department</p>
          <p className="text-lg font-medium">{user.department}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-500">Annual Salary</p>
          <p className="text-lg font-medium">${user.salary.toLocaleString()}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-500">Join Date</p>
          <p className="text-lg font-medium">{new Date(user.joinDate).toLocaleDateString()}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-500">Status</p>
          <p className="text-lg font-medium">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
              user.status === 'Active' ? 'bg-green-100 text-green-800' :
              user.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {user.status}
            </span>
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-500">Payment Method</p>
          <p className="text-lg font-medium">{user.paymentMethod}</p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Employee List
        </motion.button>
      </div>
    </div>
  );
};


// Main Payroll Management Component
const EmployeePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentPage, setCurrentPage] = useState<PageType>('list');
  const [isLoading, setIsLoading] = useState(false);
  const [targetPage, setTargetPage] = useState<PageType | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
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

  // Function to create a new user
  const handleCreateUser = () => {
    changePageWithLoading('create');
  };

  // Function to edit a user
  const handleEditUser = (user: User) => {
    changePageWithLoading('edit', () => setCurrentUser(user));
  };

  // Function to view user details
  const handleViewUser = (user: User) => {
    changePageWithLoading('view', () => setCurrentUser(user));
  };

  // Function to go back to list
  const handleBackToList = () => {
    changePageWithLoading('list', () => setCurrentUser(null));
  };

  // Function to submit user form (create or edit)
  const handleSubmitUserForm = (userData: Omit<User, 'id'> | User) => {
    if (currentPage === 'create') {
      // Create new user with unique ID
      const newUser: User = {
        ...userData as Omit<User, 'id'>,
        id: `usr${String(users.length + 1).padStart(3, '0')}`
      };
      setUsers([...users, newUser]);
    } else if (currentPage === 'edit') {
      // Update existing user
      setUsers(users.map(user =>
        user.id === (userData as User).id ? userData as User : user
      ));
    }

    changePageWithLoading('list');
  };

  // Function to delete a user
  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to remove this employee from payroll?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  // Get unique departments for filter
  const departments = ['All', ...new Set(users.map(user => user.department))];

  // Get unique statuses for filter
  const statuses = ['All', ...new Set(users.map(user => user.status))];

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = departmentFilter === 'All' || user.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <section className="py-12 bg-gray-900 min-h-screen">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {isLoading && <LoadingScreen />}

          {!isLoading && currentPage === 'list' && (
            <motion.div
              key="employee-list"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-100">Team Management</h2>
                  <p className="mt-1 text-gray-200">Manage your Team Informations here...</p>
                </div>
                <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCreateUser}
                  className="mt-4 md:mt-0 px-6 py-3 bg-gray-900 border border-emerald-500 text-white hover:bg-emerald-500 hover:text-white rounded-lg flex items-center justify-center transition-colors shadow-md"
                >
                  <FilePen className="mr-2 h-5 w-5" />
                  Add New Member
                </motion.button>
                </div>
              </div>


              {/* Search and Filter Controls */}
              <div className="bg-gray-900 p-4 rounded-xl shadow-md mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div>
                    <h2 className="text-3xl font-bold">Team Data</h2>
                    <p>Manage Team Data here...</p>
                  </div>
                  <div className="w-full md:w-1/3 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 text-gray-100 pr-4 py-2.5 border border-green-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="relative">
                      <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="pl-4 pr-10 py-2.5 border border-green-600 text-gray-100 rounded-lg bg-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
                      >
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept} Department</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="pl-4 pr-10 py-2.5 border border-green-600  text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 bg-gray-900 focus:border-green-500 appearance-none"
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>{status} Status</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                    <button className="flex items-center px-4 py-2.5 border border-bg-600 hover:bg-transparent hovert:text-blue-500 rounded-lg  bg-emerald-500 text-white transition-colors">
                      <Download size={18} className="mr-2 text-white" /> 
                      Export
                    </button>
                  </div>
                </div>
              </div>

              {/* Employee Table */}
              <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-emerald-500">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-emerald-500">
                    <thead className="bg-gray-900">
                      <tr>
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                          Employee
                        </th>
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                          Department
                        </th>
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                          Salary
                        </th>
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                          Join Date
                        </th>
                        <th scope="col" className="px-6 py-3.5 text-right text-xs font-medium text-gray-100 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-emerald-500">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr
                            key={user.id}
                            className="hover:bg-emerald-500 transition-colors cursor-pointer"
                            onClick={() => handleViewUser(user)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-emerald-200 flex items-center justify-center">
                                  <span className="text-lg font-medium text-gray-100">
                                    {user.name.charAt(0)}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-100">{user.name}</div>
                                  <div className="text-sm text-gray-300">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-100">{user.department}</div>
                              <div className="text-sm text-gray-300">{user.position}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-100">${user.salary.toLocaleString()}</div>
                              <div className="text-xs text-gray-300">{user.paymentMethod}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.status === 'Active' ? 'bg-green-100 text-green-800' :
                                user.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                              {new Date(user.joinDate).toDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end items-center space-x-3">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditUser(user);
                                  }}
                                  className="text-white hover:text-white transition-colors"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteUser(user.id);
                                  }}
                                  className="text-red-600 hover:text-red-900 transition-colors"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                            No employees found matching your search criteria
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination (simplified) */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">{filteredUsers.length}</span> of <span className="font-medium">{users.length}</span> employees
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 border border-emerald-500 rounded-md bg-gray-900 text-emerald-500 hover:bg-emerald-500 hover:text-white">
                    Previous
                  </button>
                  <button className="px-4 py-2 border border-emerald-500 rounded-md bg-gray-900 text-emerald-500 hover:bg-emerald-500 hover:text-white">
                    Next
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {!isLoading && currentPage === 'create' && (
            <motion.div
              key="create-user"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <div className="flex items-center mb-6">
                <button
                  onClick={handleBackToList}
                  className="flex items-center transition-colors duration-300 text-gray-700 hover:text-red-600 py-2 px-4 rounded-lg"
                >
                  <ArrowLeft className="mr-2" size={20} /> Back to Employee List
                </button>
                <h2 className="text-2xl font-bold text-gray-900 ml-4">Add New Employee</h2>
              </div>

              <div className="bg-gray-900 rounded-xl shadow-lg p-6">
                <UserForm
                  user={null}
                  onSubmit={handleSubmitUserForm}
                  onCancel={handleBackToList}
                />
              </div>
            </motion.div>
          )}

          {!isLoading && currentPage === 'edit' && currentUser && (
            <motion.div
              key="edit-user"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <div className="flex items-center mb-6">
                <button
                  onClick={handleBackToList}
                  className="flex items-center transition-colors duration-300 text-gray-700 hover:text-red-600 py-2 px-4 rounded-lg"
                >
                  <ArrowLeft className="mr-2" size={20} /> Back to Employee List
                </button>
                <h2 className="text-2xl font-bold text-gray-900 ml-4">Edit Employee</h2>
              </div>

              <div className="bg-gray-900 rounded-xl shadow-lg p-6">
                <UserForm
                  user={currentUser}
                  onSubmit={handleSubmitUserForm}
                  onCancel={handleBackToList}
                />
              </div>
            </motion.div>
          )}

          {!isLoading && currentPage === 'view' && currentUser && (
            <motion.div
              key="view-user"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <UserDetails
                user={currentUser}
                onBack={handleBackToList}
                onEdit={() => handleEditUser(currentUser)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default EmployeePage;