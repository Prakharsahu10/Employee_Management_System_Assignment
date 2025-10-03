import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Verify and decode token using jose
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key"
    );
    const { payload } = await jwtVerify(token, secret);

    const decoded = payload as {
      userId: string;
      email: string;
      role: string;
      employeeId?: string;
    };

    // Get user with employee data
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        employee: {
          include: {
            department: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user data (excluding password)
    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      employee: user.employee
        ? {
            id: user.employee.id,
            firstName: user.employee.firstName,
            lastName: user.employee.lastName,
            position: user.employee.position,
            department: user.employee.department,
          }
        : null,
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
