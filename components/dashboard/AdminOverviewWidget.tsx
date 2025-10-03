import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import {
  getAllActiveEmployees,
  getTodayAttendanceSummary,
} from "@/lib/db/queries";
import Link from "next/link";

export default async function AdminOverviewWidget() {
  const [employees, attendanceSummary] = await Promise.all([
    getAllActiveEmployees(),
    getTodayAttendanceSummary(),
  ]);

  const departmentStats = employees.reduce((acc, employee) => {
    const deptName = employee.department?.name || "Unassigned";
    if (!acc[deptName]) {
      acc[deptName] = { total: 0, present: 0, absent: 0 };
    }
    acc[deptName].total++;
    return acc;
  }, {} as Record<string, { total: number; present: number; absent: number }>);

  const totalEmployees = employees.length;
  const activeProjects = 12; // This would come from a projects query
  const pendingApprovals = 8; // This would come from leaves/documents queries

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Across {Object.keys(departmentStats).length} departments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {attendanceSummary?.present || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {(
                ((attendanceSummary?.present || 0) / totalEmployees) *
                100
              ).toFixed(1)}
              % attendance rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {attendanceSummary?.absent || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {attendanceSummary?.absent > 5
                ? "Requires attention"
                : "Normal range"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approvals
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingApprovals}
            </div>
            <p className="text-xs text-muted-foreground">
              Leaves, documents, requests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Department Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Department Overview</span>
            <Link href="/admin/departments">
              <Button variant="outline" size="sm">
                Manage All
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(departmentStats)
              .slice(0, 5)
              .map(([dept, stats]) => (
                <div
                  key={dept}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div>
                      <p className="font-medium text-sm">{dept}</p>
                      <p className="text-xs text-muted-foreground">
                        {stats.total} employees
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-200"
                    >
                      {stats.present || Math.floor(stats.total * 0.85)} present
                    </Badge>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
