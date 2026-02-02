import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
    TrendingUp, TrendingDown, Users, HardDrive, Network, Lock, Shield, 
    BarChart3, Calendar, CheckCircle, Clock, 
    AlertCircle, Zap, FileText, ArrowUpRight, ArrowDownRight,
    Database, Server, Globe, Eye
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useTasks } from "@/hooks/use-tasks";
import { useOrganizations } from "@/hooks/use-organizations";
import { useEmployees } from "@/hooks/use-employees";
import { useQuery } from "@tanstack/react-query";

// Mock data - will be replaced with actual API calls
const infrastructureUtilization = [
    { day: 'Mon', cpu: 45, memory: 52, storage: 38 },
    { day: 'Tue', cpu: 52, memory: 48, storage: 41 },
    { day: 'Wed', cpu: 38, memory: 55, storage: 43 },
    { day: 'Thu', cpu: 65, memory: 60, storage: 45 },
    { day: 'Fri', cpu: 58, memory: 52, storage: 47 },
    { day: 'Sat', cpu: 32, memory: 35, storage: 40 },
    { day: 'Sun', cpu: 28, memory: 30, storage: 38 },
];

const securityIncidents = [
    { month: 'Jan', attacks: 24, blocked: 22 },
    { month: 'Feb', attacks: 31, blocked: 30 },
    { month: 'Mar', attacks: 28, blocked: 27 },
    { month: 'Apr', attacks: 35, blocked: 34 },
    { month: 'May', attacks: 22, blocked: 21 },
    { month: 'Jun', attacks: 29, blocked: 28 },
];

const complianceStatus = [
    { standard: 'ISO 27001', status: 'Compliant', score: 95 },
    { standard: 'HIPAA', status: 'Compliant', score: 92 },
    { standard: 'GDPR', status: 'Compliant', score: 88 },
    { standard: 'SOC 2', status: 'In Progress', score: 75 },
];

const dataSources = [
    { name: 'Employee DB', type: 'MySQL', health: 'healthy', usage: 85 },
    { name: 'Task Management', type: 'MySQL', health: 'healthy', usage: 65 },
    { name: 'Audit Logs', type: 'MySQL', health: 'healthy', usage: 45 },
    { name: 'Files Storage', type: 'Object Store', health: 'warning', usage: 92 },
    { name: 'Cache Layer', type: 'Redis', health: 'healthy', usage: 78 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function CIODashboard() {
    const { data: orgs } = useOrganizations();
    const activeOrg = orgs?.[0];
    const { data: tasks } = useTasks(activeOrg?.id);
    const { data: employees } = useEmployees(activeOrg?.id);

    // Calculate KPIs
    const totalSystems = 12;
    const healthySystems = 10;
    const systemHealth = Math.round((healthySystems / totalSystems) * 100);
    const dataBreaches = 0; // Current count
    const complianceScore = 92; // Average compliance score
    const itBudget = 245000; // Monthly budget
    const itSpent = 198000; // Spent this month

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">IT Operations Dashboard</h2>
                    <p className="text-muted-foreground">Infrastructure health, security posture, and compliance monitoring.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Network className="w-4 h-4" /> Network
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <Shield className="w-4 h-4" /> Security
                    </Button>
                    <Button className="gap-2 shadow-lg shadow-primary/20">
                        <Lock className="w-4 h-4" /> Audit
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">System Health</p>
                                <h3 className="text-2xl font-bold mt-1">{systemHealth}%</h3>
                                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                                    <ArrowUpRight className="w-3 h-3" /> +2% this month
                                </p>
                            </div>
                            <Server className="w-8 h-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Security Incidents</p>
                                <h3 className="text-2xl font-bold mt-1">{dataBreaches}</h3>
                                <p className="text-xs text-muted-foreground mt-1">No breaches this year</p>
                            </div>
                            <Shield className="w-8 h-8 text-red-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Compliance Score</p>
                                <h3 className="text-2xl font-bold mt-1">{complianceScore}%</h3>
                                <p className="text-xs text-muted-foreground mt-1">Across all standards</p>
                            </div>
                            <Lock className="w-8 h-8 text-blue-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">IT Budget</p>
                                <h3 className="text-2xl font-bold mt-1">${(itSpent / 1000).toFixed(1)}K</h3>
                                <p className="text-xs text-muted-foreground mt-1">of ${(itBudget / 1000).toFixed(1)}K</p>
                            </div>
                            <HardDrive className="w-8 h-8 text-purple-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Infrastructure Utilization */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Infrastructure Utilization</CardTitle>
                        <CardDescription>Average utilization across servers and systems</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={infrastructureUtilization}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="cpu" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} name="CPU %" />
                                    <Line type="monotone" dataKey="memory" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} name="Memory %" />
                                    <Line type="monotone" dataKey="storage" stroke="#ffc658" strokeWidth={2} dot={{ r: 4 }} name="Storage %" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Security Metrics */}
                <Card>
                    <CardHeader>
                        <CardTitle>Security Incidents</CardTitle>
                        <CardDescription>Attacks detected vs blocked</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={securityIncidents}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="attacks" fill="#ff4d4f" name="Total Attacks" />
                                    <Bar dataKey="blocked" fill="#52c41a" name="Blocked" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Compliance & Data Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Compliance Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Compliance Status</CardTitle>
                        <CardDescription>Standards and certification status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {complianceStatus.map((standard, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <h4 className="font-medium">{standard.standard}</h4>
                                        <p className="text-sm text-muted-foreground">{standard.status}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-2">
                                            <Badge className={
                                                standard.status === "Compliant" 
                                                    ? "bg-green-100 text-green-700" 
                                                    : "bg-yellow-100 text-yellow-700"
                                            }>
                                                {standard.status}
                                            </Badge>
                                            <span className="font-bold">{standard.score}%</span>
                                        </div>
                                        <Progress value={standard.score} className="mt-2 h-2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Data Sources */}
                <Card>
                    <CardHeader>
                        <CardTitle>Data Sources</CardTitle>
                        <CardDescription>Database and storage health</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {dataSources.map((source, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${
                                            source.health === 'healthy' ? 'bg-green-100' : 
                                            source.health === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                                        }`}>
                                            {source.type === 'MySQL' && <Database className="w-4 h-4 text-gray-600" />}
                                            {source.type === 'Redis' && <Server className="w-4 h-4 text-gray-600" />}
                                            {source.type === 'Object Store' && <Globe className="w-4 h-4 text-gray-600" />}
                                        </div>
                                        <div>
                                            <h4 className="font-medium">{source.name}</h4>
                                            <p className="text-sm text-muted-foreground">{source.type}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-sm ${
                                            source.health === 'healthy' ? 'text-green-600' : 
                                            source.health === 'warning' ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                            {source.health.charAt(0).toUpperCase() + source.health.slice(1)}
                                        </div>
                                        <Progress value={source.usage} className="mt-2 h-2" />
                                        <p className="text-xs text-muted-foreground mt-1">{source.usage}% used</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Risk Assessment */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Risk Assessment
                    </CardTitle>
                    <CardDescription>Identified IT risks and mitigation status</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="w-4 h-4 text-yellow-500" />
                                <span className="font-medium">High Risk</span>
                            </div>
                            <p className="text-sm">2 items</p>
                            <p className="text-xs text-muted-foreground">Database backup, VPN security</p>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4 text-orange-500" />
                                <span className="font-medium">Medium Risk</span>
                            </div>
                            <p className="text-sm">5 items</p>
                            <p className="text-xs text-muted-foreground">Access controls, patching schedule</p>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="font-medium">Mitigated</span>
                            </div>
                            <p className="text-sm">12 items</p>
                            <p className="text-xs text-muted-foreground">Firewall, monitoring, audits</p>
                        </div>
                    </div>
                    
                    <div className="mt-6">
                        <h4 className="font-medium mb-3">Top Priority Items</h4>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                                <span>Database backup redundancy</span>
                                <Badge variant="destructive">High Priority</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <span>VPN security upgrade</span>
                                <Badge variant="default">Medium Priority</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <span>Employee security training</span>
                                <Badge variant="secondary">Low Priority</Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}