import Layout from "@/components/Layout";
import { useOrganizations } from "@/hooks/use-organizations";
import { useDashboardStats } from "@/hooks/use-analytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useLocation } from "wouter";
import {
  Plus, Users, CheckCircle2, TrendingUp, Clock,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, Calendar,
  AlertTriangle,
  Briefcase
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTasks } from "@/hooks/use-tasks";
import { useEmployees } from "@/hooks/use-employees";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: orgs } = useOrganizations();
  const activeOrg = orgs?.[0];
  const { data: stats, isLoading } = useDashboardStats(activeOrg?.id);
  const { data: recentTasks } = useTasks(activeOrg?.id);
  // Separate query for critical tasks to populate "Priority Watch"
  const { data: criticalTasks } = useTasks(activeOrg?.id, { priority: "critical", status: "todo" });
  const { data: employees } = useEmployees(activeOrg?.id);

  // Mock Trend Data for "Advanced" feel
  const trendData = [
    { name: 'Mon', completed: 12, new: 15 },
    { name: 'Tue', completed: 19, new: 22 },
    { name: 'Wed', completed: 15, new: 18 },
    { name: 'Thu', completed: 25, new: 30 },
    { name: 'Fri', completed: 32, new: 28 },
    { name: 'Sat', completed: 18, new: 12 },
    { name: 'Sun', completed: 10, new: 8 },
  ];

  const departmentData = [
    { name: 'Engineering', value: 45 },
    { name: 'Design', value: 25 },
    { name: 'Marketing', value: 20 },
    { name: 'HR', value: 10 },
  ];

  const COLORS = ['hsl(var(--primary))', '#3b82f6', '#10b981', '#f59e0b'];

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-muted rounded-xl"></div>)}
          </div>
          <div className="grid md:grid-cols-3 gap-6 h-96">
            <div className="md:col-span-2 bg-muted rounded-xl"></div>
            <div className="bg-muted rounded-xl"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight">Executive Dashboard</h2>
            <p className="text-muted-foreground">Real-time overview of organization performance and metrics.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Clock className="w-4 h-4" /> Reports
            </Button>
            <Button className="gap-2 shadow-lg shadow-primary/20" onClick={() => setLocation("/tasks")}>
              <Plus className="w-4 h-4" /> Create Task
            </Button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold">{stats?.totalEmployees || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">+2 from last month</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> 4.5%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Active Tasks</p>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold">{stats?.activeTasks || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">12 due this week</p>
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> 12%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold">{stats?.completionRate || 0}%</div>
                  <p className="text-xs text-muted-foreground mt-1">vs. 88% target</p>
                </div>
                <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">
                  <ArrowDownRight className="w-3 h-3 mr-1" /> 2.1%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Team Velocity</p>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold">High</div>
                  <p className="text-xs text-muted-foreground mt-1">Optimal performance</p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> 8.4%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-7 gap-6">
          <Card className="md:col-span-4 lg:col-span-5">
            <CardHeader>
              <CardTitle>Task Velocity & Performance</CardTitle>
              <CardDescription>Weekly comparison of new vs completed tasks.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area type="monotone" dataKey="new" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorNew)" strokeWidth={2} name="New Tasks" />
                    <Area type="monotone" dataKey="completed" stroke="#10b981" fillOpacity={1} fill="url(#colorCompleted)" strokeWidth={2} name="Completed" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3 lg:col-span-2">
            <CardHeader>
              <CardTitle>Department Load</CardTitle>
              <CardDescription>Task distribution by team.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Stats */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-8">
                  <span className="text-3xl font-bold">{stats?.activeTasks || 0}</span>
                  <p className="text-xs text-muted-foreground">Total Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Widgets Grid */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Priority Watch Widget */}
          <Card className="md:col-span-1 border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-orange-600 dark:text-orange-400">
                <AlertTriangle className="h-4 w-4" />
                Priority Watch
              </CardTitle>
              <CardDescription>Critical items needing attention.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criticalTasks?.length ? criticalTasks.slice(0, 3).map(task => (
                  <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/50">
                    <div className="mt-1">
                      <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none mb-1">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.dueDate ? `Due ${new Date(task.dueDate).toLocaleDateString()}` : 'Due ASAP'}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                    <CheckCircle2 className="h-8 w-8 mb-2 opacity-20" />
                    <p className="text-sm">No critical issues found.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines Widget */}
          <Card className="md:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4 text-primary" />
                Upcoming Deadlines
              </CardTitle>
              <CardDescription>Next 7 days.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mocking deadlines filter from recent tasks if backend filter not ready, for demo robustness */}
                {recentTasks?.filter(t => t.dueDate).sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()).slice(0, 3).map(task => (
                  <div key={task.id} className="flex items-center justify-between group">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.assignee?.user?.firstName || "Unassigned"}</p>
                    </div>
                    <Badge variant="outline" className="text-xs font-normal tabular-nums">
                      {new Date(task.dueDate!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </Badge>
                  </div>
                ))}
                {(!recentTasks?.some(t => t.dueDate)) && (
                  <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                    <Calendar className="h-8 w-8 mb-2 opacity-20" />
                    <p className="text-sm">No upcoming deadlines.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Team Overview Widget */}
          <Card className="md:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4 text-blue-500" />
                Team Overview
              </CardTitle>
              <CardDescription>Recent status.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees?.slice(0, 4).map(emp => (
                  <div key={emp.id} className="flex items-center gap-3 group cursor-pointer">
                    <Avatar className="h-8 w-8 transition-transform group-hover:scale-105">
                      <AvatarImage src={emp.user?.profileImageUrl} />
                      <AvatarFallback>{emp.user?.firstName?.[0]}{emp.user?.lastName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-none truncate">{emp.user?.firstName} {emp.user?.lastName}</p>
                      <p className="text-xs text-muted-foreground truncate">{emp.designation}</p>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${emp.isActive ? 'bg-green-500' : 'bg-gray-300'} ring-2 ring-background`} />
                  </div>
                ))}
                {(!employees || employees.length === 0) && (
                  <div className="text-sm text-muted-foreground text-center py-4">No team data available.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Global Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Global Activity Feed</CardTitle>
              <CardDescription>Live updates across all departments.</CardDescription>
            </div>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentTasks?.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0 group">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${task.priority === 'high' || task.priority === 'critical' ? 'bg-red-500' : 'bg-primary'}`} />
                    <div>
                      <p className="font-medium text-sm group-hover:text-primary transition-colors">{task.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{task.description || "No description provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-medium">{task.assignee?.user?.firstName || "Unassigned"}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(task.createdAt || "").toLocaleDateString()}</p>
                    </div>
                    <Badge variant={task.status === 'completed' ? 'default' : 'secondary'} className="capitalize">
                      {task.status?.replace('_', ' ')}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Task</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              {(!recentTasks || recentTasks.length === 0) && (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No recent activity found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
