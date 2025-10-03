import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, username, password } =
      await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !username || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password strength (basic)
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 409 }
        );
      }
      if (existingUser.username === username) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 409 }
        );
      }
    }        

    

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate employee code
    const employeeCount = await prisma.employee.count();
    const employeeCode = `EMP${String(employeeCount + 1).padStart(3, "0")}`;

    // Create user and employee in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get default department (HR department as fallback)
      const defaultDepartment = await tx.department.findFirst({
        where: { code: "HR" },
      });

      if (!defaultDepartment) {
        throw new Error(
          "Default department not found. Please run database seed."
        );
      }

      // Create user
      const user = await tx.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          role: "EMPLOYEE", // Default role
          isActive: true,
        },
      });

      // Create employee profile
      const employee = await tx.employee.create({
        data: {
          userId: user.id,
          employeeCode,
          firstName,
          lastName,
          dateOfBirth: new Date("1990-01-01"), // Default date - should be updated later
          gender: "Other", // Default - should be updated later
          phone: "", // Empty - should be updated later
          personalEmail: email,
          address: "", // Empty - should be updated later
          city: "", // Empty - should be updated later
          state: "", // Empty - should be updated later
          country: "India", // Default country
          postalCode: "", // Empty - should be updated later
          emergencyContactName: "", // Empty - should be updated later
          emergencyContactPhone: "", // Empty - should be updated later
          emergencyContactRelation: "", // Empty - should be updated later
          position: "Employee", // Default position
          departmentId: defaultDepartment.id,
          joiningDate: new Date(),
          employmentStatus: "ACTIVE",
          employmentType: "Full-time",
          noticePeriod: 30,
          salary: 50000, // Default salary - should be updated by HR
        },
      });

      return { user, employee };
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: result.user.id,
          email: result.user.email,
          username: result.user.username,
          role: result.user.role,
          employee: {
            id: result.employee.id,
            firstName: result.employee.firstName,
            lastName: result.employee.lastName,
            employeeCode: result.employee.employeeCode,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
