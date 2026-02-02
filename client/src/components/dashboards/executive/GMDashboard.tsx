import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
    TrendingUp, TrendingDown, Users, DollarSign, Target, 
    BarChart3, Calendar, CheckCircle, Clock, 
    AlertCircle, Zap, FileText, ArrowUpRight, ArrowDownRight,
    Building, Briefcase, Award, Package
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useTasks } from "@/hooks/use-tasks";
import { useOrganizations } from "@/hooks/use-organizations";
import { useEmployees } from "@/hooks/use-employees";
import { useQuery } from "@tanstack/react-query";

// Mock data - will be replaced with actual API calls
const operationalMetrics = [
    { metric: 'Productivity', value: 87, change: '+5%', trend: 'up' },
    { metric: 'Quality', value: 92, change: '+3%', trend: 'up' },
    { metric: 'On-Time Delivery', value: 89, change: '+2%', trend: 'up' },
    { metric: 'Cost Efficiency', value: 78, change: '-1%', trend: 'down' },
];

const departmentPerformance = [
    { department: 'Sales', score: 85, target: 80 },
    { department: 'Operations', score: 92, target: 85 },
    { department: 'Marketing', score: 78, target: 80 },
    { department: 'Support', score: 95, target: 90 },
    { department: 'R&D', score: 88, target: 85 },
];

const monthlyGoals = [
    { month: 'Jan', achieved: 75, target: 80 },
    { month: 'Feb', achieved: 82, target: 80 },
    { month: 'Mar', achieved: 78, target: 80 },
    { month: 'Apr', achieved: 85, target: 80 },
    { month: 'May', achieved: 90, target: 85 },
    { month: 'Jun', achieved: 88, target: 85 },
];

const upcomingProjects = [
    { id: 1, name: "Q3 Product Launch", deadline: "2024-09-15", progress: 45, priority: "High" },
    { id: 2, name: "Process Optimization", deadline: "2024-08-30", progress: 75, priority: "Medium" },
    { id: 3, name: "Team Expansion", deadline: "2024-07-20", progress: 30, priority: "High" },
    { id: 4, name: "Cost Reduction Initiative", deadline: "2024-10-10", progress: 15, priority: "Critical" },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function GMDashboard() {
    const { data: orgs } = useOrganizations();
    const activeOrg = orgs?.[0];
    const { data: tasks } = useTasks(activeOrg?.id);
    const { data: employees } = useEmployees(activeOrg?.id);

    // Calculate KPIs
    const totalEmployees = employees?.length || 115;
    const activeDepartments = 5; // Assuming 5 departments
    const projectsCompleted = tasks?.filter(t => t.status === 'completed').length || 18;
    const projectsInProgress = tasks?.filter(t => t.status === 'in_progress').length || 24;
    const totalProjects = projectsCompleted + projectsInProgress;
    
    const revenue = 670000; // Annual revenue
    const budget = 520000; // Annual budget
    const budgetUsed = 380000; // Budget used this year

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">General Manager Dashboard</h2>
                    <p className="text-muted-foreground">Operational metrics, department performance, and strategic initiatives.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Building className="w-4 h-4" /> Operations
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <Briefcase className="w-4 h-4" /> Projects
                    </Button>
                    <Button className="gap-2 shadow-lg shadow-primary/20">
                        <Target className="w-4 h-4" /> Goals
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                                <h3 className="text-2xl font-bold mt-1">{totalEmployees}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{activeDepartments} departments</p>
                            </div>
                            <Users className="w-8 h-8 text-blue-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Projects</p>
                                <h3 className="text-2xl font-bold mt-1">{totalProjects}</h3>
                                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                                    <ArrowUpRight className="w-3 h-3" /> {projectsCompleted} completed
                                </p>
                            </div>
                            <Package className="w-8 h-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Annual Revenue</p>
                                <h3 className="text-2xl font-bold mt-1">${(revenue / 1000).toFixed(0)}K</h3>
                                <p className="text-xs text-muted-foreground mt-1">FY 2024</p>
                            </div>
                            <DollarSign className="w-8 h-8 text-purple-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Budget Utilization</p>
                                <h3 className="text-2xl font-bold mt-1">{Math.round((budgetUsed / budget) * 100)}%</h3>
                                <p className="text-xs text-muted-foreground mt-1">${(budgetUsed / 1000).toFixed(0)}K spent</p>
                            </div>
                            <Target className="w-8 h-8 text-orange-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Operational Metrics */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Operational Performance</CardTitle>
                        <CardDescription>Key metrics across operations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={operationalMetrics}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="metric" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                                        {operationalMetrics.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.trend === 'up' ? '#10b981' : '#ef4444'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card>
                    <CardHeader>
                        <CardTitle>Key Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {operationalMetrics.map((metric) => (
                            <div key={metric.metric} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{metric.metric}</span>
                                    <span className="font-bold">{metric.value}%</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className={`text-${metric.trend === 'up' ? 'green' : 'red'}-500`}>
                                        {metric.change}
                                    </span>
                                    {metric.trend === 'up' ? (
                                        <TrendingUp className="w-3 h-3 text-green-500" />
                                    ) : (
                                        <TrendingDown className="w-3 h-3 text-red-500" />
                                    )}
                                </div>
                                <Progress value={metric.value} className="h-2" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Department Performance & Goals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Department Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Department Performance</CardTitle>
                        <CardDescription>Performance vs targets by department</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={departmentPerformance}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="department" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Bar dataKey="target" fill="#94a3b8" name="Target" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="score" fill="hsl(var(--primary))" name="Actual" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Monthly Goals Achievement */}
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Goal Achievement</CardTitle>
                        <CardDescription>Performance against monthly targets</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyGoals}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={2} dot={{ r: 4 }} name="Target" />
                                    <Line type="monotone" dataKey="achieved" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} name="Achieved" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Projects */}
            <Card>
                <CardHeader>
                    <CardTitle>Strategic Initiatives</CardTitle>
                    <CardDescription>Key projects and their progress</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {upcomingProjects.map((project) => (
                            <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-medium">{project.name}</h4>
                                        <Badge className={
                                            project.priority === "Critical" 
                                                ? "bg-red-100 text-red-700" 
                                                : project.priority === "High"
                                                    ? "bg-orange-100 text-orange-700"
                                                    : "bg-blue-100 text-blue-700"
                                        }>
                                            {project.priority}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> Due: {project.deadline}
                                        </span>
                                    </div>
                                    <Progress value={project.progress} className="mt-2 h-2" />
                                    <p className="text-xs text-muted-foreground mt-1">{project.progress}% complete</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button size="sm" variant="outline">
                                        Details
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Team & Resource Allocation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Team Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Full-time</span>
                                <span className="font-medium">{totalEmployees}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Departments</span>
                                <span className="font-medium">{activeDepartments}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Managers</span>
                                <span className="font-medium">5</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Avg Tenure</span>
                                <span className="font-medium">2.4 years</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Recognition
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Employee Awards</span>
                                <span className="font-medium">12</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Team Wins</span>
                                <span className="font-medium">4</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Client Feedback</span>
                                <span className="font-medium">94%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Training Completed</span>
                                <span className="font-medium">87%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            Goals Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Q3 Revenue Target</span>
                                    <span>85%</span>
                                </div>
                                <Progress value={85} className="h-2" />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Team Expansion</span>
                                    <span>60%</span>
                                </div>
                                <Progress value={60} className="h-2" />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Process Improvement</span>
                                    <span>72%</span>
                                </div>
                                <Progress value={72} className="h-2" />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Budget Adherence</span>
                                    <span>92%</span>
                                </div>
                                <Progress value={92} className="h-2" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}