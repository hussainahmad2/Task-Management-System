import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
    Rocket, TrendingUp, Users, Star, Target, 
    BarChart3, Calendar, CheckCircle, Clock, 
    AlertCircle, Zap, FileText, ArrowUpRight
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useTasks } from "@/hooks/use-tasks";
import { useOrganizations } from "@/hooks/use-organizations";
import { useEmployees } from "@/hooks/use-employees";

const featureVelocity = [
    { week: 'W1', delivered: 3, planned: 4 },
    { week: 'W2', delivered: 5, planned: 5 },
    { week: 'W3', delivered: 4, planned: 4 },
    { week: 'W4', delivered: 6, planned: 5 },
];

const roadmapData = [
    { quarter: 'Q1', features: 18, completed: 15 },
    { quarter: 'Q2', features: 22, completed: 20 },
    { quarter: 'Q3', features: 25, completed: 22 },
    { quarter: 'Q4', features: 20, completed: 18 },
];

const userSatisfaction = [
    { feature: 'Dashboard', rating: 4.8 },
    { feature: 'API', rating: 4.6 },
    { feature: 'Mobile App', rating: 4.9 },
    { feature: 'Analytics', rating: 4.7 },
];

const productMetrics = [
    { metric: 'DAU', value: 12450, change: '+12%', trend: 'up' },
    { metric: 'MAU', value: 89200, change: '+8%', trend: 'up' },
    { metric: 'Retention', value: '78%', change: '+5%', trend: 'up' },
    { metric: 'NPS', value: 52, change: '+7', trend: 'up' },
];

const activeFeatures = [
    { id: 1, name: "Advanced Analytics", status: "In Development", progress: 65, team: "Engineering", priority: "High" },
    { id: 2, name: "Mobile App v2.0", status: "Design", progress: 30, team: "Design", priority: "Critical" },
    { id: 3, name: "API Gateway", status: "Testing", progress: 85, team: "Engineering", priority: "High" },
    { id: 4, name: "User Dashboard Redesign", status: "In Development", progress: 55, team: "Design", priority: "Medium" },
];

export function CPODashboard() {
    const { data: orgs } = useOrganizations();
    const activeOrg = orgs?.[0];
    const { data: tasks } = useTasks(activeOrg?.id);
    const { data: employees } = useEmployees(activeOrg?.id);

    const productTasks = tasks?.filter(t => t.priority === "high" || t.priority === "critical") || [];
    const totalFeatures = 12;
    const completedFeatures = 8;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Product Dashboard</h2>
                    <p className="text-muted-foreground">Product metrics, roadmap velocity, and feature development status.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <FileText className="w-4 h-4" /> Roadmap
                    </Button>
                    <Button className="gap-2 shadow-lg shadow-primary/20">
                        <Rocket className="w-4 h-4" /> New Feature
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Feature Velocity</p>
                                <h3 className="text-2xl font-bold mt-1">{totalFeatures}</h3>
                                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                                    <ArrowUpRight className="w-3 h-3" /> +25% this month
                                </p>
                            </div>
                            <Rocket className="w-8 h-8 text-primary opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">User Satisfaction</p>
                                <h3 className="text-2xl font-bold mt-1">4.8/5</h3>
                                <p className="text-xs text-muted-foreground mt-1">Average rating</p>
                            </div>
                            <Star className="w-8 h-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                                <h3 className="text-2xl font-bold mt-1">12.4K</h3>
                                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                                    <ArrowUpRight className="w-3 h-3" /> +12% growth
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
                                <p className="text-sm font-medium text-muted-foreground">Roadmap Progress</p>
                                <h3 className="text-2xl font-bold mt-1">{Math.round((completedFeatures / totalFeatures) * 100)}%</h3>
                                <p className="text-xs text-muted-foreground mt-1">Q1 2024</p>
                            </div>
                            <Target className="w-8 h-8 text-purple-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Feature Velocity Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Feature Velocity</CardTitle>
                        <CardDescription>Weekly feature delivery vs. planned</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={featureVelocity}>
                                    <defs>
                                        <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="week" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="delivered" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorDelivered)" />
                                    <Area type="monotone" dataKey="planned" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Product Metrics */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {productMetrics.map((metric) => (
                            <div key={metric.metric} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{metric.metric}</span>
                                    <span className="font-bold">{metric.value}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className={`text-${metric.trend === 'up' ? 'green' : 'red'}-500`}>
                                        {metric.change}
                                    </span>
                                    <TrendingUp className={`w-3 h-3 text-${metric.trend === 'up' ? 'green' : 'red'}-500`} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Roadmap & Active Features */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quarterly Roadmap */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quarterly Roadmap</CardTitle>
                        <CardDescription>Feature completion by quarter</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={roadmapData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="quarter" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="features" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* User Satisfaction */}
                <Card>
                    <CardHeader>
                        <CardTitle>Feature Satisfaction</CardTitle>
                        <CardDescription>User ratings by feature</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {userSatisfaction.map((item) => (
                                <div key={item.feature} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">{item.feature}</span>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-bold">{item.rating}</span>
                                        </div>
                                    </div>
                                    <Progress value={item.rating * 20} className="h-2" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Active Features */}
            <Card>
                <CardHeader>
                    <CardTitle>Active Features</CardTitle>
                    <CardDescription>Current feature development status</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {activeFeatures.map((feature) => (
                            <div key={feature.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-medium">{feature.name}</h4>
                                        <Badge className={feature.priority === "Critical" ? "bg-red-100 text-red-700" : 
                                                          feature.priority === "High" ? "bg-orange-100 text-orange-700" : 
                                                          "bg-blue-100 text-blue-700"}>
                                            {feature.priority}
                                        </Badge>
                                        <Badge variant="outline">{feature.status}</Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3 h-3" /> {feature.team}
                                        </span>
                                    </div>
                                    <Progress value={feature.progress} className="mt-2 h-2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
