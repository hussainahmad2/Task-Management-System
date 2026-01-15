import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    GitBranch, Search, Filter, CheckCircle, XCircle, 
    Clock, TrendingUp, Code2, Users, FileText
} from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const pullRequests = [
    { id: 1, prNumber: "#1245", title: "Add user authentication", author: "John Smith", reviewer: "Sarah Johnson", repository: "backend-api", status: "Open", priority: "High", linesAdded: 245, linesDeleted: 12, filesChanged: 8, comments: 3, createdAt: "2024-01-20" },
    { id: 2, prNumber: "#1243", title: "Fix dashboard UI bug", author: "Mike Chen", reviewer: "Sarah Johnson", repository: "frontend-app", status: "In Review", priority: "Medium", linesAdded: 45, linesDeleted: 23, filesChanged: 3, comments: 1, createdAt: "2024-01-19" },
    { id: 3, prNumber: "#1240", title: "Update database schema", author: "Emily Davis", reviewer: "David Wilson", repository: "backend-api", status: "Approved", priority: "High", linesAdded: 120, linesDeleted: 45, filesChanged: 5, comments: 0, createdAt: "2024-01-18" },
    { id: 4, prNumber: "#1238", title: "Add unit tests", author: "John Smith", reviewer: null, repository: "backend-api", status: "Open", priority: "Low", linesAdded: 320, linesDeleted: 0, filesChanged: 12, comments: 0, createdAt: "2024-01-17" },
];

const reviewStats = [
    { day: "Mon", open: 5, merged: 3 },
    { day: "Tue", open: 7, merged: 4 },
    { day: "Wed", open: 6, merged: 5 },
    { day: "Thu", open: 8, merged: 6 },
    { day: "Fri", open: 4, merged: 2 },
];

export default function CodeReviews() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterPriority, setFilterPriority] = useState("all");

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Approved": return "bg-green-100 text-green-700";
            case "Rejected": return "bg-red-100 text-red-700";
            case "In Review": return "bg-blue-100 text-blue-700";
            case "Open": return "bg-orange-100 text-orange-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "Critical": return "bg-red-100 text-red-700";
            case "High": return "bg-orange-100 text-orange-700";
            case "Medium": return "bg-blue-100 text-blue-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Code Reviews</h2>
                    <p className="text-muted-foreground">Manage pull requests and code review process.</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <GitBranch className="w-4 h-4" /> View Repositories
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Open PRs</p>
                                <h3 className="text-2xl font-bold mt-1">{pullRequests.filter(p => p.status === "Open").length}</h3>
                                <p className="text-xs text-orange-500 mt-1">Needing review</p>
                            </div>
                            <GitBranch className="w-8 h-8 text-orange-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">In Review</p>
                                <h3 className="text-2xl font-bold mt-1">{pullRequests.filter(p => p.status === "In Review").length}</h3>
                                <p className="text-xs text-muted-foreground mt-1">Active reviews</p>
                            </div>
                            <Clock className="w-8 h-8 text-blue-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Merged This Week</p>
                                <h3 className="text-2xl font-bold mt-1">{pullRequests.filter(p => p.status === "Approved").length}</h3>
                                <p className="text-xs text-green-500 mt-1">Completed</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Avg. Review Time</p>
                                <h3 className="text-2xl font-bold mt-1">2.5h</h3>
                                <p className="text-xs text-muted-foreground mt-1">This week</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-purple-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Review Activity Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Review Activity</CardTitle>
                    <CardDescription>PRs opened and merged this week</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reviewStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="open" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="merged" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Pull Requests Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle>Pull Requests</CardTitle>
                            <CardDescription>Manage and review code changes</CardDescription>
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
                                <SelectTrigger className="w-full md:w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Open">Open</SelectItem>
                                    <SelectItem value="In Review">In Review</SelectItem>
                                    <SelectItem value="Approved">Approved</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={filterPriority} onValueChange={setFilterPriority}>
                                <SelectTrigger className="w-full md:w-[150px]">
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priority</SelectItem>
                                    <SelectItem value="Critical">Critical</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>PR</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Reviewer</TableHead>
                                <TableHead>Repository</TableHead>
                                <TableHead>Changes</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pullRequests.map((pr) => (
                                <TableRow key={pr.id}>
                                    <TableCell className="font-mono font-medium">{pr.prNumber}</TableCell>
                                    <TableCell className="font-medium">{pr.title}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback>{pr.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm">{pr.author}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {pr.reviewer ? (
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarFallback>{pr.reviewer.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm">{pr.reviewer}</span>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">Unassigned</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{pr.repository}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <span className="text-green-600">+{pr.linesAdded}</span>
                                            <span className="text-muted-foreground mx-1">/</span>
                                            <span className="text-red-600">-{pr.linesDeleted}</span>
                                            <span className="text-muted-foreground text-xs ml-2">({pr.filesChanged} files)</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(pr.status)}>
                                            {pr.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getPriorityColor(pr.priority)}>
                                            {pr.priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="ghost">
                                                <FileText className="w-4 h-4" />
                                            </Button>
                                            {pr.status === "Open" && (
                                                <Button size="sm" variant="ghost" className="text-green-600">
                                                    <CheckCircle className="w-4 h-4" />
                                                </Button>
                                            )}
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
