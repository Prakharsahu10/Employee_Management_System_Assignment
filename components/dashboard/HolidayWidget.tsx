import { getUpcomingHolidays } from "@/lib/db/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Sun, Gift } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import Link from "next/link";

export default async function HolidayWidget() {
  const holidays = await getUpcomingHolidays(5);

  const getDaysUntil = (date: Date) => {
    const today = new Date();
    const days = differenceInDays(new Date(date), today);

    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days < 7) return `${days} days`;
    if (days < 30) return `${Math.ceil(days / 7)} weeks`;
    return `${Math.ceil(days / 30)} months`;
  };

  const getHolidayIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("christmas") || lowerName.includes("new year")) {
      return <Gift className="h-4 w-4" />;
    }
    return <Sun className="h-4 w-4" />;
  };

  const getDateColor = (date: Date) => {
    const days = differenceInDays(new Date(date), new Date());

    if (days === 0) return "bg-red-100 text-red-800";
    if (days <= 7) return "bg-orange-100 text-orange-800";
    return "bg-blue-100 text-blue-800";
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-blue-600" />
          Upcoming Holidays
        </CardTitle>
      </CardHeader>
      <CardContent>
        {holidays.length > 0 ? (
          <div className="space-y-4">
            {/* Holiday List */}
            <div className="space-y-3">
              {holidays.map((holiday) => (
                <div
                  key={holiday.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${getDateColor(holiday.date)}`}
                    >
                      {getHolidayIcon(holiday.name)}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{holiday.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(holiday.date), "EEEE, MMM dd, yyyy")}
                      </p>
                      {holiday.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {holiday.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getDateColor(
                        holiday.date
                      )}`}
                    >
                      {getDaysUntil(holiday.date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <Link href="/holidays" className="block">
              <Button variant="outline" className="w-full" size="sm">
                View Holiday Calendar
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center py-8">
            <CalendarDays className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <h3 className="font-medium mb-1">No upcoming holidays</h3>
            <p className="text-sm text-muted-foreground">
              No holidays scheduled in the near future
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
