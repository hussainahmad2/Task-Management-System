import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
    TrendingUp, TrendingDown, Users, DollarSign, Target, 
    BarChart3, Calendar, CheckCircle, Clock, 
    AlertCircle, Zap, FileText, ArrowUpRight, ArrowDownRight,
    Eye, Activity, Shield
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useTasks } from "@/hooks/use-tasks";
import { useOrganizations } from "@/hooks/use-organizations";
import { useEmployees } from "@/hooks/use-employees";
import { useQuery } from "@tanstack/react-query";

// Mock data - will be replaced with actual API calls
const revenueData = [
    { month: 'Jan', revenue: 45000, expenses: 28000 },
    { month: 'Feb', revenue: 52000, expenses: 30000 },
    { month: 'Mar', revenue: 48000, expenses: 29000 },
    { month: 'Apr', revenue: 61000, expenses: 32000 },
    { month: 'May', revenue: 55000, expenses: 31000 },
    { month: 'Jun', revenue: 67000, expenses: 34000 },
];

const employeeData = [
    { department: 'Engineering', count: 45 },
    { department: 'Sales', count: 32 },
    { department: 'Marketing', count: 18 },
    { department: 'HR', count: 12 },
    { department: 'Finance', count: 8 },
];

const performanceData = [
    { metric: 'Revenue Growth', value: 45, change: '+12%', trend: 'up' },
    { metric: 'Employee Satisfaction', value: 87, change: '+5%', trend: 'up' },
    { metric: 'Customer Retention', value: 92, change: '+3%', trend: 'up' },
    { metric: 'Cost Efficiency', value: 78, change: '-2%', trend: 'down' },
];

const topPriorities = [
    { id: 1, title: "Q3 Product Launch", progress: 75, deadline: "2024-09-15", status: "On Track" },
    { id: 2, title: "Market Expansion", progress: 45, deadline: "2024-11-30", status: "Behind" },
    { id: 3, title: "Team Scaling Initiative", progress: 90, deadline: "2024-08-20", status: "On Track" },
    { id: 4, title: "Compliance Framework", progress: 30, deadline: "2024-10-10", status: "Behind" },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function CEODashboard() {
    const { data: orgs } = useOrganizations();
    const activeOrg = orgs?.[0];
    const { data: tasks } = useTasks(activeOrg?.id);
    const { data: employees } = useEmployees(activeOrg?.id);

    // Mock data for demonstration
    const totalRevenue = 67000;
    const totalEmployees = employees?.length || 115;
    const activeProjects = tasks?.filter(t => t.status !== 'completed').length || 24;
    const completedProjects = tasks?.filter(t => t.status === 'completed').length || 18;
    
    // Calculate KPIs
    const revenueGrowth = 12; // percentage
    const employeeGrowth = 8; // percentage
    const customerSatisfaction = 94; // percentage
    const operationalEfficiency = 85; // percentage

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Executive Dashboard</h2>
                    <p className="text-muted-foreground">Strategic overview, financial performance, and organizational health.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <FileText className="w-4 h-4" /> Reports
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <Shield className="w-4 h-4" /> Compliance
                    </Button>
                    <Button className="gap-2 shadow-lg shadow-primary/20">
                        <Activity className="w-4 h-4" /> Live View
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                                <h3 className="text-2xl font-bold mt-1">${(totalRevenue / 1000).toFixed(1)}K</h3>
                                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                                    <ArrowUpRight className="w-3 h-3" /> +{revenueGrowth}% this month
                                </p>
                            </div>
                            <DollarSign className="w-8 h-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Employees</p>
                                <h3 className="text-2xl font-bold mt-1">{totalEmployees}</h3>
                                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                                    <ArrowUpRight className="w-3 h-3" /> +{employeeGrowth}% growth
                                </p>
                            </div>
                            <Users className="w-8 h-8 text-blue-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                                <h3 className="text-2xl font-bold mt-1">{activeProjects}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{completedProjects} completed</p>
                            </div>
                            <Target className="w-8 h-8 text-purple-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Satisfaction</p>
                                <h3 className="text-2xl font-bold mt-1">{customerSatisfaction}%</h3>
                                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                                    <ArrowUpRight className="w-3 h-3" /> +5% this quarter
                                </p>
                            </div>
                            <Eye className="w-8 h-8 text-orange-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Financial Performance</CardTitle>
                        <CardDescription>Revenue vs Expenses over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`$${value}`, '']} />
                                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                                    <Area type="monotone" dataKey="expenses" stroke="hsl(var(--destructive))" fillOpacity={0.3} fill="url(#colorExpenses)" name="Expenses" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card>
                    <CardHeader>
                        <CardTitle>Key Performance Indicators</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {performanceData.map((metric) => (
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

            {/* Department Distribution & Priorities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Department Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Employee Distribution</CardTitle>
                        <CardDescription>Headcount by department</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={employeeData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {employeeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value} employees`, '']} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Strategic Priorities */}
                <Card>
                    <CardHeader>
                        <CardTitle>Strategic Priorities</CardTitle>
                        <CardDescription>Top initiatives and their progress</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topPriorities.map((priority) => (
                                <div key={priority.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-medium">{priority.title}</h4>
                                            <Badge className={
                                                priority.status === "On Track" 
                                                    ? "bg-green-100 text-green-700" 
                                                    : "bg-red-100 text-red-700"
                                            }>
                                                {priority.status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> Due: {priority.deadline}
                                            </span>
                                        </div>
                                        <Progress value={priority.progress} className="mt-2 h-2" />
                                        <p className="text-xs text-muted-foreground mt-1">{priority.progress}% complete</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Compliance Status */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Compliance & Security Status
                    </CardTitle>
                    <CardDescription>ISO 27001 and HIPAA compliance monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-4 h-4 text-green-500" />
                                <span className="font-medium">ISO 27001</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Compliant</p>
                            <p className="text-xs text-green-500">Last audit: Jan 15, 2024</p>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-4 h-4 text-green-500" />
                                <span className="font-medium">HIPAA</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Compliant</p>
                            <p className="text-xs text-green-500">Policy updated: Dec 20, 2023</p>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Activity className="w-4 h-4 text-blue-500" />
                                <span className="font-medium">Audits</span>
                            </div>
                            <p className="text-sm text-muted-foreground">12,450 logs</p>
                            <p className="text-xs text-muted-foreground">Today: 42 events</p>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="w-4 h-4 text-yellow-500" />
                                <span className="font-medium">Security</span>
                            </div>
                            <p className="text-sm text-muted-foreground">No incidents</p>
                            <p className="text-xs text-muted-foreground">Last scan: Today</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}