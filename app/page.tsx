import { Suspense } from "react";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { format } from "date-fns";
import { getEmployeeByUserId } from "@/lib/db/queries";

// Dashboard Components
import StatsOverview from "@/components/dashboard/StatsOverview";
import AttendanceWidget from "@/components/dashboard/AttendanceWidget";
import TaskWidget from "@/components/dashboard/TaskWidget";
import LeaveWidget from "@/components/dashboard/LeaveWidget";
import QuickActions from "@/components/dashboard/QuickActions";
import AnnouncementWidget from "@/components/dashboard/AnnouncementWidget";
import HolidayWidget from "@/components/dashboard/HolidayWidget";

// Admin-specific Components
import AdminOverviewWidget from "@/components/dashboard/AdminOverviewWidget";
import AdminControlPanel from "@/components/dashboard/AdminControlPanel";
import AdminPendingActionsWidget from "@/components/dashboard/AdminPendingActionsWidget";

// Loading Skeletons
import {
  StatsOverviewSkeleton,
  AttendanceWidgetSkeleton,
  TaskWidgetSkeleton,
  LeaveWidgetSkeleton,
  QuickActionsSkeleton,
  AnnouncementWidgetSkeleton,
  HolidayWidgetSkeleton,
} from "@/components/dashboard/LoadingSkeletons";

async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key"
    );
    const { payload } = await jwtVerify(token, secret);

    const decoded = payload as { userId: string; role: string; email: string };

    // Get employee details
    const employee = await getEmployeeByUserId(decoded.userId);

    return {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      name: employee ? `${employee.firstName} ${employee.lastName}` : "User",
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const userRole = user?.role;
  const userName = user?.name || "User";

  const currentDate = new Date();
  const greeting = getGreeting();

  function getGreeting() {
    const hour = currentDate.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div
          className={`rounded-lg p-6 text-white ${
            userRole === "ADMIN"
              ? "bg-gradient-to-r from-red-600 to-red-700"
              : userRole === "MANAGER"
              ? "bg-gradient-to-r from-purple-600 to-purple-700"
              : "bg-gradient-to-r from-blue-600 to-blue-700"
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {greeting}, {userName}!
              </h1>
              <p
                className={`${
                  userRole === "ADMIN"
                    ? "text-red-100"
                    : userRole === "MANAGER"
                    ? "text-purple-100"
                    : "text-blue-100"
                }`}
              >
                {format(currentDate, "EEEE, MMMM dd, yyyy")}
              </p>
              <p
                className={`text-sm mt-1 ${
                  userRole === "ADMIN"
                    ? "text-red-200"
                    : userRole === "MANAGER"
                    ? "text-purple-200"
                    : "text-blue-200"
                }`}
              >
                {userRole === "ADMIN"
                  ? "Administrator Control Center - Manage your organization"
                  : userRole === "MANAGER"
                  ? "Team Management Dashboard - Lead your team effectively"
                  : "Employee Dashboard - Your workspace overview"}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {format(currentDate, "HH:mm")}
              </div>
              <div
                className={`text-sm ${
                  userRole === "ADMIN"
                    ? "text-red-200"
                    : userRole === "MANAGER"
                    ? "text-purple-200"
                    : "text-blue-200"
                }`}
              >
                {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </div>
              <div
                className={`text-xs mt-1 px-2 py-1 rounded-full ${
                  userRole === "ADMIN"
                    ? "bg-red-500/30"
                    : userRole === "MANAGER"
                    ? "bg-purple-500/30"
                    : "bg-blue-500/30"
                }`}
              >
                {userRole || "Employee"}
              </div>
            </div>
          </div>
        </div>

        {/* Role-Based Dashboard Content */}
        {userRole === "ADMIN" ? (
          /* Admin Dashboard */
          <div className="space-y-6">
            {/* Admin Overview with System Stats */}
            <Suspense fallback={<StatsOverviewSkeleton />}>
              <AdminOverviewWidget />
            </Suspense>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column - Admin Tools */}
              <div className="lg:col-span-8 space-y-6">
                {/* Admin Control Panel */}
                <AdminControlPanel />

                {/* Pending Actions */}
                <Suspense fallback={<TaskWidgetSkeleton />}>
                  <AdminPendingActionsWidget />
                </Suspense>
              </div>

              {/* Right Column - System Info */}
              <div className="lg:col-span-4 space-y-6">
                {/* System Announcements */}
                <Suspense fallback={<AnnouncementWidgetSkeleton />}>
                  <AnnouncementWidget userRole={userRole} />
                </Suspense>

                {/* Company Holidays */}
                <Suspense fallback={<HolidayWidgetSkeleton />}>
                  <HolidayWidget />
                </Suspense>
              </div>
            </div>
          </div>
        ) : (
          /* Employee/Manager Dashboard */
          <div className="space-y-6">
            {/* Stats Overview - Manager Only */}
            {userRole === "MANAGER" && (
              <Suspense fallback={<StatsOverviewSkeleton />}>
                <StatsOverview />
              </Suspense>
            )}

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-8 space-y-6">
                {/* Attendance Widget */}
                <Suspense fallback={<AttendanceWidgetSkeleton />}>
                  <AttendanceWidget />
                </Suspense>

                {/* Tasks Widget */}
                <Suspense fallback={<TaskWidgetSkeleton />}>
                  <TaskWidget />
                </Suspense>

                {/* Leave Management Widget */}
                <Suspense fallback={<LeaveWidgetSkeleton />}>
                  <LeaveWidget userRole={userRole} />
                </Suspense>
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                {/* Quick Actions */}
                <Suspense fallback={<QuickActionsSkeleton />}>
                  <QuickActions userRole={userRole} />
                </Suspense>

                {/* Announcements */}
                <Suspense fallback={<AnnouncementWidgetSkeleton />}>
                  <AnnouncementWidget userRole={userRole} />
                </Suspense>

                {/* Upcoming Holidays */}
                <Suspense fallback={<HolidayWidgetSkeleton />}>
                  <HolidayWidget />
                </Suspense>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground py-4 border-t">
          <p>
            Employee Management System © 2025 • Last updated:{" "}
            {format(currentDate, "PPpp")}
          </p>
        </div>
      </div>
    </div>
  );
}
