export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  hireDate: string;
  salary?: number;
  status: "active" | "on-leave" | "terminated";
  avatar?: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
}

export type EmployeeFormData = Omit<Employee, "id">;