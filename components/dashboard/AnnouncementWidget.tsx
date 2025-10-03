import { getActiveAnnouncements } from "@/lib/db/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Megaphone, AlertCircle, Info, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface AnnouncementWidgetProps {
  userRole?: string;
}

export default async function AnnouncementWidget({
  userRole,
}: AnnouncementWidgetProps) {
  const announcements = await getActiveAnnouncements(userRole);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <AlertCircle className="h-4 w-4" />;
      case "MEDIUM":
        return <Info className="h-4 w-4" />;
      case "LOW":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800 border-red-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-blue-600" />
            Announcements
          </div>
          {announcements.length > 0 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {announcements.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.slice(0, 3).map((announcement) => (
              <div
                key={announcement.id}
                className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
              >
                {/* Announcement Header */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm leading-tight flex-1 pr-2">
                    {announcement.title}
                  </h3>
                  <Badge
                    className={`text-xs ${getPriorityColor(
                      announcement.priority
                    )} border flex items-center gap-1`}
                    variant="outline"
                  >
                    {getPriorityIcon(announcement.priority)}
                    {announcement.priority}
                  </Badge>
                </div>

                {/* Announcement Content */}
                <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
                  {announcement.content}
                </p>

                {/* Announcement Meta */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {announcement.publishedAt &&
                      format(
                        new Date(announcement.publishedAt),
                        "MMM dd, yyyy"
                      )}
                  </span>

                  {announcement.expiresAt && (
                    <span className="text-muted-foreground">
                      Expires:{" "}
                      {format(new Date(announcement.expiresAt), "MMM dd")}
                    </span>
                  )}
                </div>

                {/* Target Roles */}
                {announcement.targetRoles &&
                  announcement.targetRoles.length > 0 && (
                    <div className="mt-2 pt-2 border-t">
                      <div className="flex flex-wrap gap-1">
                        {announcement.targetRoles.map((role, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}

            {/* View All Button */}
            {announcements.length > 3 && (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-2">
                  +{announcements.length - 3} more announcements
                </p>
              </div>
            )}

            <Link href="/announcements" className="block">
              <Button variant="outline" className="w-full" size="sm">
                View All Announcements
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center py-8">
            <Megaphone className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <h3 className="font-medium mb-1">No announcements</h3>
            <p className="text-sm text-muted-foreground">
              Stay tuned for company updates
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
