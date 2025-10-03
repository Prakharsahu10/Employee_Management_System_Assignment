import {
  getEmployeeByUserId,
  getLeaveBalance,
  getEmployeeLeaves,
  getPendingLeaves,
} from "@/lib/db/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface LeaveWidgetProps {
  userRole?: string;
}

export default async function LeaveWidget({ userRole }: LeaveWidgetProps) {
  // Get current user from headers (set by middleware)
  const { headers } = await import("next/headers");
  const headersList = await headers();
  const userId = headersList.get("x-user-id");

  if (!userId) return null;

  const employee = await getEmployeeByUserId(userId);
  if (!employee) return null;

  const [leaveBalance, recentLeaves, pendingLeaves] = await Promise.all([
    getLeaveBalance(employee.id),
    getEmployeeLeaves(employee.id, 3),
    userRole === "MANAGER" || userRole === "ADMIN"
      ? getPendingLeaves(employee.id)
      : null,
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="h-3 w-3" />;
      case "REJECTED":
        return <XCircle className="h-3 w-3" />;
      case "PENDING":
        return <Clock className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Leave Management
          </div>
          <Link href="/leaves/apply">
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Apply
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Leave Balance */}
        {leaveBalance && (
          <div>
            <h3 className="font-medium text-sm mb-3 text-muted-foreground">
              Available Balance
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Annual</p>
                <p className="text-lg font-semibold text-blue-600">
                  {leaveBalance.annualLeaveBalance}
                </p>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Sick</p>
                <p className="text-lg font-semibold text-green-600">
                  {leaveBalance.sickLeaveBalance}
                </p>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Casual</p>
                <p className="text-lg font-semibold text-orange-600">
                  {leaveBalance.casualLeaveBalance}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Leave Applications */}
        <div>
          <h3 className="font-medium text-sm mb-3 text-muted-foreground">
            Recent Applications
          </h3>
          {recentLeaves.length > 0 ? (
            <div className="space-y-2">
              {recentLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        {leave.leaveType}
                      </span>
                      <Badge
                        className={`text-xs ${getStatusColor(
                          leave.status
                        )} border`}
                        variant="outline"
                      >
                        <span className="flex items-center gap-1">
                          {getStatusIcon(leave.status)}
                          {leave.status}
                        </span>
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(leave.startDate), "MMM dd")} -{" "}
                      {format(new Date(leave.endDate), "MMM dd")}
                      <span className="ml-2">({leave.totalDays} days)</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-3">
              No recent leave applications
            </p>
          )}
        </div>

        {/* Pending Approvals for Managers */}
        {pendingLeaves && pendingLeaves.length > 0 && (
          <div className="pt-2 border-t">
            <h3 className="font-medium text-sm mb-3 text-muted-foreground">
              Pending Approvals ({pendingLeaves.length})
            </h3>
            <div className="space-y-2">
              {pendingLeaves.slice(0, 2).map((leave) => (
                <div
                  key={leave.id}
                  className="p-2 border rounded-lg bg-yellow-50"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium">
                      {leave.employee.firstName} {leave.employee.lastName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {leave.employee.department?.name}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {leave.leaveType} •{" "}
                    {format(new Date(leave.startDate), "MMM dd")} -{" "}
                    {format(new Date(leave.endDate), "MMM dd")}
                  </p>
                </div>
              ))}
            </div>
            <Link href="/leaves/pending" className="block mt-3">
              <Button variant="outline" size="sm" className="w-full">
                Review All Requests
              </Button>
            </Link>
          </div>
        )}

        {/* Quick Actions */}
        <div className="pt-2 border-t">
          <Link href="/leaves" className="block">
            <Button variant="ghost" size="sm" className="w-full">
              View Leave History
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
