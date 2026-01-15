import { useEmployees } from "@/hooks/use-employees";
import { useOrganizations } from "@/hooks/use-organizations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    UserPlus,
    Briefcase,
    Calendar,
    DollarSign,
    FileText,
    Bell,
    Search,
    MoreHorizontal,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { Link } from "wouter";

// Mock Data for graphs/widgets where real data isn't fully available yet
const recruitmentData = [
    { name: 'Applied', value: 45, color: '#94a3b8' },
    { name: 'Screening', value: 20, color: '#60a5fa' },
    { name: 'Interview', value: 12, color: '#818cf8' },
    { name: 'Offer', value: 5, color: '#34d399' },
];

const attendanceData = [
    { day: 'Mon', present: 95, absent: 5 },
    { day: 'Tue', present: 92, absent: 8 },
    { day: 'Wed', present: 96, absent: 4 },
    { day: 'Thu', present: 94, absent: 6 },
    { day: 'Fri', present: 90, absent: 10 },
];

const pendingLeaves = [
    { id: 1, name: "Sarah Williams", type: "Sick Leave", dates: "Jan 12-14", status: "Pending", avatar: "SW" },
    { id: 2, name: "Mike Johnson", type: "Vacation", dates: "Feb 1-5", status: "Pending", avatar: "MJ" },
    { id: 3, name: "Emily Davis", type: "Personal", dates: "Jan 20", status: "Pending", avatar: "ED" },
];

const recentActivities = [
    { id: 1, text: "New policy update pending approval", time: "2 hours ago", icon: FileText, color: "text-blue-500" },
    { id: 2, text: "Payroll processing for Jan started", time: "5 hours ago", icon: DollarSign, color: "text-green-500" },
    { id: 3, text: "Interview scheduled with Candidate #42", time: "Yesterday", icon: Users, color: "text-purple-500" },
];

export function HRDashboard() {
    const { data: orgs } = useOrganizations();
    const activeOrg = orgs?.[0];
    const { data: employees } = useEmployees(activeOrg?.id);

    // Stats calculation
    const totalEmployees = employees?.length || 0;
    const activeEmployees = employees?.filter(e => e.isActive).length || 0;
    const newJoinees = employees?.filter(e => {
        const joinDate = new Date(e.joiningDate);
        const monthsAgo = new Date();
        monthsAgo.setMonth(monthsAgo.getMonth() - 1);
        return joinDate > monthsAgo;
    }).length || 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight text-foreground">
                        Human Resources
                    </h2>
                    <p className="text-muted-foreground">
                        Overview of workforce, recruitment, and department activities.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-64 hidden md:block">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search employees, policies..." className="pl-9 bg-background/50" />
                    </div>
                    <Link href="/employees">
                        <Button className="gap-2 shadow-lg shadow-primary/20">
                            <UserPlus className="w-4 h-4" /> Add Employee
                        </Button>
                    </Link>
                </div>
            </div>

            {/* 1. Quick Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-card hover:shadow-md transition-all border-l-4 border-l-primary">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <Users className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Workforce</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-2xl font-bold">{totalEmployees}</h3>
                                    <span className="text-xs text-green-500 flex items-center gap-0.5">
                                        <TrendingUp className="w-3 h-3" /> +12%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card hover:shadow-md transition-all border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500/10 rounded-xl">
                                <CheckCircle className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Employees</p>
                                <h3 className="text-2xl font-bold">{activeEmployees}</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card hover:shadow-md transition-all border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/10 rounded-xl">
                                <Briefcase className="w-6 h-6 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Open Positions</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-2xl font-bold">8</h3>
                                    <span className="text-xs text-muted-foreground">Across 4 depts</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card hover:shadow-md transition-all border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-500/10 rounded-xl">
                                <Clock className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Leave Requests</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-2xl font-bold">5</h3>
                                    <span className="text-xs text-orange-500 font-medium">Action Required</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 2. Recruitment Pipeline - Visual Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center text-lg">
                            Recruitment Pipeline
                            <Button variant="ghost" size="sm" className="text-xs">View All</Button>
                        </CardTitle>
                        <CardDescription>Candidate distribution by hiring stage</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="h-[200px] w-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={recruitmentData}
                                            dataKey="value"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                        >
                                            {recruitmentData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex-1 w-full space-y-4">
                                {recruitmentData.map((item) => (
                                    <div key={item.name} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-sm font-medium">{item.name}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Progress value={item.value * 2} className="w-24 h-2" indicatorColor={item.color} />
                                            <span className="text-sm text-muted-foreground w-8 text-right">{item.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Leave Requests - Action List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Pending Requests</CardTitle>
                        <CardDescription>Leaves requiring approval</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border">
                            {pendingLeaves.map((leave) => (
                                <div key={leave.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs">{leave.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">{leave.name}</p>
                                            <p className="text-xs text-muted-foreground">{leave.type} • {leave.dates}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50">
                                            <CheckCircle className="w-4 h-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                                            <AlertCircle className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-border">
                            <Button variant="outline" className="w-full text-xs">View All Requests</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 4. Weekly Attendance - Bar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Weekly Attendance</CardTitle>
                        <CardDescription>Attendance trends for the current week</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={attendanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="present" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 5. Recent HR Activities */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-lg">Recent Activities</CardTitle>
                        <CardDescription>Departmental updates and logs</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="space-y-6">
                            {recentActivities.map((activity, i) => (
                                <div key={activity.id} className="flex gap-4 relative">
                                    {i !== recentActivities.length - 1 && (
                                        <div className="absolute left-[19px] top-8 bottom-[-24px] w-px bg-border" />
                                    )}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-muted ${activity.color}`}>
                                        <activity.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{activity.text}</p>
                                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 6. Upcoming Reviews */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Upcoming Reviews</CardTitle>
                            <Badge variant="outline">3 Due</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 mt-2">
                            {['Design Team Lead', 'Senior React Dev', 'Product Manager'].map((role, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <span>{role}</span>
                                    <span className="text-muted-foreground text-xs">Due Feb 15</span>
                                </div>
                            ))}
                            <Button variant="link" className="px-0 text-xs w-full justify-start text-primary">Schedule Reviews &rarr;</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* 7. Payroll Summary */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Payroll Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mt-2 text-2xl font-bold font-mono">$142,500</div>
                        <p className="text-xs text-muted-foreground mb-4">Estimated payout for Feb</p>
                        <Progress value={65} className="h-2 mb-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Processing</span>
                            <span>65% Complete</span>
                        </div>
                    </CardContent>
                </Card>

                {/* 8. Announcements Widget */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Bell className="w-4 h-4 text-orange-500" /> Announcements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg border border-orange-100 dark:border-orange-900/50">
                            <p className="text-xs font-semibold text-orange-800 dark:text-orange-300 mb-1">Office Maintenance</p>
                            <p className="text-xs text-orange-600 dark:text-orange-400">Server maintenance scheduled for this Saturday, 10 PM - 2 AM.</p>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-3 text-xs">Post Announcement</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
