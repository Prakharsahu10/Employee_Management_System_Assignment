// Authentication utilities for client-side usage

export interface User {
  id: string;
  email: string;
  username: string;
  role: "EMPLOYEE" | "MANAGER" | "HR" | "ADMIN";
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    position: string;
    department?: {
      id: string;
      name: string;
      code: string;
    };
  };
}

export interface AuthResponse {
  user: User;
  message: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

// Login function
export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Login failed");
  }

  return response.json();
}

// Signup function
export async function signup(data: SignupData): Promise<AuthResponse> {
  if (data.password !== data.confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Signup failed");
  }

  return response.json();
}

// Logout function
export async function logout(): Promise<{ message: string }> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Logout failed");
  }

  return response.json();
}

// Check if user is authenticated (client-side)
export function isAuthenticated(): boolean {
  // This is a simple check - in production you might want to validate the token
  return document.cookie.includes("token=");
}

// Get user role from token (this would typically be done server-side)
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch("/api/auth/me");
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error("Failed to get current user:", error);
  }
  return null;
}

// Role checking utilities
export function hasRole(user: User, roles: string[]): boolean {
  return roles.includes(user.role);
}

export function isAdmin(user: User): boolean {
  return user.role === "ADMIN";
}

export function isHR(user: User): boolean {
  return user.role === "HR";
}

export function isManager(user: User): boolean {
  return user.role === "MANAGER";
}

export function isEmployee(user: User): boolean {
  return user.role === "EMPLOYEE";
}
