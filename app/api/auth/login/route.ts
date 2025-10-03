import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user with employee relation
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        employee: {
          include: {
            department: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: "Account is inactive. Please contact your administrator." },
        { status: 403 }
      );
    }

    // Create JWT token using jose (Edge Runtime compatible)
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key"
    );
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employee?.id,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secret);

    // Create response with user data
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

    // Set cookie and return user data
    const response = NextResponse.json({
      user: userData,
      message: "Login successful",
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
