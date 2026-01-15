import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
    Code2, GitBranch, Server, Zap, TrendingUp, 
    CheckCircle, Clock, AlertCircle, Users, 
    Activity, Shield, Cpu, Database, ArrowUpRight
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, LineChart, Line } from "recharts";
import { useTasks } from "@/hooks/use-tasks";
import { useOrganizations } from "@/hooks/use-organizations";
import { useEmployees } from "@/hooks/use-employees";

const sprintProgress = [
    { day: 'Mon', completed: 12, planned: 15 },
    { day: 'Tue', completed: 18, planned: 20 },
    { day: 'Wed', completed: 22, planned: 25 },
    { day: 'Thu', completed: 28, planned: 30 },
    { day: 'Fri', completed: 32, planned: 35 },
];

const codeMetrics = [
    { month: 'Oct', commits: 1240, prs: 85 },
    { month: 'Nov', commits: 1380, prs: 92 },
    { month: 'Dec', commits: 1520, prs: 98 },
    { month: 'Jan', commits: 1680, prs: 105 },
];

const systemHealth = [
    { service: 'API Server', status: 'Healthy', uptime: '99.98%', latency: '45ms' },
    { service: 'Database', status: 'Healthy', uptime: '99.99%', latency: '12ms' },
    { service: 'CDN', status: 'Healthy', uptime: '99.95%', latency: '28ms' },
    { service: 'Auth Service', status: 'Warning', uptime: '99.85%', latency: '120ms' },
];

const teamPerformance = [
    { team: 'Backend', velocity: 85, prs: 24, bugs: 2 },
    { team: 'Frontend', velocity: 78, prs: 18, bugs: 3 },
    { team: 'DevOps', velocity: 92, prs: 12, bugs: 1 },
    { team: 'QA', velocity: 88, prs: 8, bugs: 0 },
];

export function CTODashboard() {
    const { data: orgs } = useOrganizations();
    const activeOrg = orgs?.[0];
    const { data: tasks } = useTasks(activeOrg?.id);
    const { data: employees } = useEmployees(activeOrg?.id);

    const engineeringTasks = tasks?.filter(t => t.status === "in_progress" || t.status === "review") || [];
    const criticalTasks = tasks?.filter(t => t.priority === "critical") || [];
    const openPRs = 14;
    const sprintCompletion = 82;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">CTO Overview</h2>
                    <p className="text-muted-foreground">Engineering performance, system health, and technical roadmap status.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Activity className="w-4 h-4" /> System Status
                    </Button>
                    <Button className="gap-2 shadow-lg shadow-primary/20">
                        <Code2 className="w-4 h-4" /> Tech Roadmap
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Sprint Progress</p>
                                <h3 className="text-2xl font-bold mt-1">{sprintCompletion}%</h3>
                                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                                    <ArrowUpRight className="w-3 h-3" /> On track
                                </p>
                            </div>
                            <Target className="w-8 h-8 text-primary opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Open PRs</p>
                                <h3 className="text-2xl font-bold mt-1">{openPRs}</h3>
                                <p className="text-xs text-orange-500 mt-1">Needing review</p>
                            </div>
                            <GitBranch className="w-8 h-8 text-blue-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
                                <h3 className="text-2xl font-bold mt-1 text-green-600">99.98%</h3>
                                <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
                            </div>
                            <Server className="w-8 h-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Engineers</p>
                                <h3 className="text-2xl font-bold mt-1">{engineeringTasks.length}</h3>
                                <p className="text-xs text-muted-foreground mt-1">Working on tasks</p>
                            </div>
                            <Users className="w-8 h-8 text-purple-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sprint Progress */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Sprint Progress</CardTitle>
                        <CardDescription>Daily task completion vs. planned</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={sprintProgress}>
                                    <defs>
                                        <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="completed" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorCompleted)" />
                                    <Area type="monotone" dataKey="planned" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Code Metrics */}
                <Card>
                    <CardHeader>
                        <CardTitle>Code Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={codeMetrics}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="commits" stroke="hsl(var(--primary))" strokeWidth={2} />
                                    <Line type="monotone" dataKey="prs" stroke="#10b981" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* System Health & Team Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* System Health */}
                <Card>
                    <CardHeader>
                        <CardTitle>System Health</CardTitle>
                        <CardDescription>Infrastructure status and performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {systemHealth.map((service) => (
                                <div key={service.service} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${service.status === 'Healthy' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                        <div>
                                            <p className="font-medium text-sm">{service.service}</p>
                                            <p className="text-xs text-muted-foreground">{service.latency}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge className={service.status === 'Healthy' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                                            {service.status}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground mt-1">{service.uptime}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Team Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Team Performance</CardTitle>
                        <CardDescription>Engineering team velocity and metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {teamPerformance.map((team) => (
                                <div key={team.team} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">{team.team}</span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-muted-foreground">{team.prs} PRs</span>
                                            <Badge variant={team.bugs === 0 ? "default" : "destructive"}>{team.bugs} bugs</Badge>
                                        </div>
                                    </div>
                                    <Progress value={team.velocity} className="h-2" />
                                    <p className="text-xs text-muted-foreground">Velocity: {team.velocity}%</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Critical Issues */}
            {criticalTasks.length > 0 && (
                <Card className="border-orange-200 dark:border-orange-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                            <AlertCircle className="w-5 h-5" />
                            Critical Issues
                        </CardTitle>
                        <CardDescription>High-priority items requiring immediate attention</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {criticalTasks.slice(0, 3).map((task) => (
                                <div key={task.id} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-sm">{task.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : 'No due date'}
                                        </p>
                                    </div>
                                    <Badge variant="destructive">Critical</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
