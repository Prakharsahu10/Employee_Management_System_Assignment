import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserPlus,
  Settings,
  Shield,
  Database,
  FileText,
  BarChart3,
  Calendar,
} from "lucide-react";
import Link from "next/link";

interface AdminControlPanelProps {
  userRole?: string;
}

export default function AdminControlPanel({
  userRole,
}: AdminControlPanelProps) {
  const adminActions = [
    {
      title: "Employee Management",
      description: "Add, edit, deactivate employees",
      href: "/admin/employees",
      icon: Users,
      color: "bg-blue-600 hover:bg-blue-700",
      badge: "Core",
    },
    {
      title: "Department Management",
      description: "Manage departments and hierarchies",
      href: "/admin/departments",
      icon: UserPlus,
      color: "bg-green-600 hover:bg-green-700",
      badge: "Structure",
    },
    {
      title: "System Settings",
      description: "Configure system preferences",
      href: "/admin/settings",
      icon: Settings,
      color: "bg-purple-600 hover:bg-purple-700",
      badge: "Config",
    },
    {
      title: "User Roles & Permissions",
      description: "Manage access controls",
      href: "/admin/roles",
      icon: Shield,
      color: "bg-red-600 hover:bg-red-700",
      badge: "Security",
    },
    {
      title: "Reports & Analytics",
      description: "Generate system reports",
      href: "/admin/reports",
      icon: BarChart3,
      color: "bg-indigo-600 hover:bg-indigo-700",
      badge: "Analytics",
    },
    {
      title: "Database Management",
      description: "Backup, restore, maintenance",
      href: "/admin/database",
      icon: Database,
      color: "bg-gray-600 hover:bg-gray-700",
      badge: "Data",
    },
    {
      title: "Document Templates",
      description: "Manage forms and templates",
      href: "/admin/templates",
      icon: FileText,
      color: "bg-orange-600 hover:bg-orange-700",
      badge: "Templates",
    },
    {
      title: "Holiday Management",
      description: "Configure company holidays",
      href: "/admin/holidays",
      icon: Calendar,
      color: "bg-teal-600 hover:bg-teal-700",
      badge: "Calendar",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-600" />
          Admin Control Panel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {adminActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Link key={index} href={action.href}>
                <div className="group">
                  <Button
                    className={`w-full h-auto p-4 ${action.color} text-white justify-start`}
                    variant="default"
                  >
                    <div className="flex items-start w-full gap-3">
                      <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div className="flex flex-col items-start flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{action.title}</span>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-white/20 text-white border-white/30"
                          >
                            {action.badge}
                          </Badge>
                        </div>
                        <span className="text-xs opacity-90 leading-tight">
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

        {/* Quick Stats */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">24/7</div>
              <div className="text-xs text-muted-foreground">System Status</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">99.9%</div>
              <div className="text-xs text-muted-foreground">Uptime</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">Live</div>
              <div className="text-xs text-muted-foreground">Data Sync</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
