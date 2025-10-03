import { getDashboardStats } from "@/lib/db/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Calendar } from "lucide-react";

export default async function StatsOverview() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      icon: Users,
      bgColor: "bg-blue-500",
      textColor: "text-blue-600",
      change: "+2 from last month",
    },
    {
      title: "Present Today",
      value: stats.todayPresent,
      icon: UserCheck,
      bgColor: "bg-green-500",
      textColor: "text-green-600",
      change: `${Math.round(
        (stats.todayPresent / stats.activeEmployees) * 100
      )}% attendance`,
    },
    {
      title: "Absent Today",
      value: stats.todayAbsent,
      icon: UserX,
      bgColor: "bg-red-500",
      textColor: "text-red-600",
      change:
        stats.todayAbsent > 0 ? "Follow up required" : "All accounted for",
    },
    {
      title: "Pending Leaves",
      value: stats.pendingLeaves,
      icon: Calendar,
      bgColor: "bg-yellow-500",
      textColor: "text-yellow-600",
      change: stats.pendingLeaves > 0 ? "Needs approval" : "All up to date",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <IconComponent className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs mt-1 ${stat.textColor}`}>{stat.change}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
