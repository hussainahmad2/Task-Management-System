import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
    Rocket, TrendingUp, Users, Star, Target, 
    BarChart3, Calendar, CheckCircle, Clock, 
    AlertCircle, Zap, FileText, ArrowUpRight,
    Server, Database, GitBranch, Code, Bug, Shield
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useTasks } from "@/hooks/use-tasks";
import { useOrganizations } from "@/hooks/use-organizations";
import { useEmployees } from "@/hooks/use-employees";
import { useQuery } from "@tanstack/react-query";

// Mock data - will be replaced with actual API calls
const deploymentVelocity = [
    { week: 'W1', deployments: 12, successful: 11 },
    { week: 'W2', deployments: 15, successful: 14 },
    { week: 'W3', deployments: 18, successful: 17 },
    { week: 'W4', deployments: 22, successful: 20 },
    { week: 'W5', deployments: 19, successful: 18 },
    { week: 'W6', deployments: 25, successful: 24 },
];

const systemPerformance = [
    { metric: 'Uptime', value: 99.9, change: '+0.2%', trend: 'up' },
    { metric: 'Response Time', value: 120, unit: 'ms', change: '-15ms', trend: 'down' },
    { metric: 'Throughput', value: 1245, unit: 'req/s', change: '+12%', trend: 'up' },
    { metric: 'Error Rate', value: 0.02, unit: '%', change: '-0.01%', trend: 'down' },
];

const techStack = [
    { technology: 'React', percentage: 25 },
    { technology: 'Node.js', percentage: 20 },
    { technology: 'MySQL', percentage: 18 },
    { technology: 'Redis', percentage: 12 },
    { technology: 'Docker', percentage: 10 },
    { technology: 'AWS', percentage: 15 },
];

const openIssues = [
    { id: 1, title: "API Rate Limiting", priority: "High", team: "Backend", severity: "critical" },
    { id: 2, title: "Frontend Performance", priority: "Medium", team: "Frontend", severity: "high" },
    { id: 3, title: "Database Optimization", priority: "Low", team: "DevOps", severity: "medium" },
    { id: 4, title: "Security Patch", priority: "Critical", team: "Security", severity: "critical" },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];

export function CTODashboard() {
    const { data: orgs } = useOrganizations();
    const activeOrg = orgs?.[0];
    const { data: tasks } = useTasks(activeOrg?.id);
    const { data: employees } = useEmployees(activeOrg?.id);

    // Filter tech-related tasks
    const techTasks = tasks?.filter(t => 
        t.title.toLowerCase().includes('api') || 
        t.title.toLowerCase().includes('frontend') || 
        t.title.toLowerCase().includes('backend') ||
        t.title.toLowerCase().includes('deploy')
    ) || [];

    const totalDeployments = 25;
    const successfulDeployments = 24;
    const successRate = Math.round((successfulDeployments / totalDeployments) * 100);
    const devTeamSize = employees?.filter(e => 
        e.designation?.toLowerCase().includes('engineer') || 
        e.designation?.toLowerCase().includes('developer')
    ).length || 12;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Technology Dashboard</h2>
                    <p className="text-muted-foreground">System performance, deployment velocity, and engineering metrics.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Server className="w-4 h-4" /> Infrastructure
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <Shield className="w-4 h-4" /> Security
                    </Button>
                    <Button className="gap-2 shadow-lg shadow-primary/20">
                        <GitBranch className="w-4 h-4" /> Deploy
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Deployment Success</p>
                                <h3 className="text-2xl font-bold mt-1">{successRate}%</h3>
                                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                                    <ArrowUpRight className="w-3 h-3" /> +5% this month
                                </p>
                            </div>
                            <Rocket className="w-8 h-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Engineers</p>
                                <h3 className="text-2xl font-bold mt-1">{devTeamSize}</h3>
                                <p className="text-xs text-muted-foreground mt-1">Active developers</p>
                            </div>
                            <Users className="w-8 h-8 text-blue-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
                                <h3 className="text-2xl font-bold mt-1">99.9%</h3>
                                <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
                            </div>
                            <Server className="w-8 h-8 text-purple-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Open Issues</p>
                                <h3 className="text-2xl font-bold mt-1">{techTasks.length}</h3>
                                <p className="text-xs text-muted-foreground mt-1">Avg resolution: 2.3 days</p>
                            </div>
                            <Bug className="w-8 h-8 text-orange-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Deployment Velocity Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Deployment Velocity</CardTitle>
                        <CardDescription>Successful deployments vs total deployments per week</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={deploymentVelocity}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="week" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="deployments" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Total Deployments" />
                                    <Bar dataKey="successful" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Successful" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* System Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle>System Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {systemPerformance.map((metric) => (
                            <div key={metric.metric} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{metric.metric}</span>
                                    <span className="font-bold">{metric.value}{metric.unit || '%'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className={`text-${metric.trend === 'up' ? 'green' : 'red'}-500`}>
                                        {metric.change}
                                    </span>
                                    {metric.trend === 'up' ? (
                                        <TrendingUp className="w-3 h-3 text-green-500" />
                                    ) : (
                                        <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />
                                    )}
                                </div>
                                <Progress value={metric.metric === 'Error Rate' ? 100 - metric.value * 100 : metric.value} className="h-2" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Tech Stack & Open Issues */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tech Stack Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tech Stack Distribution</CardTitle>
                        <CardDescription>Technology usage across the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={techStack}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="percentage"
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {techStack.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value}%`, '']} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Open Issues */}
                <Card>
                    <CardHeader>
                        <CardTitle>Open Technical Issues</CardTitle>
                        <CardDescription>Critical and high priority items</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {openIssues.map((issue) => (
                                <div key={issue.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-medium">{issue.title}</h4>
                                            <Badge className={
                                                issue.severity === "critical" 
                                                    ? "bg-red-100 text-red-700" 
                                                    : issue.severity === "high"
                                                        ? "bg-orange-100 text-orange-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                            }>
                                                {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3 h-3" /> {issue.team}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Target className="w-3 h-3" /> {issue.priority}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Security & Compliance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Security Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Vulnerability Scan</span>
                                <Badge variant="secondary">Clean</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Penetration Test</span>
                                <Badge variant="secondary">Passed</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Dependency Updates</span>
                                <Badge variant="secondary">Auto</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Code Review Coverage</span>
                                <Badge variant="secondary">98%</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="w-5 h-5" />
                            Infrastructure Health
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Database Load</span>
                                <div className="flex items-center gap-2">
                                    <Progress value={45} className="w-24 h-2" />
                                    <span className="text-xs">45%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Cache Hit Rate</span>
                                <div className="flex items-center gap-2">
                                    <Progress value={92} className="w-24 h-2" />
                                    <span className="text-xs">92%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">CDN Performance</span>
                                <div className="flex items-center gap-2">
                                    <Progress value={98} className="w-24 h-2" />
                                    <span className="text-xs">98%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">API Response Time</span>
                                <div className="flex items-center gap-2">
                                    <Progress value={75} className="w-24 h-2" />
                                    <span className="text-xs">120ms</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}