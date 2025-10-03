import { Users, UserPlus, UserCheck, Clock } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Employees",
      value: "0",
      icon: Users,
      description: "Active employees",
    },
    {
      title: "New This Month",
      value: "0",
      icon: UserPlus,
      description: "Recently hired",
    },
    {
      title: "On Leave",
      value: "0",
      icon: Clock,
      description: "Currently away",
    },
    {
      title: "Departments",
      value: "0",
      icon: UserCheck,
      description: "Total departments",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your Employee Management System
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="border rounded-lg p-6 bg-card hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
                <Icon className="size-8 text-muted-foreground" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="border rounded-lg p-6 bg-card">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-muted-foreground">
          No recent activity to display. Start by adding employees!
        </p>
      </div>
    </div>
  );
}
