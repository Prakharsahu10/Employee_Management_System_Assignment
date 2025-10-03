import { getEmployeeByUserId, getPendingTasks } from "@/lib/db/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckSquare, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default async function TaskWidget() {
  // Get current user from headers (set by middleware)
  const { headers } = await import("next/headers");
  const headersList = await headers();
  const userId = headersList.get("x-user-id");

  if (!userId) return null;

  const employee = await getEmployeeByUserId(userId);
  if (!employee) return null;

  const pendingTasks = await getPendingTasks(employee.id);

  const priorityColors = {
    HIGH: "bg-red-100 text-red-800 border-red-200",
    MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200",
    LOW: "bg-green-100 text-green-800 border-green-200",
  };

  const statusColors = {
    TODO: "bg-gray-100 text-gray-800 border-gray-200",
    IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
  };

  const isOverdue = (dueDate: Date | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-blue-600" />
            Pending Tasks
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {pendingTasks.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingTasks.length > 0 ? (
          <div className="space-y-4">
            {/* Task List */}
            <div className="space-y-3">
              {pendingTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                >
                  {/* Task Header */}
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm leading-tight flex-1 pr-2">
                      {task.title}
                    </h4>
                    <div className="flex gap-1">
                      <Badge
                        className={`text-xs ${
                          priorityColors[
                            task.priority as keyof typeof priorityColors
                          ]
                        } border`}
                        variant="outline"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>

                  {/* Task Description */}
                  {task.description && (
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  {/* Task Meta */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {/* Status */}
                      <Badge
                        className={`${
                          statusColors[task.status as keyof typeof statusColors]
                        } border`}
                        variant="outline"
                      >
                        {task.status.replace("_", " ")}
                      </Badge>

                      {/* Due Date */}
                      {task.dueDate && (
                        <div
                          className={`flex items-center gap-1 ${
                            isOverdue(task.dueDate)
                              ? "text-red-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {isOverdue(task.dueDate) && (
                            <AlertCircle className="h-3 w-3" />
                          )}
                          <Clock className="h-3 w-3" />
                          <span>
                            {isOverdue(task.dueDate) ? "Overdue: " : "Due: "}
                            {format(new Date(task.dueDate), "MMM dd")}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Assigned By */}
                    {task.createdBy && (
                      <span className="text-muted-foreground">
                        by {task.createdBy.firstName} {task.createdBy.lastName}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            {pendingTasks.length > 4 && (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-2">
                  +{pendingTasks.length - 4} more tasks
                </p>
              </div>
            )}

            <Link href="/tasks" className="block">
              <Button variant="outline" className="w-full" size="sm">
                View All Tasks
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <h3 className="font-medium mb-1">No pending tasks</h3>
            <p className="text-sm text-muted-foreground">
              Great job! You&apos;re all caught up.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
