import { NextRequest, NextResponse } from "next/server";

// Define Employee interface (same as in route.ts)
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  employeeCode: string;
  employmentStatus: string;
  joinDate: string;
  department: { id: string; name: string; code: string };
  manager: { id: string; firstName: string; lastName: string } | null;
  user: { role: string; isActive: boolean };
}

// Import employees array from the main route (we'll use a shared store)
// For now, we'll reconstruct it here - in a real app, you'd use a shared data store
let employees: Employee[] = [];

// Initialize employees if empty (fallback)
const initializeEmployees = () => {
  if (employees.length === 0) {
    // This should match the employees array from the main route
    // For brevity, I'll add just a few - in production, use a shared data store
    employees = [
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
        department: { id: "1", name: "Engineering", code: "ENG" },
        manager: null,
        user: { role: "EMPLOYEE", isActive: true },
      },
      // Add more employees here or load from shared store
    ];
  }
};

// PUT /api/employees/[id] - Update employee
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    initializeEmployees();
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      employeeCode,
      departmentId,
      managerId,
      employmentStatus,
      role,
    } = body;

    const { id } = params;

    // Find existing employee
    const employeeIndex = employees.findIndex((emp) => emp.id === id);
    if (employeeIndex === -1) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    const existingEmployee = employees[employeeIndex];

    // Check if employee code already exists (excluding current employee)
    if (employeeCode !== existingEmployee.employeeCode) {
      const codeExists = employees.find(
        (emp) => emp.employeeCode === employeeCode && emp.id !== id
      );
      if (codeExists) {
        return NextResponse.json(
          { error: "Employee code already exists" },
          { status: 400 }
        );
      }
    }

    // Check if email already exists (excluding current employee)
    if (email !== existingEmployee.email) {
      const emailExists = employees.find(
        (emp) => emp.email === email && emp.id !== id
      );
      if (emailExists) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 }
        );
      }
    }

    // Department mapping
    const departments = {
      "1": { id: "1", name: "Engineering", code: "ENG" },
      "2": { id: "2", name: "Human Resources", code: "HR" },
      "3": { id: "3", name: "Marketing", code: "MKT" },
      "4": { id: "4", name: "Finance", code: "FIN" },
      "5": { id: "5", name: "Operations", code: "OPS" },
      "6": { id: "6", name: "Sales", code: "SAL" },
      "7": { id: "7", name: "IT Support", code: "IT" },
      "8": { id: "8", name: "Legal", code: "LEG" },
    };

    const department = departments[departmentId as keyof typeof departments];
    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 400 }
      );
    }

    // Find manager if specified
    let manager = null;
    if (managerId) {
      const foundManager = employees.find((emp) => emp.id === managerId);
      if (!foundManager) {
        return NextResponse.json(
          { error: "Manager not found" },
          { status: 400 }
        );
      }
      manager = {
        id: foundManager.id,
        firstName: foundManager.firstName,
        lastName: foundManager.lastName,
      };
    }

    // Update employee
    const updatedEmployee: Employee = {
      ...existingEmployee,
      firstName,
      lastName,
      email,
      phone,
      position,
      employeeCode,
      employmentStatus,
      department,
      manager,
      user: {
        role: role.toUpperCase(),
        isActive: true,
      },
    };

    employees[employeeIndex] = updatedEmployee;

    return NextResponse.json({ employee: updatedEmployee });
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}

// DELETE /api/employees/[id] - Delete employee
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    initializeEmployees();
    const { id } = params;

    // Find employee
    const employeeIndex = employees.findIndex((emp) => emp.id === id);
    if (employeeIndex === -1) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Remove employee
    employees.splice(employeeIndex, 1);

    return NextResponse.json({
      message: "Employee deleted successfully",
      id,
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}
