import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Calendar, Clock, CheckCircle, XCircle, AlertCircle, 
    Search, Filter, UserPlus, TrendingUp, FileText, 
    Users, CalendarDays, Ban
} from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// Mock data
const pendingLeaves = [
    { id: 1, employee: "Sarah Williams", type: "Sick Leave", dates: "Jan 12-14", days: 3, status: "Pending", avatar: "SW", department: "Engineering" },
    { id: 2, employee: "Mike Johnson", type: "Vacation", dates: "Feb 1-5", days: 5, status: "Pending", avatar: "MJ", department: "Sales" },
    { id: 3, employee: "Emily Davis", type: "Personal", dates: "Jan 20", days: 1, status: "Pending", avatar: "ED", department: "Marketing" },
    { id: 4, employee: "David Chen", type: "Sick Leave", dates: "Jan 25-26", days: 2, status: "Pending", avatar: "DC", department: "Engineering" },
];

const approvedLeaves = [
    { id: 5, employee: "John Smith", type: "Vacation", dates: "Jan 15-22", days: 8, status: "Approved", avatar: "JS", department: "HR" },
    { id: 6, employee: "Lisa Brown", type: "Personal", dates: "Jan 18", days: 1, status: "Approved", avatar: "LB", department: "Finance" },
];

const leaveStats = [
    { month: 'Jan', approved: 12, pending: 5, rejected: 2 },
    { month: 'Feb', approved: 8, pending: 3, rejected: 1 },
    { month: 'Mar', approved: 15, pending: 4, rejected: 0 },
    { month: 'Apr', approved: 10, pending: 6, rejected: 2 },
];

const leaveTypes = [
    { type: "Sick Leave", used: 45, total: 60, color: "bg-red-500" },
    { type: "Vacation", used: 120, total: 180, color: "bg-blue-500" },
    { type: "Personal", used: 15, total: 30, color: "bg-purple-500" },
    { type: "Maternity/Paternity", used: 0, total: 90, color: "bg-pink-500" },
];

export default function LeaveManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Leave Management</h2>
                    <p className="text-muted-foreground">Manage employee leave requests and track leave balances.</p>
                </div>
                <Button className="gap-2 shadow-lg shadow-primary/20">
                    <Calendar className="w-4 h-4" /> Create Leave Policy
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                                <h3 className="text-2xl font-bold mt-1">{pendingLeaves.length}</h3>
                                <p className="text-xs text-orange-500 mt-1">Action Required</p>
                            </div>
                            <Clock className="w-8 h-8 text-orange-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Approved This Month</p>
                                <h3 className="text-2xl font-bold mt-1">{approvedLeaves.length}</h3>
                                <p className="text-xs text-green-500 mt-1">+2 from last month</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Leave Days</p>
                                <h3 className="text-2xl font-bold mt-1">156</h3>
                                <p className="text-xs text-muted-foreground mt-1">This month</p>
                            </div>
                            <CalendarDays className="w-8 h-8 text-blue-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">On Leave Today</p>
                                <h3 className="text-2xl font-bold mt-1">8</h3>
                                <p className="text-xs text-muted-foreground mt-1">Active leaves</p>
                            </div>
                            <Users className="w-8 h-8 text-purple-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Leave Trends Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Leave Trends</CardTitle>
                        <CardDescription>Monthly leave request statistics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={leaveStats}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="approved" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Leave Balance Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Leave Balance Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {leaveTypes.map((lt) => {
                            const percentage = (lt.used / lt.total) * 100;
                            return (
                                <div key={lt.type} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">{lt.type}</span>
                                        <span className="text-muted-foreground">{lt.used} / {lt.total} days</span>
                                    </div>
                                    <Progress value={percentage} className="h-2" />
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            {/* Leave Requests */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle>Leave Requests</CardTitle>
                            <CardDescription>Review and manage employee leave requests</CardDescription>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:flex-initial">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search employees..." 
                                    className="pl-9 w-full md:w-64" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Approved">Approved</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="pending" className="w-full">
                        <TabsList>
                            <TabsTrigger value="pending">
                                Pending ({pendingLeaves.length})
                            </TabsTrigger>
                            <TabsTrigger value="approved">
                                Approved ({approvedLeaves.length})
                            </TabsTrigger>
                            <TabsTrigger value="all">All Requests</TabsTrigger>
                        </TabsList>
                        <TabsContent value="pending" className="mt-6">
                            <div className="space-y-4">
                                {pendingLeaves.map((leave) => (
                                    <div key={leave.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {leave.avatar}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{leave.employee}</p>
                                                <p className="text-sm text-muted-foreground">{leave.department}</p>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium">{leave.type}</p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> {leave.dates} ({leave.days} days)
                                                </p>
                                            </div>
                                        </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                            onClick={() => {
                                                // In real app, would call API to approve leave
                                                alert(`Leave request for ${leave.employee} has been approved`);
                                            }}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-1" /> Approve
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => {
                                                const reason = prompt("Please provide a reason for rejection:");
                                                if (reason) {
                                                    // In real app, would call API to reject leave with reason
                                                    alert(`Leave request for ${leave.employee} has been rejected. Reason: ${reason}`);
                                                }
                                            }}
                                        >
                                            <XCircle className="w-4 h-4 mr-1" /> Reject
                                        </Button>
                                    </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="approved" className="mt-6">
                            <div className="space-y-4">
                                {approvedLeaves.map((leave) => (
                                    <div key={leave.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="bg-green-100 text-green-700">
                                                    {leave.avatar}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{leave.employee}</p>
                                                <p className="text-sm text-muted-foreground">{leave.department}</p>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium">{leave.type}</p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> {leave.dates} ({leave.days} days)
                                                </p>
                                            </div>
                                        </div>
                                        <Badge className="bg-green-100 text-green-700">
                                            <CheckCircle className="w-3 h-3 mr-1" /> Approved
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="all" className="mt-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Dates</TableHead>
                                        <TableHead>Days</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[...pendingLeaves, ...approvedLeaves].map((leave) => (
                                        <TableRow key={leave.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback>{leave.avatar}</AvatarFallback>
                                                    </Avatar>
                                                    {leave.employee}
                                                </div>
                                            </TableCell>
                                            <TableCell>{leave.type}</TableCell>
                                            <TableCell>{leave.dates}</TableCell>
                                            <TableCell>{leave.days}</TableCell>
                                            <TableCell>{leave.department}</TableCell>
                                            <TableCell>
                                                <Badge className={leave.status === "Approved" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}>
                                                    {leave.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
