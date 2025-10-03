import { getTodayAttendance, getEmployeeByUserId } from "@/lib/db/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

interface AttendanceWidgetProps {
  userRole?: string;
}

export default async function AttendanceWidget({}: AttendanceWidgetProps) {
  // Get current user from headers (set by middleware)
  const { headers } = await import("next/headers");
  const headersList = await headers();
  const userId = headersList.get("x-user-id");

  if (!userId) return null;

  const employee = await getEmployeeByUserId(userId);
  if (!employee) return null;

  const todayAttendance = await getTodayAttendance(employee.id);
  const currentTime = new Date();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PRESENT":
        return "bg-green-100 text-green-800 border-green-200";
      case "LATE":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ABSENT":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatTime = (time: Date | null) => {
    if (!time) return "--:--";
    return format(time, "HH:mm");
  };

  const calculateWorkingHours = () => {
    if (!todayAttendance?.checkIn) return "--:--";

    const endTime = todayAttendance.checkOut || currentTime;
    const diffMs = endTime.getTime() - todayAttendance.checkIn.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Today&apos;s Attendance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {todayAttendance ? (
            <div className="space-y-4">
              {/* Status Badge */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Status:
                </span>
                <Badge
                  className={`${getStatusColor(todayAttendance.status)} border`}
                >
                  {todayAttendance.status}
                </Badge>
              </div>

              {/* Time Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-muted-foreground">
                      Check In
                    </span>
                  </div>
                  <p className="text-lg font-semibold">
                    {formatTime(todayAttendance.checkIn)}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-muted-foreground">
                      Check Out
                    </span>
                  </div>
                  <p className="text-lg font-semibold">
                    {formatTime(todayAttendance.checkOut)}
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Working Hours:
                  </span>
                  <span className="font-medium">{calculateWorkingHours()}</span>
                </div>
              </div>

              {/* Location (if available) */}
              {todayAttendance.location && (
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{todayAttendance.location}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t">
                {!todayAttendance.checkOut ? (
                  <Button variant="outline" className="w-full" size="sm">
                    <XCircle className="h-4 w-4 mr-2" />
                    Check Out
                  </Button>
                ) : (
                  <div className="text-center text-sm text-muted-foreground">
                    ✓ Day completed
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-4">
                No attendance recorded today
              </p>
              <Button className="w-full" size="sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Check In
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Current time: {format(currentTime, "HH:mm")}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
