import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    Users, ClipboardList, CheckCircle2, Clock, AlertCircle,
    Plus, Search, Filter, TrendingUp, Target, MessageSquare,
    UserCheck, FileCheck, ArrowRight
} from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import { useTasks } from "@/hooks/use-tasks";
import { useEmployees } from "@/hooks/use-employees";
import { useOrganizations } from "@/hooks/use-organizations";

const teamMembers = [
    { id: 1, name: "Alice Johnson", role: "Frontend Developer", tasksCompleted: 12, tasksPending: 3, status: "Active", avatar: "AJ" },
    { id: 2, name: "Bob Smith", role: "Backend Developer", tasksCompleted: 15, tasksPending: 2, status: "Active", avatar: "BS" },
    { id: 3, name: "Charlie Brown", role: "UI Designer", tasksCompleted: 8, tasksPending: 4, status: "Active", avatar: "CB" },
    { id: 4, name: "David Wilson", role: "QA Engineer", tasksCompleted: 10, tasksPending: 1, status: "Absent", avatar: "DW" },
];

const pendingApprovals = [
    { id: 1, type: "Timesheet", employee: "Alice Johnson", week: "Jan 8-14", status: "Pending", submittedDate: "2024-01-15" },
    { id: 2, type: "Leave Request", employee: "Bob Smith", details: "Vacation - 3 days", status: "Pending", submittedDate: "2024-01-16" },
    { id: 3, type: "Expense Report", employee: "Charlie Brown", amount: 450, status: "Pending", submittedDate: "2024-01-17" },
    { id: 4, type: "Task Completion", employee: "David Wilson", task: "Fix login bug", status: "Pending", submittedDate: "2024-01-18" },
];

const teamPerformance = [
    { week: "W1", completed: 35, target: 40 },
    { week: "W2", completed: 42, target: 40 },
    { week: "W3", completed: 38, target: 40 },
    { week: "W4", completed: 45, target: 40 },
];

export function AssistantManagerDashboard() {
    const { data: orgs } = useOrganizations();
    const activeOrg = orgs?.[0];
    const { data: tasks } = useTasks(activeOrg?.id);
    const { data: employees } = useEmployees(activeOrg?.id);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const teamTasks = tasks?.filter(t => t.status === "todo" || t.status === "in_progress") || [];
    const completedTasks = tasks?.filter(t => t.status === "completed") || [];
    const totalTeamTasks = teamTasks.length + completedTasks.length;
    const completionRate = totalTeamTasks > 0 ? Math.round((completedTasks.length / totalTeamTasks) * 100) : 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Team Overview</h2>
                    <p className="text-muted-foreground">Daily operations, team task supervision, and approval management.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Users className="w-4 h-4" /> Team Report
                    </Button>
                    <Button className="gap-2 shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4" /> Assign Tasks
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Team Tasks</p>
                                <h3 className="text-2xl font-bold mt-1">{completedTasks.length}/{totalTeamTasks}</h3>
                                <p className="text-xs text-green-500 mt-1">{completionRate}% completion rate</p>
                            </div>
                            <ClipboardList className="w-8 h-8 text-primary opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                                <h3 className="text-2xl font-bold mt-1">{teamMembers.length}</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {teamMembers.filter(m => m.status === "Active").length} active
                                </p>
                            </div>
                            <Users className="w-8 h-8 text-blue-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
                                <h3 className="text-2xl font-bold mt-1">{pendingApprovals.length}</h3>
                                <p className="text-xs text-orange-500 mt-1">Action required</p>
                            </div>
                            <FileCheck className="w-8 h-8 text-orange-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Team Productivity</p>
                                <h3 className="text-2xl font-bold mt-1">High</h3>
                                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" /> +8% this week
                                </p>
                            </div>
                            <Target className="w-8 h-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts and Team Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Team Performance Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Team Performance</CardTitle>
                        <CardDescription>Weekly task completion vs. target</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={teamPerformance}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="week" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="target" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Approvals */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Approvals</CardTitle>
                        <CardDescription>Items requiring your review</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {pendingApprovals.slice(0, 4).map((approval) => (
                                <div key={approval.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="text-sm font-medium">{approval.type}</p>
                                            <p className="text-xs text-muted-foreground">{approval.employee}</p>
                                        </div>
                                        <Badge className="bg-orange-100 text-orange-700">
                                            {approval.status}
                                        </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {approval.week || approval.details || approval.task || `$${approval.amount}`}
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <Button size="sm" variant="outline" className="flex-1 text-green-600 hover:bg-green-50">
                                            <CheckCircle2 className="w-3 h-3 mr-1" /> Approve
                                        </Button>
                                        <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:bg-red-50">
                                            <AlertCircle className="w-3 h-3 mr-1" /> Reject
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4 gap-2">
                            <ArrowRight className="w-4 h-4" /> View All
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Team Members Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle>Team Members</CardTitle>
                            <CardDescription>Manage and monitor team performance</CardDescription>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:flex-initial">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search team..." 
                                    className="pl-9 w-full md:w-64" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-full md:w-[130px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Absent">Absent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Member</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Tasks Completed</TableHead>
                                <TableHead>Pending Tasks</TableHead>
                                <TableHead>Performance</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teamMembers.map((member) => {
                                const totalTasks = member.tasksCompleted + member.tasksPending;
                                const performance = totalTasks > 0 ? Math.round((member.tasksCompleted / totalTasks) * 100) : 0;
                                return (
                                    <TableRow key={member.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="bg-primary/10 text-primary">
                                                        {member.avatar}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{member.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{member.role}</TableCell>
                                        <TableCell>
                                            <span className="font-medium text-green-600">{member.tasksCompleted}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium text-orange-600">{member.tasksPending}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Progress value={performance} className="w-20 h-2" />
                                                <span className="text-sm text-muted-foreground">{performance}%</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={member.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                                                {member.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="ghost">
                                                    <MessageSquare className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost">
                                                    <UserCheck className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
