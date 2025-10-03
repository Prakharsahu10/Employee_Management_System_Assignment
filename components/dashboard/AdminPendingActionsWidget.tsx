import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  FileText,
} from "lucide-react";
import { getPendingLeaves, getUnverifiedDocuments } from "@/lib/db/queries";
import { format } from "date-fns";
import Link from "next/link";

export default async function AdminPendingActionsWidget() {
  const [pendingLeaves, unverifiedDocs] = await Promise.all([
    getPendingLeaves(),
    getUnverifiedDocuments(),
  ]);

  const totalPendingActions = pendingLeaves.length + unverifiedDocs.length;

  const getUrgencyColor = (daysAgo: number) => {
    if (daysAgo >= 7) return "text-red-600";
    if (daysAgo >= 3) return "text-yellow-600";
    return "text-muted-foreground";
  };

  const getUrgencyBadge = (daysAgo: number) => {
    if (daysAgo >= 7) return "bg-red-100 text-red-800 border-red-200";
    if (daysAgo >= 3) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Pending Actions
          </div>
          <Badge
            variant="secondary"
            className={`${
              totalPendingActions > 10
                ? "bg-red-100 text-red-800"
                : totalPendingActions > 5
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {totalPendingActions}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {totalPendingActions > 0 ? (
          <div className="space-y-4">
            {/* Leave Approvals */}
            {pendingLeaves.length > 0 && (
              <div>
                <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Leave Requests ({pendingLeaves.length})
                </h3>
                <div className="space-y-2">
                  {pendingLeaves.slice(0, 3).map((leave) => {
                    const daysAgo = Math.floor(
                      (new Date().getTime() -
                        new Date(leave.appliedAt).getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    return (
                      <div
                        key={leave.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {leave.employee.firstName}{" "}
                              {leave.employee.lastName}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getUrgencyBadge(daysAgo)}`}
                            >
                              {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {leave.leaveType} •{" "}
                            {format(new Date(leave.startDate), "MMM dd")} -{" "}
                            {format(new Date(leave.endDate), "MMM dd")} •{" "}
                            {leave.totalDays} days
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {leave.employee.department?.name}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-200"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200"
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {pendingLeaves.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center">
                      +{pendingLeaves.length - 3} more leave requests
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Document Verifications */}
            {unverifiedDocs.length > 0 && (
              <div className={pendingLeaves.length > 0 ? "pt-4 border-t" : ""}>
                <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Document Verifications ({unverifiedDocs.length})
                </h3>
                <div className="space-y-2">
                  {unverifiedDocs.slice(0, 3).map((doc) => {
                    const daysAgo = Math.floor(
                      (new Date().getTime() -
                        new Date(doc.uploadedAt).getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    return (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {doc.employee.firstName} {doc.employee.lastName}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getUrgencyBadge(daysAgo)}`}
                            >
                              {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {doc.documentType} • {doc.fileName}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {unverifiedDocs.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center">
                      +{unverifiedDocs.length - 3} more documents
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t space-y-2">
              {pendingLeaves.length > 0 && (
                <Link href="/admin/leaves/pending" className="block">
                  <Button variant="outline" className="w-full" size="sm">
                    Review All Leave Requests
                  </Button>
                </Link>
              )}
              {unverifiedDocs.length > 0 && (
                <Link href="/admin/documents/pending" className="block">
                  <Button variant="outline" className="w-full" size="sm">
                    Review All Documents
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-600 opacity-50" />
            <h3 className="font-medium mb-1 text-green-600">All Caught Up!</h3>
            <p className="text-sm text-muted-foreground">
              No pending actions require your attention.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
