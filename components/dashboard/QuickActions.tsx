import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  FileText,
  Users,
  Settings,
  PlusCircle,
  ClipboardList,
  Clock,
  User,
  Building,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

interface QuickActionsProps {
  userRole?: string;
}

export default function QuickActions({ userRole }: QuickActionsProps) {
  const commonActions = [
    {
      label: "Apply Leave",
      href: "/leaves/apply",
      icon: Calendar,
      color: "bg-blue-600 hover:bg-blue-700 text-white",
      description: "Submit leave request",
    },
    {
      label: "My Documents",
      href: "/documents",
      icon: FileText,
      color: "bg-green-600 hover:bg-green-700 text-white",
      description: "View uploaded files",
    },
    {
      label: "Attendance",
      href: "/attendance",
      icon: Clock,
      color: "bg-purple-600 hover:bg-purple-700 text-white",
      description: "Check attendance history",
    },
    {
      label: "My Profile",
      href: "/profile",
      icon: User,
      color: "bg-indigo-600 hover:bg-indigo-700 text-white",
      description: "Update personal info",
    },
  ];

  const managerActions = [
    {
      label: "Team Overview",
      href: "/team",
      icon: Users,
      color: "bg-orange-600 hover:bg-orange-700 text-white",
      description: "Manage your team",
    },
    {
      label: "Approve Leaves",
      href: "/leaves/pending",
      icon: ClipboardList,
      color: "bg-yellow-600 hover:bg-yellow-700 text-white",
      description: "Review leave requests",
    },
    {
      label: "Team Reports",
      href: "/reports/team",
      icon: BarChart3,
      color: "bg-teal-600 hover:bg-teal-700 text-white",
      description: "View team analytics",
    },
  ];

  const adminActions = [
    {
      label: "Add Employee",
      href: "/employees/new",
      icon: PlusCircle,
      color: "bg-red-600 hover:bg-red-700 text-white",
      description: "Register new employee",
    },
    {
      label: "Departments",
      href: "/departments",
      icon: Building,
      color: "bg-pink-600 hover:bg-pink-700 text-white",
      description: "Manage departments",
    },
    {
      label: "System Settings",
      href: "/admin/settings",
      icon: Settings,
      color: "bg-gray-600 hover:bg-gray-700 text-white",
      description: "Configure system",
    },
  ];

  const getActionsForRole = () => {
    let actions = [...commonActions];

    if (userRole === "MANAGER" || userRole === "ADMIN") {
      actions = [...actions, ...managerActions];
    }

    if (userRole === "ADMIN") {
      actions = [...actions, ...adminActions];
    }

    return actions;
  };

  const actions = getActionsForRole();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-blue-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Link key={index} href={action.href}>
                <div className="group">
                  <Button
                    className={`w-full justify-start h-auto p-3 ${action.color}`}
                    variant="default"
                  >
                    <div className="flex items-center w-full">
                      <IconComponent className="h-4 w-4 mr-3 flex-shrink-0" />
                      <div className="flex flex-col items-start flex-1">
                        <span className="font-medium text-sm">
                          {action.label}
                        </span>
                        <span className="text-xs opacity-90">
                          {action.description}
                        </span>
                      </div>
                    </div>
                  </Button>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Role Badge */}
        <div className="mt-4 pt-4 border-t">
          <div className="text-center">
            <span className="text-xs text-muted-foreground">Logged in as</span>
            <div className="mt-1">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  userRole === "ADMIN"
                    ? "bg-red-100 text-red-800"
                    : userRole === "MANAGER"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {userRole || "Employee"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
