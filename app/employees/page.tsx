"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Calendar,
  Building,
  User,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

// Types
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  employeeCode: string;
  employmentStatus: "ACTIVE" | "INACTIVE" | "TERMINATED";
  joinDate: string;
  department: {
    id: string;
    name: string;
    code: string;
  } | null;
  manager: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  user: {
    role: "EMPLOYEE" | "MANAGER" | "HR" | "ADMIN";
    isActive: boolean;
  };
}

interface Department {
  id: string;
  name: string;
  code: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string>("");

  // Load data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch employees from API
        const employeesResponse = await fetch("/api/employees");
        const employeesData = await employeesResponse.json();

        // Fetch departments from API
        const departmentsResponse = await fetch("/api/departments");
        const departmentsData = await departmentsResponse.json();

        // If API returns empty, use mock data for demo
        if (employeesData.employees.length === 0) {
          setEmployees(mockEmployees);
        } else {
          setEmployees(employeesData.employees);
        }

        setDepartments(departmentsData.departments);
        setCurrentUserRole("ADMIN"); // This would come from auth context
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to mock data on error
        setEmployees(mockEmployees);
        setDepartments(mockDepartments);
        setCurrentUserRole("ADMIN");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter employees based on search and department
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "all" ||
      employee.department?.id === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "INACTIVE":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "TERMINATED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "MANAGER":
        return "bg-blue-100 text-blue-800";
      case "HR":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Handler functions
  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
  };

  const handleSaveEmployee = async (updatedEmployee: Employee) => {
    try {
      const response = await fetch(`/api/employees/${updatedEmployee.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: updatedEmployee.firstName,
          lastName: updatedEmployee.lastName,
          email: updatedEmployee.email,
          phone: updatedEmployee.phone,
          position: updatedEmployee.position,
          employeeCode: updatedEmployee.employeeCode,
          departmentId: updatedEmployee.department?.id,
          employmentStatus: updatedEmployee.employmentStatus,
          role: updatedEmployee.user?.role,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === updatedEmployee.id ? data.employee : emp
          )
        );
        setEditingEmployee(null);
        setSelectedEmployee(data.employee); // Update the detail view if open
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update employee");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update employee");
    }
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteDialog(true);
  };

  const confirmDeleteEmployee = async () => {
    if (employeeToDelete) {
      try {
        const response = await fetch(`/api/employees/${employeeToDelete.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setEmployees((prev) =>
            prev.filter((emp) => emp.id !== employeeToDelete.id)
          );
          setShowDeleteDialog(false);
          setEmployeeToDelete(null);
          setSelectedEmployee(null); // Close detail view if deleted employee was selected
        } else {
          const error = await response.json();
          alert(error.error || "Failed to delete employee");
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
        alert("Failed to delete employee");
      }
    }
  };

  const handleAddEmployee = () => {
    setShowAddDialog(true);
  };

  const handleSaveNewEmployee = async (newEmployee: Omit<Employee, "id">) => {
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: newEmployee.firstName,
          lastName: newEmployee.lastName,
          email: newEmployee.email,
          phone: newEmployee.phone,
          position: newEmployee.position,
          employeeCode: newEmployee.employeeCode,
          departmentId: newEmployee.department?.id,
          employmentStatus: newEmployee.employmentStatus,
          joinDate: newEmployee.joinDate,
          role: newEmployee.user?.role,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setEmployees((prev) => [...prev, data.employee]);
        setShowAddDialog(false);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to add employee");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Failed to add employee");
    }
  };

  if (loading) {
    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
            <p className="text-muted-foreground">Loading employee data...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: i * 0.1,
                ease: "easeOut",
              }}
            >
              <Card className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            Employees
          </h1>
          <p className="text-muted-foreground">
            Manage your employee database ({filteredEmployees.length} of{" "}
            {employees.length} employees)
          </p>
        </motion.div>
        {currentUserRole === "ADMIN" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleAddEmployee}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search employees by name, email, or employee code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Department Filter */}
              <div className="w-full md:w-64">
                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                >
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Employee Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence>
          {filteredEmployees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{
                y: -5,
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  {/* Employee Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                          {getInitials(employee.firstName, employee.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {employee.firstName} {employee.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {employee.employeeCode}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={`${getStatusColor(
                        employee.employmentStatus
                      )} border`}
                    >
                      {employee.employmentStatus}
                    </Badge>
                  </div>

                  {/* Employee Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span>{employee.position}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>
                        {employee.department?.name || "No Department"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="truncate">{employee.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>
                        Joined{" "}
                        {new Date(employee.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Role Badge */}
                  <div className="flex items-center justify-between">
                    <Badge className={getRoleColor(employee.user.role)}>
                      {employee.user.role}
                    </Badge>

                    {/* Actions */}
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedEmployee(employee)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Employee Details</DialogTitle>
                          </DialogHeader>
                          {selectedEmployee && (
                            <EmployeeDetails employee={selectedEmployee} />
                          )}
                        </DialogContent>
                      </Dialog>

                      {currentUserRole === "ADMIN" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditEmployee(employee)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteEmployee(employee)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* No Results */}
      <AnimatePresence>
        {filteredEmployees.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-12 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                </motion.div>
                <motion.h3
                  className="text-lg font-semibold mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  No employees found
                </motion.h3>
                <motion.p
                  className="text-muted-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  Try adjusting your search criteria or filters
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Employee Modal */}
      <Dialog open={showAddDialog} onOpenChange={() => setShowAddDialog(false)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <AddEmployeeForm
              departments={departments}
              onSave={handleSaveNewEmployee}
              onCancel={() => setShowAddDialog(false)}
            />
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Modal */}
      <Dialog
        open={editingEmployee !== null}
        onOpenChange={() => setEditingEmployee(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
            </DialogHeader>
            {editingEmployee && (
              <EditEmployeeForm
                employee={editingEmployee}
                departments={departments}
                onSave={handleSaveEmployee}
                onCancel={() => setEditingEmployee(null)}
              />
            )}
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle>Delete Employee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Are you sure you want to delete {employeeToDelete?.firstName}{" "}
                {employeeToDelete?.lastName}? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => setShowDeleteDialog(false)}
                  >
                    Cancel
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="destructive" onClick={confirmDeleteEmployee}>
                    Delete Employee
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Employee Details Component
function EmployeeDetails({ employee }: { employee: Employee }) {
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-lg">
                    {employee.firstName.charAt(0)}
                    {employee.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-xl">
                    {employee.firstName} {employee.lastName}
                  </h4>
                  <p className="text-muted-foreground">{employee.position}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{employee.email}</span>
                </div>
                {employee.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{employee.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>ID: {employee.employeeCode}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-4">Employment Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department:</span>
                <span className="font-medium">
                  {employee.department?.name || "Not Assigned"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Position:</span>
                <span className="font-medium">{employee.position}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge
                  className={`${
                    employee.employmentStatus === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {employee.employmentStatus}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role:</span>
                <Badge
                  className={
                    employee.user.role === "ADMIN"
                      ? "bg-red-100 text-red-800"
                      : employee.user.role === "MANAGER"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }
                >
                  {employee.user.role}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Join Date:</span>
                <span className="font-medium">
                  {new Date(employee.joinDate).toLocaleDateString()}
                </span>
              </div>
              {employee.manager && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Manager:</span>
                  <span className="font-medium">
                    {employee.manager.firstName} {employee.manager.lastName}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
        <div>
          <h3 className="font-semibold text-lg mb-4">Account Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Active:</span>
              <Badge
                className={
                  employee.user.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {employee.user.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Edit Employee Form Component
function EditEmployeeForm({
  employee,
  departments,
  onSave,
  onCancel,
}: {
  employee: Employee;
  departments: Department[];
  onSave: (employee: Employee) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    phone: employee.phone,
    position: employee.position,
    employeeCode: employee.employeeCode,
    employmentStatus: employee.employmentStatus,
    departmentId: employee.department?.id || "",
    role: employee.user.role,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedEmployee: Employee = {
      ...employee,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      position: formData.position,
      employeeCode: formData.employeeCode,
      employmentStatus: formData.employmentStatus,
      department:
        departments.find((d) => d.id === formData.departmentId) ||
        employee.department,
      user: {
        ...employee.user,
        role: formData.role,
      },
    };

    onSave(updatedEmployee);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">First Name</label>
            <Input
              value={formData.firstName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, firstName: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last Name</label>
            <Input
              value={formData.lastName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lastName: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <Input
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Position</label>
            <Input
              value={formData.position}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, position: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Employee Code
            </label>
            <Input
              value={formData.employeeCode}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  employeeCode: e.target.value,
                }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Department</label>
            <Select
              value={formData.departmentId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, departmentId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Employment Status
            </label>
            <Select
              value={formData.employmentStatus}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  employmentStatus: value as
                    | "ACTIVE"
                    | "INACTIVE"
                    | "TERMINATED",
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="TERMINATED">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  role: value as "ADMIN" | "EMPLOYEE" | "MANAGER" | "HR",
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EMPLOYEE">Employee</SelectItem>
                <SelectItem value="MANAGER">Manager</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <motion.div
          className="flex justify-end space-x-2 pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </motion.div>
        </motion.div>
      </form>
    </motion.div>
  );
}

// Add Employee Form Component
function AddEmployeeForm({
  departments,
  onSave,
  onCancel,
}: {
  departments: Department[];
  onSave: (employee: Omit<Employee, "id">) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    employeeCode: "",
    employmentStatus: "ACTIVE" as "ACTIVE" | "INACTIVE" | "TERMINATED",
    departmentId: "",
    role: "EMPLOYEE" as "ADMIN" | "EMPLOYEE" | "MANAGER" | "HR",
    joinDate: new Date().toISOString().split("T")[0], // Today's date
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEmployee: Omit<Employee, "id"> = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      position: formData.position,
      employeeCode: formData.employeeCode,
      employmentStatus: formData.employmentStatus,
      joinDate: formData.joinDate,
      department:
        departments.find((d) => d.id === formData.departmentId) || null,
      manager: null, // Will be set separately if needed
      user: {
        role: formData.role,
        isActive: true,
      },
    };

    onSave(newEmployee);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">First Name</label>
            <Input
              value={formData.firstName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, firstName: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last Name</label>
            <Input
              value={formData.lastName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lastName: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <Input
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Position</label>
            <Input
              value={formData.position}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, position: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Employee Code
            </label>
            <Input
              value={formData.employeeCode}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  employeeCode: e.target.value,
                }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Department</label>
            <Select
              value={formData.departmentId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, departmentId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Employment Status
            </label>
            <Select
              value={formData.employmentStatus}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  employmentStatus: value as
                    | "ACTIVE"
                    | "INACTIVE"
                    | "TERMINATED",
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="TERMINATED">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  role: value as "ADMIN" | "EMPLOYEE" | "MANAGER" | "HR",
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EMPLOYEE">Employee</SelectItem>
                <SelectItem value="MANAGER">Manager</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Join Date</label>
            <Input
              type="date"
              value={formData.joinDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, joinDate: e.target.value }))
              }
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Add Employee
            </Button>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
}

// Mock Data
const mockDepartments: Department[] = [
  { id: "1", name: "Engineering", code: "ENG" },
  { id: "2", name: "Human Resources", code: "HR" },
  { id: "3", name: "Marketing", code: "MKT" },
  { id: "4", name: "Finance", code: "FIN" },
  { id: "5", name: "Operations", code: "OPS" },
  { id: "6", name: "Sales", code: "SAL" },
  { id: "7", name: "IT Support", code: "IT" },
  { id: "8", name: "Legal", code: "LEG" },
];

const mockEmployees: Employee[] = [
  // Engineering Department
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+1-555-0101",
    position: "Senior Software Engineer",
    employeeCode: "ENG001",
    employmentStatus: "ACTIVE",
    joinDate: "2022-01-15",
    department: mockDepartments[0],
    manager: null,
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@company.com",
    phone: "+1-555-0102",
    position: "Engineering Manager",
    employeeCode: "ENG002",
    employmentStatus: "ACTIVE",
    joinDate: "2021-03-10",
    department: mockDepartments[0],
    manager: null,
    user: { role: "MANAGER", isActive: true },
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@company.com",
    phone: "+1-555-0103",
    position: "Frontend Developer",
    employeeCode: "ENG003",
    employmentStatus: "ACTIVE",
    joinDate: "2023-02-20",
    department: mockDepartments[0],
    manager: { id: "2", firstName: "Jane", lastName: "Smith" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "4",
    firstName: "Sarah",
    lastName: "Wilson",
    email: "sarah.wilson@company.com",
    phone: "+1-555-0104",
    position: "Backend Developer",
    employeeCode: "ENG004",
    employmentStatus: "ACTIVE",
    joinDate: "2022-08-12",
    department: mockDepartments[0],
    manager: { id: "2", firstName: "Jane", lastName: "Smith" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@company.com",
    phone: "+1-555-0105",
    position: "DevOps Engineer",
    employeeCode: "ENG005",
    employmentStatus: "ACTIVE",
    joinDate: "2022-11-05",
    department: mockDepartments[0],
    manager: { id: "2", firstName: "Jane", lastName: "Smith" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "6",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@company.com",
    phone: "+1-555-0106",
    position: "Full Stack Developer",
    employeeCode: "ENG006",
    employmentStatus: "ACTIVE",
    joinDate: "2023-05-18",
    department: mockDepartments[0],
    manager: { id: "2", firstName: "Jane", lastName: "Smith" },
    user: { role: "EMPLOYEE", isActive: true },
  },

  // HR Department
  {
    id: "7",
    firstName: "Lisa",
    lastName: "Anderson",
    email: "lisa.anderson@company.com",
    phone: "+1-555-0107",
    position: "HR Director",
    employeeCode: "HR001",
    employmentStatus: "ACTIVE",
    joinDate: "2020-06-01",
    department: mockDepartments[1],
    manager: null,
    user: { role: "HR", isActive: true },
  },
  {
    id: "8",
    firstName: "Robert",
    lastName: "Taylor",
    email: "robert.taylor@company.com",
    phone: "+1-555-0108",
    position: "HR Specialist",
    employeeCode: "HR002",
    employmentStatus: "ACTIVE",
    joinDate: "2022-04-15",
    department: mockDepartments[1],
    manager: { id: "7", firstName: "Lisa", lastName: "Anderson" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "9",
    firstName: "Jennifer",
    lastName: "Martinez",
    email: "jennifer.martinez@company.com",
    phone: "+1-555-0109",
    position: "Recruiter",
    employeeCode: "HR003",
    employmentStatus: "ACTIVE",
    joinDate: "2023-01-10",
    department: mockDepartments[1],
    manager: { id: "7", firstName: "Lisa", lastName: "Anderson" },
    user: { role: "EMPLOYEE", isActive: true },
  },

  // Marketing Department
  {
    id: "10",
    firstName: "Alex",
    lastName: "Thompson",
    email: "alex.thompson@company.com",
    phone: "+1-555-0110",
    position: "Marketing Director",
    employeeCode: "MKT001",
    employmentStatus: "ACTIVE",
    joinDate: "2021-09-20",
    department: mockDepartments[2],
    manager: null,
    user: { role: "MANAGER", isActive: true },
  },
  {
    id: "11",
    firstName: "Michelle",
    lastName: "White",
    email: "michelle.white@company.com",
    phone: "+1-555-0111",
    position: "Digital Marketing Specialist",
    employeeCode: "MKT002",
    employmentStatus: "ACTIVE",
    joinDate: "2022-07-08",
    department: mockDepartments[2],
    manager: { id: "10", firstName: "Alex", lastName: "Thompson" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "12",
    firstName: "Kevin",
    lastName: "Garcia",
    email: "kevin.garcia@company.com",
    phone: "+1-555-0112",
    position: "Content Creator",
    employeeCode: "MKT003",
    employmentStatus: "ACTIVE",
    joinDate: "2023-03-22",
    department: mockDepartments[2],
    manager: { id: "10", firstName: "Alex", lastName: "Thompson" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "13",
    firstName: "Amanda",
    lastName: "Rodriguez",
    email: "amanda.rodriguez@company.com",
    phone: "+1-555-0113",
    position: "Social Media Manager",
    employeeCode: "MKT004",
    employmentStatus: "ACTIVE",
    joinDate: "2022-12-05",
    department: mockDepartments[2],
    manager: { id: "10", firstName: "Alex", lastName: "Thompson" },
    user: { role: "EMPLOYEE", isActive: true },
  },

  // Finance Department
  {
    id: "14",
    firstName: "Daniel",
    lastName: "Lee",
    email: "daniel.lee@company.com",
    phone: "+1-555-0114",
    position: "Finance Director",
    employeeCode: "FIN001",
    employmentStatus: "ACTIVE",
    joinDate: "2020-11-12",
    department: mockDepartments[3],
    manager: null,
    user: { role: "MANAGER", isActive: true },
  },
  {
    id: "15",
    firstName: "Rachel",
    lastName: "Chen",
    email: "rachel.chen@company.com",
    phone: "+1-555-0115",
    position: "Senior Accountant",
    employeeCode: "FIN002",
    employmentStatus: "ACTIVE",
    joinDate: "2021-05-18",
    department: mockDepartments[3],
    manager: { id: "14", firstName: "Daniel", lastName: "Lee" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "16",
    firstName: "Mark",
    lastName: "Williams",
    email: "mark.williams@company.com",
    phone: "+1-555-0116",
    position: "Financial Analyst",
    employeeCode: "FIN003",
    employmentStatus: "ACTIVE",
    joinDate: "2022-09-30",
    department: mockDepartments[3],
    manager: { id: "14", firstName: "Daniel", lastName: "Lee" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "17",
    firstName: "Laura",
    lastName: "Miller",
    email: "laura.miller@company.com",
    phone: "+1-555-0117",
    position: "Payroll Specialist",
    employeeCode: "FIN004",
    employmentStatus: "ACTIVE",
    joinDate: "2023-01-25",
    department: mockDepartments[3],
    manager: { id: "14", firstName: "Daniel", lastName: "Lee" },
    user: { role: "EMPLOYEE", isActive: true },
  },

  // Operations Department
  {
    id: "18",
    firstName: "Christopher",
    lastName: "Moore",
    email: "christopher.moore@company.com",
    phone: "+1-555-0118",
    position: "Operations Manager",
    employeeCode: "OPS001",
    employmentStatus: "ACTIVE",
    joinDate: "2021-08-14",
    department: mockDepartments[4],
    manager: null,
    user: { role: "MANAGER", isActive: true },
  },
  {
    id: "19",
    firstName: "Nicole",
    lastName: "Jackson",
    email: "nicole.jackson@company.com",
    phone: "+1-555-0119",
    position: "Operations Coordinator",
    employeeCode: "OPS002",
    employmentStatus: "ACTIVE",
    joinDate: "2022-06-20",
    department: mockDepartments[4],
    manager: { id: "18", firstName: "Christopher", lastName: "Moore" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "20",
    firstName: "Steven",
    lastName: "Thomas",
    email: "steven.thomas@company.com",
    phone: "+1-555-0120",
    position: "Process Analyst",
    employeeCode: "OPS003",
    employmentStatus: "ACTIVE",
    joinDate: "2023-04-10",
    department: mockDepartments[4],
    manager: { id: "18", firstName: "Christopher", lastName: "Moore" },
    user: { role: "EMPLOYEE", isActive: true },
  },

  // Sales Department
  {
    id: "21",
    firstName: "Brian",
    lastName: "Harris",
    email: "brian.harris@company.com",
    phone: "+1-555-0121",
    position: "Sales Director",
    employeeCode: "SAL001",
    employmentStatus: "ACTIVE",
    joinDate: "2020-12-08",
    department: mockDepartments[5],
    manager: null,
    user: { role: "MANAGER", isActive: true },
  },
  {
    id: "22",
    firstName: "Samantha",
    lastName: "Clark",
    email: "samantha.clark@company.com",
    phone: "+1-555-0122",
    position: "Senior Sales Representative",
    employeeCode: "SAL002",
    employmentStatus: "ACTIVE",
    joinDate: "2021-10-15",
    department: mockDepartments[5],
    manager: { id: "21", firstName: "Brian", lastName: "Harris" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "23",
    firstName: "Ryan",
    lastName: "Lewis",
    email: "ryan.lewis@company.com",
    phone: "+1-555-0123",
    position: "Sales Representative",
    employeeCode: "SAL003",
    employmentStatus: "ACTIVE",
    joinDate: "2022-03-28",
    department: mockDepartments[5],
    manager: { id: "21", firstName: "Brian", lastName: "Harris" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "24",
    firstName: "Ashley",
    lastName: "Robinson",
    email: "ashley.robinson@company.com",
    phone: "+1-555-0124",
    position: "Account Manager",
    employeeCode: "SAL004",
    employmentStatus: "ACTIVE",
    joinDate: "2023-02-14",
    department: mockDepartments[5],
    manager: { id: "21", firstName: "Brian", lastName: "Harris" },
    user: { role: "EMPLOYEE", isActive: true },
  },

  // IT Support Department
  {
    id: "25",
    firstName: "Joshua",
    lastName: "Walker",
    email: "joshua.walker@company.com",
    phone: "+1-555-0125",
    position: "IT Manager",
    employeeCode: "IT001",
    employmentStatus: "ACTIVE",
    joinDate: "2021-07-22",
    department: mockDepartments[6],
    manager: null,
    user: { role: "MANAGER", isActive: true },
  },
  {
    id: "26",
    firstName: "Megan",
    lastName: "Hall",
    email: "megan.hall@company.com",
    phone: "+1-555-0126",
    position: "System Administrator",
    employeeCode: "IT002",
    employmentStatus: "ACTIVE",
    joinDate: "2022-05-16",
    department: mockDepartments[6],
    manager: { id: "25", firstName: "Joshua", lastName: "Walker" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "27",
    firstName: "Andrew",
    lastName: "Young",
    email: "andrew.young@company.com",
    phone: "+1-555-0127",
    position: "Help Desk Technician",
    employeeCode: "IT003",
    employmentStatus: "ACTIVE",
    joinDate: "2023-06-05",
    department: mockDepartments[6],
    manager: { id: "25", firstName: "Joshua", lastName: "Walker" },
    user: { role: "EMPLOYEE", isActive: true },
  },

  // Legal Department
  {
    id: "28",
    firstName: "Catherine",
    lastName: "King",
    email: "catherine.king@company.com",
    phone: "+1-555-0128",
    position: "Legal Counsel",
    employeeCode: "LEG001",
    employmentStatus: "ACTIVE",
    joinDate: "2020-10-30",
    department: mockDepartments[7],
    manager: null,
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "29",
    firstName: "Matthew",
    lastName: "Wright",
    email: "matthew.wright@company.com",
    phone: "+1-555-0129",
    position: "Legal Assistant",
    employeeCode: "LEG002",
    employmentStatus: "ACTIVE",
    joinDate: "2022-01-18",
    department: mockDepartments[7],
    manager: { id: "28", firstName: "Catherine", lastName: "King" },
    user: { role: "EMPLOYEE", isActive: true },
  },

  // Additional employees with some inactive/terminated status
  {
    id: "30",
    firstName: "Elizabeth",
    lastName: "Green",
    email: "elizabeth.green@company.com",
    position: "Former QA Engineer",
    employeeCode: "ENG007",
    employmentStatus: "TERMINATED",
    joinDate: "2021-12-01",
    department: mockDepartments[0],
    manager: { id: "2", firstName: "Jane", lastName: "Smith" },
    user: { role: "EMPLOYEE", isActive: false },
  },
  {
    id: "31",
    firstName: "James",
    lastName: "Adams",
    email: "james.adams@company.com",
    phone: "+1-555-0131",
    position: "Junior Developer",
    employeeCode: "ENG008",
    employmentStatus: "INACTIVE",
    joinDate: "2023-08-15",
    department: mockDepartments[0],
    manager: { id: "2", firstName: "Jane", lastName: "Smith" },
    user: { role: "EMPLOYEE", isActive: false },
  },

  // CEO/Admin
  {
    id: "32",
    firstName: "Michael",
    lastName: "CEO",
    email: "ceo@company.com",
    phone: "+1-555-0132",
    position: "Chief Executive Officer",
    employeeCode: "ADM001",
    employmentStatus: "ACTIVE",
    joinDate: "2020-01-01",
    department: null,
    manager: null,
    user: { role: "ADMIN", isActive: true },
  },
  {
    id: "33",
    firstName: "Sarah",
    lastName: "Admin",
    email: "admin@company.com",
    phone: "+1-555-0133",
    position: "System Administrator",
    employeeCode: "ADM002",
    employmentStatus: "ACTIVE",
    joinDate: "2020-02-15",
    department: null,
    manager: { id: "32", firstName: "Michael", lastName: "CEO" },
    user: { role: "ADMIN", isActive: true },
  },

  // More Marketing employees
  {
    id: "34",
    firstName: "Jessica",
    lastName: "Parker",
    email: "jessica.parker@company.com",
    phone: "+1-555-0134",
    position: "Brand Manager",
    employeeCode: "MKT005",
    employmentStatus: "ACTIVE",
    joinDate: "2021-11-20",
    department: mockDepartments[2],
    manager: { id: "10", firstName: "Alex", lastName: "Thompson" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "35",
    firstName: "Tyler",
    lastName: "Evans",
    email: "tyler.evans@company.com",
    phone: "+1-555-0135",
    position: "Marketing Analyst",
    employeeCode: "MKT006",
    employmentStatus: "ACTIVE",
    joinDate: "2023-01-30",
    department: mockDepartments[2],
    manager: { id: "10", firstName: "Alex", lastName: "Thompson" },
    user: { role: "EMPLOYEE", isActive: true },
  },

  // More Sales employees
  {
    id: "36",
    firstName: "Victoria",
    lastName: "Turner",
    email: "victoria.turner@company.com",
    phone: "+1-555-0136",
    position: "Business Development Manager",
    employeeCode: "SAL005",
    employmentStatus: "ACTIVE",
    joinDate: "2022-08-10",
    department: mockDepartments[5],
    manager: { id: "21", firstName: "Brian", lastName: "Harris" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "37",
    firstName: "Nathan",
    lastName: "Phillips",
    email: "nathan.phillips@company.com",
    phone: "+1-555-0137",
    position: "Sales Coordinator",
    employeeCode: "SAL006",
    employmentStatus: "ACTIVE",
    joinDate: "2023-05-08",
    department: mockDepartments[5],
    manager: { id: "21", firstName: "Brian", lastName: "Harris" },
    user: { role: "EMPLOYEE", isActive: true },
  },

  // More Engineering employees
  {
    id: "38",
    firstName: "Grace",
    lastName: "Mitchell",
    email: "grace.mitchell@company.com",
    phone: "+1-555-0138",
    position: "UI/UX Designer",
    employeeCode: "ENG009",
    employmentStatus: "ACTIVE",
    joinDate: "2022-10-12",
    department: mockDepartments[0],
    manager: { id: "2", firstName: "Jane", lastName: "Smith" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "39",
    firstName: "Ethan",
    lastName: "Campbell",
    email: "ethan.campbell@company.com",
    phone: "+1-555-0139",
    position: "Mobile Developer",
    employeeCode: "ENG010",
    employmentStatus: "ACTIVE",
    joinDate: "2023-07-25",
    department: mockDepartments[0],
    manager: { id: "2", firstName: "Jane", lastName: "Smith" },
    user: { role: "EMPLOYEE", isActive: true },
  },

  // More Finance employees
  {
    id: "40",
    firstName: "Olivia",
    lastName: "Parker",
    email: "olivia.parker@company.com",
    phone: "+1-555-0140",
    position: "Tax Specialist",
    employeeCode: "FIN005",
    employmentStatus: "ACTIVE",
    joinDate: "2022-04-20",
    department: mockDepartments[3],
    manager: { id: "14", firstName: "Daniel", lastName: "Lee" },
    user: { role: "EMPLOYEE", isActive: true },
  },
];
