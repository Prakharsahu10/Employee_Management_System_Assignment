"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, ChevronDown } from "lucide-react";
import { getCurrentUser, logout, type User as UserType } from "@/lib/auth";

export default function UserMenu() {
  const [user, setUser] = useState<UserType | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <User className="size-4 text-white" />
        </div>
        <div className="text-left">
          <div className="text-sm font-medium text-gray-900">
            {user.employee?.firstName} {user.employee?.lastName}
          </div>
          <div className="text-xs text-gray-500">{user.role}</div>
        </div>
        <ChevronDown className="size-4 text-gray-400" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
            <div className="p-3 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-900">
                {user.employee?.firstName} {user.employee?.lastName}
              </div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>

            <div className="py-1">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
