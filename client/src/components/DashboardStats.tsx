import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Users, CheckCircle, Clock, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon: any;
  color: string;
}

function StatCard({ title, value, change, trend, icon: Icon, color }: StatProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-lg bg-opacity-10", color)}>
          <Icon className={cn("w-4 h-4", color.replace("bg-", "text-"))} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-display">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            {trend === 'up' ? (
              <ArrowUpRight className="w-3 h-3 text-emerald-500" />
            ) : (
              <ArrowDownRight className="w-3 h-3 text-rose-500" />
            )}
            <span className={trend === 'up' ? "text-emerald-500" : "text-rose-500"}>
              {change}
            </span>
            {" "} from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardStats({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Employees"
        value={data.totalEmployees}
        change="+12%"
        trend="up"
        icon={Users}
        color="bg-blue-100 text-blue-600"
      />
      <StatCard
        title="Active Tasks"
        value={data.activeTasks}
        change="-5%"
        trend="down"
        icon={Activity}
        color="bg-amber-100 text-amber-600"
      />
      <StatCard
        title="Completion Rate"
        value={`${Math.round(data.completionRate || 0)}%`}
        change="+2.5%"
        trend="up"
        icon={CheckCircle}
        color="bg-emerald-100 text-emerald-600"
      />
      <StatCard
        title="Avg. Hours/Task"
        value="4.2h"
        change="+0.8h"
        trend="up"
        icon={Clock}
        color="bg-purple-100 text-purple-600"
      />
    </div>
  );
}
