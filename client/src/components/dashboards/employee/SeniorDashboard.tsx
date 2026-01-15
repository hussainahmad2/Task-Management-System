import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    Code2, GitPullRequest, MessageSquare, Users, 
    Search, Filter, CheckCircle, XCircle, Clock,
    TrendingUp, Star, Award, Target, FileText, AlertCircle
} from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import { useTasks } from "@/hooks/use-tasks";
import { useOrganizations } from "@/hooks/use-organizations";
import { useEmployees } from "@/hooks/use-employees";

const pullRequests = [
    { id: 1, prNumber: "#1245", title: "Add user authentication", author: "Junior Dev", status: "Open", priority: "High", linesChanged: 245, comments: 3, createdAt: "2024-01-20" },
    { id: 2, prNumber: "#1243", title: "Fix dashboard UI bug", author: "Intern", status: "In Review", priority: "Medium", linesChanged: 45, comments: 1, createdAt: "2024-01-19" },
    { id: 3, prNumber: "#1240", title: "Update API endpoints", author: "Junior Dev", status: "Open", priority: "High", linesChanged: 120, comments: 0, createdAt: "2024-01-18" },
];

const mentees = [
    { id: 1, name: "Junior Dev", role: "Junior Employee", tasksCompleted: 8, tasksPending: 5, progress: 65, avatar: "JD" },
    { id: 2, name: "New Intern", role: "Intern", tasksCompleted: 3, tasksPending: 7, progress: 30, avatar: "NI" },
    { id: 3, name: "Junior Dev 2", role: "Junior Employee", tasksCompleted: 12, tasksPending: 3, progress: 80, avatar: "JD2" },
];

const codeQualityMetrics = [
    { week: "W1", prsReviewed: 8, avgReviewTime: 2.5, bugsCaught: 3 },
    { week: "W2", prsReviewed: 12, avgReviewTime: 2.1, bugsCaught: 5 },
    { week: "W3", prsReviewed: 10, avgReviewTime: 1.8, bugsCaught: 4 },
    { week: "W4", prsReviewed: 14, avgReviewTime: 2.0, bugsCaught: 6 },
];

export function SeniorDashboard() {
    const { data: orgs } = useOrganizations();
    const activeOrg = orgs?.[0];
    const { data: tasks } = useTasks(activeOrg?.id);
    const { data: employees } = useEmployees(activeOrg?.id);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const myTasks = tasks?.filter(t => t.status === "todo" || t.status === "in_progress") || [];
    const assignedPRs = pullRequests.filter(pr => pr.status === "Open" || pr.status === "In Review");
    const totalMentees = mentees.length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Senior Workspace</h2>
                    <p className="text-muted-foreground">High-priority tasks, code reviews, and mentorship management.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <MessageSquare className="w-4 h-4" /> Mentorship
                    </Button>
                    <Button className="gap-2 shadow-lg shadow-primary/20">
                        <GitPullRequest className="w-4 h-4" /> Review PRs
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Assigned PRs</p>
                                <h3 className="text-2xl font-bold mt-1">{assignedPRs.length}</h3>
                                <p className="text-xs text-orange-500 mt-1">{pullRequests.filter(p => p.priority === "High").length} urgent</p>
                            </div>
                            <GitPullRequest className="w-8 h-8 text-primary opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Mentees</p>
                                <h3 className="text-2xl font-bold mt-1">{totalMentees}</h3>
                                <p className="text-xs text-muted-foreground mt-1">Juniors assigned</p>
                            </div>
                            <Users className="w-8 h-8 text-blue-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">My Tasks</p>
                                <h3 className="text-2xl font-bold mt-1">{myTasks.length}</h3>
                                <p className="text-xs text-muted-foreground mt-1">Active sprint items</p>
                            </div>
                            <Code2 className="w-8 h-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Code Quality</p>
                                <h3 className="text-2xl font-bold mt-1">4.8/5</h3>
                                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" /> Excellent
                                </p>
                            </div>
                            <Star className="w-8 h-8 text-purple-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Code Review Activity */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Code Review Activity</CardTitle>
                        <CardDescription>Weekly PR review metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={codeQualityMetrics}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="week" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="prsReviewed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="bugsCaught" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Mentees Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Mentees Progress</CardTitle>
                        <CardDescription>Learning and task completion</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mentees.map((mentee) => (
                                <div key={mentee.id} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                    {mentee.avatar}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-medium">{mentee.name}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{mentee.progress}%</span>
                                    </div>
                                    <Progress value={mentee.progress} className="h-2" />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>{mentee.tasksCompleted} completed</span>
                                        <span>{mentee.tasksPending} pending</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Pull Requests Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle>Pull Requests for Review</CardTitle>
                            <CardDescription>Code reviews assigned to you</CardDescription>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:flex-initial">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search PRs..." 
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
                                    <SelectItem value="Open">Open</SelectItem>
                                    <SelectItem value="In Review">In Review</SelectItem>
                                    <SelectItem value="Approved">Approved</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>PR #</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Lines Changed</TableHead>
                                <TableHead>Comments</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pullRequests.map((pr) => (
                                <TableRow key={pr.id}>
                                    <TableCell className="font-mono font-medium">{pr.prNumber}</TableCell>
                                    <TableCell className="font-medium">{pr.title}</TableCell>
                                    <TableCell>{pr.author}</TableCell>
                                    <TableCell>{pr.linesChanged}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{pr.comments}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={pr.priority === "High" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}>
                                            {pr.priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={pr.status === "Approved" ? "bg-green-100 text-green-700" : 
                                                          pr.status === "In Review" ? "bg-blue-100 text-blue-700" : 
                                                          "bg-orange-100 text-orange-700"}>
                                            {pr.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="ghost" className="text-green-600">
                                                <CheckCircle className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" className="text-red-600">
                                                <XCircle className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost">
                                                <FileText className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
