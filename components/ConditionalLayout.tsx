"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Settings, Briefcase } from "lucide-react";
import UserMenu from "@/components/UserMenu";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (isAuthPage) {
    // Auth pages without sidebar
    return children;
  }

  // Regular pages with sidebar
  return (
    <div className="min-h-dvh grid grid-cols-[240px_1fr] grid-rows-[auto_1fr]">
      {/* Sidebar */}
      <aside className="row-span-2 border-r bg-white">
        <div className="h-14 flex items-center px-4 border-b">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="size-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">EMS</span>
          </Link>
        </div>
        <nav className="p-2 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
          >
            <LayoutDashboard className="size-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/employees"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
          >
            <Users className="size-4" />
            <span>Employees</span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
          >
            <Settings className="size-4" />
            <span>Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Topbar */}
      <header className="h-14 border-b bg-white flex items-center justify-between px-4">
        <div></div> {/* Empty left side */}
        <UserMenu />
      </header>

      {/* Main content */}
      <main className="p-4">{children}</main>
    </div>
  );
}
